// scripts/index-configurators.ts
// Script to index all configurators into pgvector for RAG

import { 
  CONFIGURATORS_REGISTRY, 
  generateConfiguratorDescription 
} from '../lib/configurators-registry';
import { 
  batchIndexDocuments, 
  clearEmbeddingsByType,
  getIndexStats 
} from '../lib/rag-pgvector';

async function indexAllConfigurators() {
  console.log('🚀 Starting configurators indexing...\n');
  
  // Optional: Clear old configurator embeddings
  console.log('🗑️  Clearing old configurator embeddings...');
  await clearEmbeddingsByType('configurator');
  
  // Prepare documents for indexing
  const documents = CONFIGURATORS_REGISTRY.map(config => {
    const content = generateConfiguratorDescription(config);
    
    return {
      id: `configurator-${config.id}`,
      content,
      type: 'configurator' as const,
      metadata: {
        configuratorId: config.id,
        name: config.name,
        slug: config.slug,
        url: config.url,
        category: config.category,
        keywords: config.keywords,
        useCases: config.useCases,
        materials: config.materials.map(m => m.name),
        pricingType: config.pricing.type,
        turnaroundTime: config.turnaroundTime
      }
    };
  });
  
  console.log(`📝 Prepared ${documents.length} configurators for indexing\n`);
  
  // Index all documents
  await batchIndexDocuments(documents);
  
  // Show stats
  const stats = await getIndexStats();
  console.log('\n✅ Indexing complete!');
  console.log('📊 Statistics:', stats);
  
  console.log('\n🎯 Indexed configurators:');
  CONFIGURATORS_REGISTRY.forEach(c => {
    console.log(`   - ${c.name} (${c.url})`);
  });
}

// Run if executed directly
if (require.main === module) {
  indexAllConfigurators()
    .then(() => {
      console.log('\n✨ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { indexAllConfigurators };
