-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table for RAG
CREATE TABLE IF NOT EXISTS embeddings (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  type TEXT NOT NULL, -- 'configurator', 'product', 'faq', 'blog'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast vector similarity search
CREATE INDEX IF NOT EXISTS embeddings_vector_idx ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for metadata filtering
CREATE INDEX IF NOT EXISTS embeddings_metadata_idx ON embeddings USING gin (metadata);

-- Create index for type filtering
CREATE INDEX IF NOT EXISTS embeddings_type_idx ON embeddings(type);
