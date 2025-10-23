import os
from pathlib import Path
import shutil
from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel
from typing import Literal
from rag.ingest import ingest_pdf_if_needed, pdf_hash
from rag.query import ai
from rag.config import MODELS

from typing import Dict

# Global state
document_registry: Dict[str, dict] = {}  # key: doc_hash, value: {filename, collection, path}
latest_doc_hash: str = None

app = FastAPI(title="PDF RAG API", description="Ask questions about your PDF using RAG")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load existing documents
upload_dir = Path("data")
if upload_dir.exists():
    for pdf_file in upload_dir.glob("*.pdf"):
        try:
            doc_hash = pdf_hash(str(pdf_file))
            collection = ingest_pdf_if_needed(str(pdf_file))
            document_registry[doc_hash] = {
                "filename": pdf_file.name,
                "collection_name": collection.name,
                "file_path": str(pdf_file),
                "collection": collection
            }
            latest_doc_hash = doc_hash  # set to last one
        except Exception as e:
            print(f"Failed to load {pdf_file}: {e}")

class AskRequest(BaseModel):
    question: str
    mode: Literal["detailed", "concise"] = "concise"
    document_id: str | None = None

class AskResponse(BaseModel):
    answer: str


    # ______________________________________________________________________________


@app.get("/")
def read_root():
    return {"message": "PDF RAG API is running!"}


# ______________________________________________________________________________



@app.post("/ask", response_model=AskResponse)
def ask_question(request: AskRequest):
    global document_registry, latest_doc_hash

    # Determine which document to use
    if request.document_id:
        if request.document_id not in document_registry:
            raise HTTPException(
                status_code=404,
                detail=f"Document not found. Available IDs: {list(document_registry.keys())}"
            )
        collection = document_registry[request.document_id]["collection"]
    else:
        if latest_doc_hash is None:
            raise HTTPException(status_code=500, detail="No PDF has been uploaded yet.")
        collection = document_registry[latest_doc_hash]["collection"]

    model_choice = MODELS[request.mode]
    try:
        answer = ai(request.question, model_choice, collection, request.mode)
        return AskResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
    

# ______________________________________________________________________________



@app.get("/documents", summary="List all ingested PDF documents")
def list_documents():
    docs = []
    for doc_hash, info in document_registry.items():
        docs.append({
            "document_id": doc_hash,
            "filename": info["filename"],
            "collection_name": info["collection_name"]
        })
    return {
        "count": len(docs),
        "documents": docs
    }



# ______________________________________________________________________________




@app.post("/upload", summary="Upload a PDF and ingest it into the RAG system")
def upload_pdf(file: UploadFile = File(...)):
    global latest_doc_hash, document_registry

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Sanitize filename (basic protection)
    safe_filename = "".join(c for c in file.filename if c.isalnum() or c in "._- ")
    if not safe_filename:
        raise HTTPException(status_code=400, detail="Invalid filename.")

    upload_dir = Path("data")
    upload_dir.mkdir(exist_ok=True)
    file_path = upload_dir / safe_filename

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        from rag.ingest import ingest_pdf_if_needed, pdf_hash
        doc_hash = pdf_hash(str(file_path))
        collection = ingest_pdf_if_needed(str(file_path))

        # Register document
        document_registry[doc_hash] = {
            "filename": safe_filename,
            "collection_name": collection.name,
            "file_path": str(file_path),
            "collection": collection  # keep reference for querying later
        }
        latest_doc_hash = doc_hash

        return {
            "message": "PDF uploaded and ingested successfully.",
            "filename": safe_filename,
            "document_id": doc_hash,
            "collection_name": collection.name
        }
    except Exception as e:
        if file_path.exists():
            file_path.unlink()  # cleanup on failure
        raise HTTPException(status_code=500, detail=f"Failed to ingest PDF: {str(e)}")
    

# ______________________________________________________________________________

@app.delete("/documents/{document_id}", summary="Delete a document and its embeddings")
def delete_document(document_id: str, delete_file: bool = True):
    global document_registry, latest_doc_hash

    if document_id not in document_registry:
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        # 1. Delete ChromaDB collection
        collection = document_registry[document_id]["collection"]
        client = collection._client  # Access the Chroma client
        client.delete_collection(name=collection.name)

        # 2. Optionally delete source PDF
        if delete_file:
            file_path = document_registry[document_id]["file_path"]
            if os.path.exists(file_path):
                os.remove(file_path)

        # 3. Update global state
        del document_registry[document_id]
        if latest_doc_hash == document_id:
            # Set latest to another doc if available, or None
            latest_doc_hash = next(iter(document_registry.keys()), None)

        return {
            "message": "Document deleted successfully.",
            "document_id": document_id,
            "file_deleted": delete_file
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}")