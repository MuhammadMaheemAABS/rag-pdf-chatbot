import os
from dotenv import load_dotenv
from groq import Groq
from .config import MODELS


class RAGQueryEngine:
    """Handles RAG-based question answering using Groq API."""
    
    def __init__(self, api_key: str = None):
        """
        Initialize the RAG query engine.
        
        Args:
            api_key: Groq API key (defaults to GROK_API_KEY env var)
        """
        load_dotenv()
        if api_key is None:
            api_key = os.getenv("Grok_Api_KEy")
        self.client = Groq(api_key=api_key)
        self.models = MODELS
    
    def query(self, question: str, model_choice: str, collection, mode: str = "concise") -> str:
        """
        Query a document collection using RAG with Groq API.
        
        Args:
            question: The question to ask
            model_choice: Which model to use
            collection: ChromaDB collection to query
            mode: Response mode - "detailed" or "concise"
            
        Returns:
            The AI-generated answer
        """
        result = collection.query(query_texts=[question], n_results=5)  # Increased from 3 to 5 for better context
        # Deduplicate while preserving order
        context_chunks = list(dict.fromkeys(result["documents"][0][:3]))  # Use up to 3 chunks instead of 2
        context = "\n\n".join(context_chunks)

        # Check if the context contains relevant information
        question_lower = question.lower()
        context_lower = context.lower()
        
        # Extract key terms (exclude common question words and short words)
        common_words = {
            'what', 'is', 'are', 'the', 'a', 'an', 'of', 'to', 'in', 'for', 'on', 'at', 'by', 'with', 'as', 'and', 'or', 'but', 'if', 'then', 'than', 'so', 
            'how', 'why', 'when', 'where', 'who', 'which', 'meant', 'means', 'meaning', 'mean', 'does', 'do', 'did', 'can', 'could', 'will', 'would', 'should', 
            'may', 'might', 'must', 'define', 'definition', 'explain', 'tell', 'describe', 'about', 'that', 'this', 'these', 'those'
        }
        import re
        # Remove punctuation and split
        question_clean = re.sub(r'[^\w\s]', '', question_lower)
        query_terms = [word for word in question_clean.split() if len(word) > 2 and word not in common_words]
        
        # Check if any key terms appear in context
        has_relevant_content = len(query_terms) == 0 or any(term in context_lower for term in query_terms)
        
        if not has_relevant_content:
            # If no key query terms found in context, likely irrelevant
            return "I don't know based on the provided document."

        if mode == "detailed":
            system_prompt = (
                "You are an expert tutor who explains concepts clearly and thoroughly. "
                "Using ONLY the provided context, answer the question with a detailed explanation. "
                "Break down complex ideas, define key terms, and show logical reasoning step by step. "
                "Answer the question using ONLY the provided context. Do not use any external knowledge. "
                "If the answer cannot be determined from the context, respond exactly: I don't know based on the provided document."
            )
            # For qwen model, also use single message format to avoid thinking loops
            messages = [
                {"role": "user", "content": f"{system_prompt}\n\nContext:\n{context}\n\nQuestion: {question}"}
            ]
        else:
            system_prompt = (
                "You are a precise and truthful assistant. "
                "Answer the question using ONLY the provided context. "
                "Be concise—one or two sentences max. "
                "Do not output any special tokens, headers, or formatting like <|header_start|>, <|header_end|>, or similar. "
                "Do not provide fallback messages about no question being provided. "
                "If the context does not contain the answer, say: 'I don't know based on the provided document.'"
            )
            # For llama model, use a single user message with the prompt included
            messages = [
                {"role": "user", "content": f"{system_prompt}\n\nContext:\n{context}\n\nQuestion: {question}"}
            ]

        chat_completion = self.client.chat.completions.create(
            messages=messages,
            model=model_choice,
            temperature=0.1,  # Lower temperature for more accurate responses
            max_tokens=4000  # Increased to allow longer responses
        )
        return chat_completion.choices[0].message.content


# Global instance for backward compatibility
_default_query_engine = RAGQueryEngine()

# Backward compatibility: module-level function
def ai(question: str, model_choice: str, collection, mode: str = "concise") -> str:
    """Backward compatibility wrapper for query function."""
    return _default_query_engine.query(question, model_choice, collection, mode)


# Backward compatibility: module-level client
grok_client = _default_query_engine.client