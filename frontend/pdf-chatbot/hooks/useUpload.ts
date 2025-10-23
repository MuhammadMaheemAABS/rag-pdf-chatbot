// hooks/useUpload.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 320000,
});

export interface UploadResponse {
  message: string;
  filename: string;
  document_id: string;
  collection_name: string;
}

export const useUpload = () => {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file); // ✅ Binary file

      // ⚠️ Do NOT set Content-Type — let browser set it with boundary
      const res = await api.post<UploadResponse>("/upload", formData);
      return res.data;
    },
  });
};
