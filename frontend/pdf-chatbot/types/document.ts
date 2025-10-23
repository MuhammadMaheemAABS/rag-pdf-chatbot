// types/document.ts
export interface DocumentItem {
  document_id: string;
  filename: string;
  collection_name: string;
}

export interface DocumentsResponse {
  count: number;
  documents: DocumentItem[];
}
