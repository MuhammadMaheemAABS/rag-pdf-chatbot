import os
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction


class Config:
    """Configuration class for RAG system."""
    
    # Paths
    CHROMA_DB_PATH = "./rag.db"
    
    # Embedding
    EMBEDDING_FUNCTION = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    
    # LLM Models
    MODELS = {
        "detailed": "qwen/qwen3-32b",
        "concise": "openai/gpt-oss-20b"
    }


# Backward compatibility: module-level constants
CHROMA_DB_PATH = Config.CHROMA_DB_PATH
EMBEDDING_FUNCTION = Config.EMBEDDING_FUNCTION
MODELS = Config.MODELS