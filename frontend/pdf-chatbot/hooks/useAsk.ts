// // hooks/useAsk.ts
// "use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
});
type AskMode = "detailed" | "concise";

interface AskRequest {
  question: string;
  mode: AskMode; // default: "concise"
  document_id?: string | null; // optional, can be string or null
}

type AskResponse = {
  answer: string;
};

export const useAsk = () => {
  return useMutation<AskResponse, Error, AskRequest>({
    mutationFn: (data) => api.post("/ask", data).then((res) => res.data),
  });
};
