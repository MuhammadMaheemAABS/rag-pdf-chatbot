// hooks/useDocuments.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

export const useDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await api.get<{
        count: number;
        documents: DocumentItem[];
      }>("/documents");
      return response.data;
    },
  });
};
