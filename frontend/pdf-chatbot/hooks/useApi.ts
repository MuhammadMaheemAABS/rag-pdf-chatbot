// hooks/useApi.ts
"use client";

import { useState, useEffect } from "react";
import api from "../lib/axios";

// --- GET ---
export const useGet = <T>(url: string, autoFetch: boolean = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<T>(url);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [url, autoFetch]);

  return { data, loading, error, refetch: fetch };
};

// --- POST ---
export const usePost = <T, R = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (url: string, body: R) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<T>(url, body);
      setData(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || "Failed to post");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, post };
};

// --- PUT ---
export const usePut = <T, R = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const put = async (url: string, body: R) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put<T>(url, body);
      setData(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || "Failed to update");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, put };
};

// --- PATCH ---
export const usePatch = <T, R = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = async (url: string, body: R) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch<T>(url, body);
      setData(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || "Failed to patch");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, patch };
};

// --- DELETE ---
export const useDelete = <T = void>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const del = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete<T>(url);
      return res.data;
    } catch (err: any) {
      setError(err.message || "Failed to delete");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, del };
};
