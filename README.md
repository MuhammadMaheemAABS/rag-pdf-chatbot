# 📄 RAG PDF Chatbot

> A sophisticated chatbot application that leverages Retrieval-Augmented Generation (RAG) to enable intelligent conversations about PDF documents.

---

## 🎯 Overview

**RAG PDF Chatbot** is a full-stack application that combines modern AI capabilities with document processing to create an intelligent chatbot interface. Users can upload PDF documents and ask natural language questions about their content. The system uses a Retrieval-Augmented Generation approach to ground responses in actual document content, ensuring accuracy and relevance.

### Key Features

- 📤 **Easy PDF Upload**: Drag-and-drop interface for uploading PDF documents
- 🤖 **Intelligent Q&A**: Ask questions about PDF content with AI-powered responses
- 🔍 **Smart Retrieval**: Context-aware document retrieval using semantic search
- 📚 **Multiple Documents**: Manage and query multiple PDF files simultaneously
- ⚡ **Dual Response Modes**: Choose between detailed explanations or concise answers
- 🛡️ **Secure Processing**: Server-side PDF processing with content validation
- 🔄 **Document Management**: Upload, view, and delete documents seamlessly

---

## 🏗️ Architecture

The application follows a modern client-server architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                   │
│  React 19 + TypeScript | Material-UI | TailwindCSS          │
│  Real-time API Communication | Query Management             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │ (Axios Client)
┌────────────────────────▼────────────────────────────────────┐
│                     Backend (FastAPI)                       │
│  PDF Upload & Validation | RAG Query Processing            │
│  Document Registry | ChromaDB Integration                  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Data & AI Services                        │
│  ChromaDB (Vector DB) | Groq API | PDF Processing          │
│  Sentence Transformers | LangChain                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend

- **Framework**: FastAPI (Python)
- **Vector Database**: ChromaDB (persistent embeddings)
- **Embeddings**: SentenceTransformer (all-MiniLM-L6-v2)
- **LLM Provider**: Groq API
- **PDF Processing**: PyPDF2, LangChain
- **Text Splitting**: RecursiveCharacterTextSplitter
- **CORS Support**: Configured for frontend integration

### Frontend

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **UI Framework**: Material-UI (MUI) v7
- **Styling**: TailwindCSS 4 + PostCSS
- **HTTP Client**: Axios
- **State Management**: React Query / TanStack Query
- **Build Tool**: Turbopack (via Next.js)
- **Validation**: Zod
- **Animations**: Anime.js

---

## 📋 Prerequisites

Ensure you have the following installed on your system:

| Requirement | Version | Download                             |
| ----------- | ------- | ------------------------------------ |
| Python      | 3.8+    | [python.org](https://www.python.org) |
| Node.js     | 18+     | [nodejs.org](https://nodejs.org)     |
| npm or pnpm | Latest  | Included with Node.js                |
| Git         | Latest  | [git-scm.com](https://git-scm.com)   |

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MuhammadMaheemAABS/rag-pdf-chatbot.git
cd rag-pdf-chatbot
```

### 2. Backend Setup

#### 2.1 Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Linux/macOS
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

#### 2.2 Install Dependencies

```bash
pip install fastapi uvicorn python-multipart python-dotenv
pip install chromadb sentence-transformers
pip install pypdf langchain
pip install groq
```

#### 2.3 Configure Environment Variables

Create a `.env` file in the backend directory:

```env
Grok_Api_KEy=your_groq_api_key_here
```

**How to get a Groq API key:**

1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in to your account
3. Generate a new API key
4. Copy and paste it into your `.env` file

#### 2.4 Run Backend Server

```bash
# From the backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# The API will be available at http://localhost:8000
```

---

### 3. Frontend Setup

#### 3.1 Install Dependencies

```bash
cd frontend/pdf-chatbot

# Using npm
npm install

# Or using pnpm (recommended)
pnpm install
```

#### 3.2 Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 3.3 Run Development Server

```bash
# Using npm
npm run dev

# Or using pnpm
pnpm dev

# The application will be available at http://localhost:3000
```

---

## 📖 API Documentation

### Endpoints Overview

| Method   | Endpoint                   | Description                      |
| -------- | -------------------------- | -------------------------------- |
| `GET`    | `/`                        | Health check                     |
| `POST`   | `/upload`                  | Upload and ingest a PDF          |
| `GET`    | `/documents`               | List all ingested documents      |
| `DELETE` | `/documents/{document_id}` | Delete a document                |
| `POST`   | `/ask`                     | Ask a question about document(s) |

### Detailed Endpoint Specifications

#### 1. **Health Check**

```
GET /
```

**Response:**

```json
{
  "message": "PDF RAG API is running!"
}
```

---

#### 2. **Upload PDF**

```
POST /upload
Content-Type: multipart/form-data

Body: file (PDF file)
```

**Response:**

```json
{
  "message": "PDF uploaded and ingested successfully.",
  "filename": "document.pdf",
  "document_id": "abc123def456",
  "collection_name": "doc_abc123def456"
}
```

**Error Responses:**

- `400`: Invalid file format (must be PDF)
- `400`: Invalid filename
- `500`: Failed to ingest PDF

---

#### 3. **List Documents**

```
GET /documents
```

**Response:**

```json
{
  "count": 2,
  "documents": [
    {
      "document_id": "abc123def456",
      "filename": "research_paper.pdf",
      "collection_name": "doc_abc123def456"
    },
    {
      "document_id": "xyz789uio012",
      "filename": "guide.pdf",
      "collection_name": "doc_xyz789uio012"
    }
  ]
}
```

---

#### 4. **Ask Question**

```
POST /ask
Content-Type: application/json

Body:
{
  "question": "What is the main topic of this document?",
  "mode": "concise",
  "document_id": "abc123def456"
}
```

**Parameters:**

- `question` (string, required): The question to ask
- `mode` (string, optional): Response mode - `"concise"` (default) or `"detailed"`
- `document_id` (string, optional): Specific document ID. If omitted, uses the most recent document

**Response:**

```json
{
  "answer": "The document discusses machine learning algorithms and their applications in modern AI systems."
}
```

**Response Modes:**

- **Concise**: Brief, one-to-two sentence answers using GPT-OSS model
- **Detailed**: Comprehensive explanations with step-by-step reasoning using Qwen3 model

---

#### 5. **Delete Document**

```
DELETE /documents/{document_id}?delete_file=true
```

**Query Parameters:**

- `delete_file` (boolean, default: `true`): Whether to delete the source PDF file

**Response:**

```json
{
  "message": "Document deleted successfully.",
  "document_id": "abc123def456",
  "file_deleted": true
}
```

**Error Response:**

- `404`: Document not found
- `500`: Failed to delete document

---

## 🔄 How RAG Works

### The RAG Pipeline

1. **Document Ingestion**

   - PDF uploaded to backend
   - Text extracted from PDF pages
   - Content cleaned (remove page numbers, etc.)

2. **Text Chunking**

   - Document split into 800-character chunks
   - 50-character overlap between chunks
   - Smart separators maintain semantic coherence

3. **Embedding Generation**

   - Each chunk converted to vector embeddings
   - Using Sentence Transformers (all-MiniLM-L6-v2)
   - Stored in ChromaDB for fast retrieval

4. **Question Processing**

   - User question converted to embeddings
   - Semantic similarity search in ChromaDB
   - Top 5 relevant chunks retrieved and deduplicated

5. **Response Generation**
   - Relevant chunks provided as context
   - Question + context sent to Groq API
   - LLM generates response grounded in context
   - Response returned to user

### Benefits of RAG Approach

✅ **Accuracy**: Responses grounded in actual document content  
✅ **Relevance**: Context-aware answers using semantic search  
✅ **Transparency**: Users can verify sources in context  
✅ **Cost-Effective**: Reduces hallucination, optimizes API calls  
✅ **Scalability**: Handles multiple documents efficiently

---

## 📁 Project Structure

```
rag-pdf-chatbot/
│
├── backend/
│   ├── main.py                 # FastAPI application & endpoints
│   ├── .env                    # Environment variables (API keys)
│   ├── .gitignore              # Git ignore rules
│   ├── data/                   # Uploaded PDF storage
│   ├── rag.db/                 # ChromaDB vector database
│   └── rag/
│       ├── config.py           # Configuration & model setup
│       ├── ingest.py           # PDF ingestion & chunking logic
│       └── query.py            # RAG query engine & Groq integration
│
├── frontend/
│   └── pdf-chatbot/            # Next.js application
│       ├── package.json        # Dependencies & scripts
│       ├── tsconfig.json       # TypeScript configuration
│       ├── next.config.ts      # Next.js configuration
│       ├── tailwind.config.ts  # Tailwind CSS setup
│       ├── theme.ts            # MUI theme configuration
│       │
│       ├── hooks/              # React hooks for API calls
│       │   ├── useApi.ts       # Generic GET/POST/DELETE hooks
│       │   ├── useAsk.ts       # Question asking hook
│       │   ├── useUpload.ts    # PDF upload hook
│       │   ├── useDocuments.ts # Document listing hook
│       │   └── useDeleteDocument.ts # Document deletion hook
│       │
│       ├── lib/                # Utility functions & clients
│       │   ├── axios.ts        # Axios API client configuration
│       │   ├── schemas.ts      # Zod validation schemas
│       │   └── textFormatter.ts # Text formatting utilities
│       │
│       ├── components/         # React components
│       │   ├── PdfUpload.tsx   # PDF file input component
│       │   ├── FormattedTextRenderer.tsx # Rich text display
│       │   └── ConfirmationDialog.tsx # Delete confirmation
│       │
│       ├── src/
│       │   ├── app/            # Next.js app directory
│       │   │   ├── page.tsx    # Home page
│       │   │   ├── layout.tsx  # Root layout
│       │   │   ├── providers.tsx # App providers setup
│       │   │   └── globals.css # Global styles
│       │   │
│       │   ├── dashboard/      # Dashboard components
│       │   │   ├── MainScreen.tsx # Main application view
│       │   │   ├── FileUpload.tsx # Document management UI
│       │   │   └── ChatBox.tsx # Q&A interface
│       │   │
│       │   └── ui/             # Reusable UI components
│       │       ├── common/     # Generic MUI-based components
│       │       │   ├── GenericButton.tsx
│       │       │   ├── GenericTextField.tsx
│       │       │   ├── GenericCard.tsx
│       │       │   ├── GenericLabel.tsx
│       │       │   ├── GenericAutocomplete.tsx
│       │       │   ├── GenericMultiLine.tsx
│       │       │   ├── GenericSnackbar.tsx
│       │       │   └── GenericPaper.tsx
│       │       └── components/ # Complex UI components
│       │
│       ├── types/              # TypeScript type definitions
│       │   └── document.ts     # Document-related types
│       │
│       ├── public/             # Static assets
│       └── .next/              # Next.js build output
│
├── .git/                       # Git repository
├── .gitignore                  # Root git ignore
└── README.md                   # This file
```

---

## 🎨 Frontend Components Overview

### Core Components

**MainScreen** (`src/dashboard/MainScreen.tsx`)

- Main application container
- Manages document selection state
- Coordinates FileUpload and ChatBox components

**FileUpload** (`src/dashboard/FileUpload.tsx`)

- Document library display
- PDF upload interface
- Document listing with delete functionality

**ChatBox** (`src/dashboard/ChatBox.tsx`)

- Question input interface
- Response display area
- Mode selection (concise/detailed)
- Conversation history

### Reusable UI Components

Generic components for consistent UI patterns:

- `GenericButton`: Customizable action buttons
- `GenericTextField`: Text input fields
- `GenericCard`: Card containers with theming
- `GenericLabel`: Typography component
- `GenericAutocomplete`: Dropdown selection
- `GenericMultiLine`: Multi-line text input
- `GenericSnackbar`: Toast notifications
- `GenericPaper`: Material paper containers

---

## 🧠 Backend Processing Details

### PDF Ingestion Process (`rag/ingest.py`)

1. **Hash Generation**: MD5 hash first 16 chars of PDF file
2. **Collection Creation**: Creates unique ChromaDB collection per PDF
3. **Text Extraction**: PyPDF2 extracts text from all pages
4. **Text Cleaning**: Removes page numbers and extra whitespace
5. **Chunking**: RecursiveCharacterTextSplitter with:
   - Chunk size: 800 characters
   - Overlap: 50 characters
   - Smart separators for semantic coherence
6. **Embedding**: Converts chunks to embeddings
7. **Storage**: Stores in ChromaDB with metadata

### Query Engine (`rag/query.py`)

1. **Semantic Search**: Finds 5 most relevant chunks
2. **Deduplication**: Removes duplicate context while preserving order
3. **Context Building**: Combines top 3 chunks as context
4. **Prompt Engineering**: Uses different system prompts for modes
5. **LLM Inference**: Calls Groq API with context and question
6. **Response Return**: Returns grounded, factual answer

### Configuration (`rag/config.py`)

```python
Models Used:
├── Detailed Mode: qwen/qwen3-32b (comprehensive explanations)
└── Concise Mode: openai/gpt-oss-20b (brief, focused answers)

Embeddings: all-MiniLM-L6-v2 (384-dimensional vectors)
Database: ChromaDB (persisted at ./rag.db)
```

---

## 🔑 Key Features Explained

### Multi-Document Support

- Each PDF gets a unique collection in ChromaDB
- Document ID (hash) enables querying specific documents
- User can switch between documents in UI
- Latest uploaded document is default

### Response Modes

- **Concise**: Single-turn, factual answers (GPT-OSS model)
- **Detailed**: Multi-step explanations with reasoning (Qwen3 model)

### Security Features

- Filename sanitization to prevent path traversal
- PDF-only validation on upload
- CORS configured for frontend origin
- Server-side file processing
- Automatic cleanup on ingestion failure

### Document Management

- View all uploaded documents
- Delete documents (removes embeddings + file)
- Track document metadata (filename, collection name)
- Persistent storage across sessions

---

## 📊 Performance Considerations

### Optimization Features

- **Vector Similarity Search**: O(log n) retrieval using ChromaDB
- **Context Deduplication**: Reduces redundant information
- **Configurable Chunk Size**: Balance between context and precision
- **Temperature: 0.1**: Low temperature for deterministic responses
- **Max Tokens: 4000**: Sufficient for detailed explanations

### Scalability

| Metric           | Capacity                   |
| ---------------- | -------------------------- |
| Documents        | Limited by disk space      |
| Document Size    | Up to 10,000+ pages        |
| Concurrent Users | Limited by API rate limits |
| Response Time    | ~2-5 seconds typically     |

---

## 🧪 Testing the Application

### Manual Testing Workflow

1. **Start Backend**

   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload
   ```

2. **Start Frontend**

   ```bash
   cd frontend/pdf-chatbot
   pnpm dev
   ```

3. **Test Upload**

   - Navigate to http://localhost:3000
   - Use the FileUpload component to upload a PDF
   - Verify success message

4. **Test Q&A**

   - Ask a question in ChatBox
   - Test both "concise" and "detailed" modes
   - Verify answers are grounded in document

5. **Test Document Management**
   - Upload multiple PDFs
   - Switch between documents
   - Delete a document
   - Verify it's removed from the list

### Example Test PDF Content

For testing, create a simple PDF with content like:

```
Document Title: Introduction to Machine Learning

Machine learning is a subset of artificial intelligence that focuses on
training algorithms to learn patterns from data without explicit programming.

Types of Machine Learning:
1. Supervised Learning - Learning with labeled data
2. Unsupervised Learning - Finding patterns in unlabeled data
3. Reinforcement Learning - Learning through rewards and penalties
```

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

**Issue**: "ModuleNotFoundError: No module named 'groq'"

```bash
# Solution: Install required packages
pip install groq
```

**Issue**: "Grok_Api_KEy is None"

```bash
# Solution: Ensure .env file exists with correct API key
echo "Grok_Api_KEy=your_key_here" > backend/.env
```

**Issue**: "ChromaDB connection error"

```bash
# Solution: Ensure ./data directory exists and has write permissions
mkdir -p backend/data
chmod 755 backend/data
```

#### Frontend Issues

**Issue**: "Cannot connect to backend API"

```bash
# Solution: Verify API URL and backend is running
NEXT_PUBLIC_API_URL=http://localhost:8000
# Then restart: pnpm dev
```

**Issue**: "Port 3000 already in use"

```bash
# Solution: Use different port
npm run dev -- -p 3001
```

---

## 📦 Environment Variables Reference

### Backend `.env`

```env
# Groq API Configuration (Required)
Grok_Api_KEy=gsk_your_api_key_here

# Optional: Database path (defaults to ./rag.db)
# CHROMA_DB_PATH=./rag.db
```

### Frontend `.env.local`

```env
# API Configuration (Required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Deployment configurations
# NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## 🚀 Deployment

### Backend Deployment (Cloud)

**Using Render/Railway:**

1. Push code to GitHub
2. Connect repository to platform
3. Set environment variables (Grok API key)
4. Platform automatically deploys on push

**Using Docker:**

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set `NEXT_PUBLIC_API_URL` to production backend
4. Deploy

---

## 📝 License

This project is open source. Check LICENSE file for details.

---

## 🤝 Support & Contact

For issues, questions, or suggestions:

- 📧 Email: [muhammad.maheem@artificialautomationbizsol.com]
- 🐛 Issues: [GitHub Issues](https://github.com/MuhammadMaheemAABS/rag-pdf-chatbot/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/MuhammadMaheemAABS/rag-pdf-chatbot/discussions)

---

## 🙏 Acknowledgments

- **FastAPI**: Modern Python web framework
- **ChromaDB**: Vector database for embeddings
- **Groq**: Fast LLM inference API
- **Next.js**: React framework with SSR
- **Material-UI**: Professional component library
- **LangChain**: Framework for building LLM applications

---

<div align="center">

**Made with ❤️ by the Development Team**

[⬆ back to top](#-rag-pdf-chatbot)

</div>
