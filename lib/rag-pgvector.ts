// lib/rag-pgvector.ts
// RAG implementation using PostgreSQL with pgvector extension

import { prisma } from './prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dimensions, cheap & fast
const EMBEDDING_DIMENSIONS = 1536;

export type EmbeddingMetadata = {
  configuratorId?: string;
  category?: string;
  url?: string;
  keywords?: string[];
  [key: string]: any;
};

/**
 * Generate embedding vector from text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text.slice(0, 8000), // Limit to ~8k chars to avoid token limits
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('[RAG] Error generating embedding:', error);
    throw error;
  }
}

/**
 * Index a document with its embedding
 */
export async function indexDocument(
  id: string,
  content: string,
  type: 'configurator' | 'product' | 'faq' | 'blog',
  metadata?: EmbeddingMetadata
): Promise<void> {
  try {
    const embedding = await generateEmbedding(content);
    
    // Store embedding as JSON (no pgvector needed)
    // @ts-expect-error - Prisma client types not fully loaded yet
    await prisma.embedding.upsert({
      where: { id },
      create: {
        id,
        content,
        embedding: embedding as any, // JSON array
        metadata: metadata || {},
        type,
      },
      update: {
        content,
        embedding: embedding as any,
        metadata: metadata || {},
        type,
        updatedAt: new Date(),
      },
    });
    
    console.log(`[RAG] Indexed document: ${id} (type: ${type})`);
  } catch (error) {
    console.error(`[RAG] Error indexing document ${id}:`, error);
    throw error;
  }
}

/**
 * Batch index multiple documents efficiently
 */
export async function batchIndexDocuments(
  documents: Array<{
    id: string;
    content: string;
    type: 'configurator' | 'product' | 'faq' | 'blog';
    metadata?: EmbeddingMetadata;
  }>
): Promise<void> {
  console.log(`[RAG] Batch indexing ${documents.length} documents...`);
  
  for (const doc of documents) {
    await indexDocument(doc.id, doc.content, doc.type, doc.metadata);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`[RAG] Batch indexing complete!`);
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Search for similar documents using vector similarity
 */
export async function semanticSearch(
  query: string,
  options: {
    limit?: number;
    type?: 'configurator' | 'product' | 'faq' | 'blog';
    minSimilarity?: number;
  } = {}
): Promise<Array<{
  id: string;
  content: string;
  metadata: EmbeddingMetadata;
  type: string;
  similarity: number;
}>> {
  const { limit = 5, type, minSimilarity = 0.5 } = options;
  
  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);
    
    // Fetch all embeddings of the specified type
    // @ts-expect-error - Prisma client types not fully loaded yet
    const embeddings = await prisma.embedding.findMany({
      where: type ? { type } : {},
    });
    
    // Calculate similarities in-memory
    const results = embeddings
      .map((doc: any) => ({
        id: doc.id,
        content: doc.content,
        metadata: (doc.metadata as any) || {},
        type: doc.type,
        similarity: cosineSimilarity(queryEmbedding, doc.embedding as any),
      }))
      .filter((r: any) => r.similarity >= minSimilarity)
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, limit);
    
    return results;
  } catch (error) {
    console.error('[RAG] Error in semantic search:', error);
    return [];
  }
}

/**
 * Hybrid search: combine semantic + keyword matching
 */
export async function hybridSearch(
  query: string,
  options: {
    limit?: number;
    type?: 'configurator' | 'product' | 'faq' | 'blog';
    keywords?: string[];
  } = {}
): Promise<Array<{
  id: string;
  content: string;
  metadata: EmbeddingMetadata;
  type: string;
  similarity: number;
  keywordMatch: boolean;
}>> {
  const semanticResults = await semanticSearch(query, options);
  
  // If keywords provided, boost results that match
  if (options.keywords && options.keywords.length > 0) {
    return semanticResults.map(result => ({
      ...result,
      keywordMatch: options.keywords!.some(kw => 
        result.content.toLowerCase().includes(kw.toLowerCase()) ||
        result.metadata.keywords?.some(k => k.toLowerCase().includes(kw.toLowerCase()))
      )
    })).sort((a, b) => {
      // Prioritize keyword matches
      if (a.keywordMatch && !b.keywordMatch) return -1;
      if (!a.keywordMatch && b.keywordMatch) return 1;
      // Then by similarity
      return b.similarity - a.similarity;
    });
  }
  
  return semanticResults.map(r => ({ ...r, keywordMatch: false }));
}

/**
 * Get recommendations based on user query for configurators
 */
export async function getConfiguratorRecommendations(
  userQuery: string,
  limit: number = 3
): Promise<Array<{
  configuratorId: string;
  name: string;
  url: string;
  similarity: number;
  reason: string;
}>> {
  const results = await semanticSearch(userQuery, {
    limit,
    type: 'configurator',
    minSimilarity: 0.6 // Higher threshold for configurators
  });
  
  return results.map(r => ({
    configuratorId: r.metadata.configuratorId || r.id,
    name: r.metadata.name || r.id,
    url: r.metadata.url || '/',
    similarity: r.similarity,
    reason: `Potrivire ${(r.similarity * 100).toFixed(0)}% cu cerința ta`
  }));
}

/**
 * Delete all embeddings of a specific type (useful for reindexing)
 */
export async function clearEmbeddingsByType(type: 'configurator' | 'product' | 'faq' | 'blog'): Promise<void> {
  // @ts-expect-error - Prisma client types not fully loaded yet
  await prisma.embedding.deleteMany({
    where: { type }
  });
  console.log(`[RAG] Cleared all embeddings of type: ${type}`);
}

/**
 * Get statistics about indexed embeddings
 */
export async function getIndexStats(): Promise<{
  total: number;
  byType: Record<string, number>;
}> {
  // @ts-expect-error - Prisma client types not fully loaded yet
  const total = await prisma.embedding.count();
  // @ts-expect-error - Prisma client types not fully loaded yet
  const byType = await prisma.embedding.groupBy({
    by: ['type'],
    _count: true
  });
  
  return {
    total,
    byType: Object.fromEntries(
      byType.map((item: any) => [item.type, item._count])
    )
  };
}
