// hooks/useDeleteDocument.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (document_id: string) => {
      await api.delete(`/documents/${document_id}`);
    },
    onSuccess: () => {
      // ✅ Automatically refetch the documents list after deletion
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};
