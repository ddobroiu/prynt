// lib/rag-assistant-integration.ts
// Integration between RAG and AI Assistant

import { getConfiguratorRecommendations, semanticSearch } from './rag-pgvector';
import { CONFIGURATORS_REGISTRY, findConfigurator } from './configurators-registry';

export type ConfiguratorRecommendation = {
  id: string;
  name: string;
  url: string;
  description: string;
  confidence: number;
  reasons: string[];
  quickInfo: {
    turnaroundTime: string;
    priceRange: string;
    materials: string[];
  };
};

/**
 * Get smart configurator recommendations based on user query
 * Combines RAG search with business logic
 */
export async function getSmartConfiguratorRecommendations(
  userQuery: string,
  options: {
    limit?: number;
    includeAlternatives?: boolean;
  } = {}
): Promise<{
  primary: ConfiguratorRecommendation | null;
  alternatives: ConfiguratorRecommendation[];
  searchQuery: string;
}> {
  const { limit = 3, includeAlternatives = true } = options;
  
  try {
    // Perform RAG semantic search
    const ragResults = await getConfiguratorRecommendations(userQuery, limit);
    
    if (ragResults.length === 0) {
      return {
        primary: null,
        alternatives: [],
        searchQuery: userQuery
      };
    }
    
    // Convert to detailed recommendations
    const recommendations = ragResults.map(result => {
      const config = findConfigurator({ id: result.configuratorId });
      
      if (!config) {
        return null;
      }
      
      // Extract price range from bands
      let priceRange = 'Preț variabil';
      if (config.pricing.bands && config.pricing.bands.length > 0) {
        const minPrice = config.pricing.bands[config.pricing.bands.length - 1].price;
        const maxPrice = config.pricing.bands[0].price;
        priceRange = `${minPrice}-${maxPrice} RON/${config.pricing.type === 'per_sqm' ? 'mp' : 'buc'}`;
      }
      
      // Build contextual reasons why this configurator matches
      const reasons: string[] = [result.reason];
      
      // Add material-specific reasons
      const queryLower = userQuery.toLowerCase();
      if (queryLower.includes('exterior') || queryLower.includes('outdoor')) {
        const outdoorMaterials = config.materials.filter(m => 
          m.description.toLowerCase().includes('exterior') || 
          m.description.toLowerCase().includes('outdoor')
        );
        if (outdoorMaterials.length > 0) {
          reasons.push(`Materiale rezistente exterior: ${outdoorMaterials[0].name}`);
        }
      }
      
      if (queryLower.includes('rapid') || queryLower.includes('urgent')) {
        const days = parseInt(config.turnaroundTime.match(/\d+/)?.[0] || '5');
        if (days <= 3) {
          reasons.push(`Producție rapidă: ${config.turnaroundTime}`);
        }
      }
      
      // Check for dimension mentions
      const dimensionMatch = queryLower.match(/(\d+)\s*[xх×]\s*(\d+)/);
      if (dimensionMatch && config.dimensions.type === 'custom') {
        const [, width, height] = dimensionMatch;
        const w = parseInt(width);
        const h = parseInt(height);
        
        if (
          w >= (config.dimensions.minWidth || 0) && 
          w <= (config.dimensions.maxWidth || 9999) &&
          h >= (config.dimensions.minHeight || 0) && 
          h <= (config.dimensions.maxHeight || 9999)
        ) {
          reasons.push(`Dimensiunea ${w}×${h}cm este disponibilă`);
        }
      }
      
      return {
        id: config.id,
        name: config.name,
        url: config.url,
        description: config.description,
        confidence: result.similarity,
        reasons,
        quickInfo: {
          turnaroundTime: config.turnaroundTime,
          priceRange,
          materials: config.materials.slice(0, 3).map(m => m.name)
        }
      };
    }).filter(Boolean) as ConfiguratorRecommendation[];
    
    return {
      primary: recommendations[0] || null,
      alternatives: includeAlternatives ? recommendations.slice(1) : [],
      searchQuery: userQuery
    };
  } catch (error) {
    console.error('[RAG Assistant] Error getting recommendations:', error);
    return {
      primary: null,
      alternatives: [],
      searchQuery: userQuery
    };
  }
}

/**
 * Answer specific questions about a configurator using RAG
 */
export async function answerConfiguratorQuestion(
  configuratorId: string,
  question: string
): Promise<string | null> {
  try {
    // Search within the specific configurator's embedding
    const results = await semanticSearch(question, {
      limit: 1,
      type: 'configurator',
      minSimilarity: 0.7
    });
    
    const match = results.find(r => r.metadata.configuratorId === configuratorId);
    
    if (match) {
      // Extract relevant snippet from content
      const questionLower = question.toLowerCase();
      const contentLower = match.content.toLowerCase();
      
      // Find FAQ match first
      if (contentLower.includes('întrebări frecvente')) {
        const faqSection = match.content.split('Întrebări frecvente')[1];
        if (faqSection) {
          // Try to find matching Q&A
          const lines = faqSection.split('\n');
          for (let i = 0; i < lines.length - 1; i++) {
            if (lines[i].startsWith('**Î**:') && 
                lines[i].toLowerCase().includes(questionLower.split(' ')[0])) {
              return lines[i + 1].replace('**R**:', '').trim();
            }
          }
        }
      }
      
      // Otherwise return most relevant paragraph
      const paragraphs = match.content.split('\n\n');
      for (const para of paragraphs) {
        if (para.toLowerCase().includes(questionLower) || 
            question.split(' ').some(word => 
              word.length > 4 && para.toLowerCase().includes(word.toLowerCase())
            )) {
          return para.trim();
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('[RAG Assistant] Error answering question:', error);
    return null;
  }
}

/**
 * Get context for AI assistant based on conversation
 */
export async function getConversationContext(
  messages: Array<{ role: string; content: string }>,
  limit: number = 3
): Promise<string> {
  // Extract last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!lastUserMessage) {
    return '';
  }
  
  // Get relevant configurators
  const recommendations = await getSmartConfiguratorRecommendations(
    lastUserMessage.content,
    { limit, includeAlternatives: true }
  );
  
  if (!recommendations.primary) {
    return '';
  }
  
  let context = `CONTEXT CONFIGURATOARE RELEVANTE:\n\n`;
  
  // Primary recommendation
  context += `🎯 RECOMANDAT PRINCIPAL: ${recommendations.primary.name}\n`;
  context += `URL: ${recommendations.primary.url}\n`;
  context += `Descriere: ${recommendations.primary.description}\n`;
  context += `Producție: ${recommendations.primary.quickInfo.turnaroundTime}\n`;
  context += `Preț orientativ: ${recommendations.primary.quickInfo.priceRange}\n`;
  context += `Motive: ${recommendations.primary.reasons.join(', ')}\n\n`;
  
  // Alternatives
  if (recommendations.alternatives.length > 0) {
    context += `ALTERNATIVE:\n`;
    recommendations.alternatives.forEach((alt, idx) => {
      context += `${idx + 1}. ${alt.name} (${alt.url}) - ${alt.quickInfo.priceRange}\n`;
    });
    context += `\n`;
  }
  
  context += `INSTRUCȚIUNE: Folosește informațiile de mai sus pentru a răspunde precis la întrebarea clientului. Recomandă configuratorul principal și oferă linkul direct.`;
  
  return context;
}
