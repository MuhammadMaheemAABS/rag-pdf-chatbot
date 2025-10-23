import hashlib
import os
import re
from pypdf import PdfReader
try:
    # langchain package uses 'langchain.text_splitter' in modern versions
    from langchain.text_splitter import RecursiveCharacterTextSplitter
except Exception:
    # Fallback for older or alternate package names
    from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb
from .config import CHROMA_DB_PATH, EMBEDDING_FUNCTION


class PDFIngester:
    """Handles PDF ingestion and storage in ChromaDB."""
    
    def __init__(self, chroma_db_path: str = CHROMA_DB_PATH, embedding_function=None):
        """
        Initialize the PDF ingester.
        
        Args:
            chroma_db_path: Path to ChromaDB database
            embedding_function: Embedding function to use (defaults to Config.EMBEDDING_FUNCTION)
        """
        self.chroma_db_path = chroma_db_path
        self.embedding_function = embedding_function or EMBEDDING_FUNCTION
        self.client = chromadb.PersistentClient(path=self.chroma_db_path)
    
    def pdf_hash(self, pdf_path: str) -> str:
        """Generate a hash for a PDF file."""
        hasher = hashlib.md5()
        with open(pdf_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hasher.update(chunk)
        return hasher.hexdigest()[:16]
    
    def get_or_create_collection_for_pdf(self, pdf_path: str):
        """Get or create a collection for the given PDF."""
        doc_hash = self.pdf_hash(pdf_path)
        collection_name = f"doc_{doc_hash}"
        collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_function
        )
        return collection, doc_hash
    
    def ingest_pdf_if_needed(self, pdf_path: str):
        """Ingest a PDF if it hasn't been ingested yet."""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF not found at {pdf_path}")
        
        collection, _ = self.get_or_create_collection_for_pdf(pdf_path)
        
        if collection.count() == 0:
            reader = PdfReader(pdf_path)
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            text = re.sub(r"\n\s*\d+\s*\n", "\n", text)  # Clean page numbers

            splitter = RecursiveCharacterTextSplitter(
                chunk_size=800,
                chunk_overlap=50,
                separators=["\n\n", "\n", ". ", "!", "?", " ", ""]
            )
            docs = splitter.split_text(text)
            ids = [str(i) for i in range(len(docs))]
            metadatas = [{"source": os.path.basename(pdf_path), "chunk_id": i} for i in range(len(docs))]
            collection.add(documents=docs, ids=ids, metadatas=metadatas)
            print(f"Ingested {len(docs)} chunks into collection.")
        
        return collection


# Global instance for backward compatibility
_default_ingester = PDFIngester()

# Backward compatibility: module-level functions
def pdf_hash(pdf_path: str) -> str:
    """Backward compatibility wrapper."""
    return _default_ingester.pdf_hash(pdf_path)

def get_or_create_collection_for_pdf(pdf_path: str):
    """Backward compatibility wrapper."""
    return _default_ingester.get_or_create_collection_for_pdf(pdf_path)

def ingest_pdf_if_needed(pdf_path: str):
    """Backward compatibility wrapper."""
    return _default_ingester.ingest_pdf_if_needed(pdf_path)


# Initialize default client for backward compatibility
client = _default_ingester.client