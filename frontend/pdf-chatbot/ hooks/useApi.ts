// hooks/useApi.ts
"use client"; // Mark as client hook

import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

// GET
export const useGet = <T = unknown>(
  key: string[],
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: key,
    queryFn: () => apiClient.get<T>(url, config).then((res) => res.data),
    ...options,
  });
};

// POST
export const usePost = <T = unknown, R = unknown>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<T, unknown, R>
) => {
  return useMutation({
    mutationFn: (data: R) =>
      apiClient.post<T>(url, data, config).then((res) => res.data),
    ...options,
  });
};

// PUT
export const usePut = <T = unknown, R = unknown>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<T, unknown, R>
) => {
  return useMutation({
    mutationFn: (data: R) =>
      apiClient.put<T>(url, data, config).then((res) => res.data),
    ...options,
  });
};

// PATCH
export const usePatch = <T = unknown, R = unknown>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<T, unknown, R>
) => {
  return useMutation({
    mutationFn: (data: R) =>
      apiClient.patch<T>(url, data, config).then((res) => res.data),
    ...options,
  });
};

// DELETE
export const useDelete = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<T, unknown, void>
) => {
  return useMutation({
    mutationFn: () => apiClient.delete<T>(url, config).then((res) => res.data),
    ...options,
  });
};
