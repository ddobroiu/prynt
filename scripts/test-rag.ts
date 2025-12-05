// scripts/test-rag.ts
// Test script for RAG functionality

import { 
  generateEmbedding,
  semanticSearch,
  getConfiguratorRecommendations,
  getIndexStats,
  hybridSearch
} from '../lib/rag-pgvector';
import { getSmartConfiguratorRecommendations } from '../lib/rag-assistant-integration';

async function testRAG() {
  console.log('🧪 Testing RAG Implementation\n');
  
  // 1. Check index stats
  console.log('📊 Index Statistics:');
  const stats = await getIndexStats();
  console.log(stats);
  console.log('');
  
  if (stats.total === 0) {
    console.log('⚠️  No documents indexed! Run: npm run rag:index');
    return;
  }
  
  // 2. Test queries
  const testQueries = [
    'Vreau bannere pentru exterior rezistente la ploaie',
    'Autocolante pentru vitrină magazin',
    'Tablou canvas personalizat cu fotografie',
    'Materiale rigide pentru placă firmă outdoor',
    'Roll up pentru târguri și evenimente',
    'Folie pentru geamuri cu vizibilitate unidirecțională',
    'Panouri fonduri europene PNRR',
    'Flyers A6 pentru distribuție stradală',
    'Tapet personalizat pentru perete living'
  ];
  
  console.log('🔍 Testing Semantic Search:\n');
  
  for (const query of testQueries) {
    console.log(`Query: "${query}"`);
    
    // Basic semantic search
    const results = await semanticSearch(query, { limit: 3, type: 'configurator' });
    
    if (results.length > 0) {
      console.log('  Top matches:');
      results.forEach((r, idx) => {
        console.log(`    ${idx + 1}. ${r.metadata.name} (${(r.similarity * 100).toFixed(1)}% match)`);
        console.log(`       URL: ${r.metadata.url}`);
      });
    } else {
      console.log('  ❌ No matches found');
    }
    console.log('');
  }
  
  // 3. Test smart recommendations
  console.log('\n💡 Testing Smart Recommendations:\n');
  
  const smartQuery = 'Am nevoie de bannere mari 3m x 2m pentru o expoziție outdoor care durează 6 luni';
  console.log(`Query: "${smartQuery}"\n`);
  
  const recommendations = await getSmartConfiguratorRecommendations(smartQuery, {
    limit: 3,
    includeAlternatives: true
  });
  
  if (recommendations.primary) {
    console.log(`🎯 PRIMARY RECOMMENDATION:`);
    console.log(`   ${recommendations.primary.name}`);
    console.log(`   Confidence: ${(recommendations.primary.confidence * 100).toFixed(1)}%`);
    console.log(`   URL: ${recommendations.primary.url}`);
    console.log(`   Producție: ${recommendations.primary.quickInfo.turnaroundTime}`);
    console.log(`   Preț: ${recommendations.primary.quickInfo.priceRange}`);
    console.log(`   Reasons:`);
    recommendations.primary.reasons.forEach(r => console.log(`     - ${r}`));
    
    if (recommendations.alternatives.length > 0) {
      console.log(`\n   ALTERNATIVES:`);
      recommendations.alternatives.forEach((alt, idx) => {
        console.log(`     ${idx + 1}. ${alt.name} (${(alt.confidence * 100).toFixed(1)}%)`);
        console.log(`        ${alt.url} - ${alt.quickInfo.priceRange}`);
      });
    }
  } else {
    console.log('❌ No recommendations found');
  }
  
  // 4. Test hybrid search
  console.log('\n\n🔀 Testing Hybrid Search:\n');
  
  const hybridQuery = 'banner pvc exterior 440g';
  console.log(`Query: "${hybridQuery}"\n`);
  
  const hybridResults = await hybridSearch(hybridQuery, {
    limit: 5,
    type: 'configurator',
    keywords: ['banner', 'pvc', 'exterior']
  });
  
  hybridResults.forEach((r, idx) => {
    console.log(`${idx + 1}. ${r.metadata.name}`);
    console.log(`   Similarity: ${(r.similarity * 100).toFixed(1)}%`);
    console.log(`   Keyword match: ${r.keywordMatch ? '✅ Yes' : '❌ No'}`);
    console.log(`   URL: ${r.metadata.url}`);
    console.log('');
  });
  
  console.log('\n✅ RAG Testing Complete!');
}

// Run tests
if (require.main === module) {
  testRAG()
    .then(() => {
      console.log('\n🎉 All tests completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Test error:', error);
      process.exit(1);
    });
}

export { testRAG };
