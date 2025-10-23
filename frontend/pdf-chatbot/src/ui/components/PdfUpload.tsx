// src/ui/components/PdfUpload.tsx
"use client";

import React, { useRef, useState } from "react";
import { Box, Paper, Typography, IconButton, Stack } from "@mui/material";
import {
  Upload as UploadIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { z } from "zod";

const PdfFileSchema = z
  .object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
  })
  .refine(
    (file) => {
      const isPdfType = file.type === "application/pdf";
      const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
      return isPdfType || hasPdfExtension;
    },
    {
      message: "File must be a PDF (.pdf)",
    }
  );

interface PdfUploadProps {
  onFileSelect: (file: File | null) => void; // now single file
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);

    if (files.length === 0) {
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    const file = files[0]; // Only take the first file
    const result = PdfFileSchema.safeParse({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!result.success) {
      const errorMsg = result.error.issues[0].message;
      setError(errorMsg);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Upload Zone */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderStyle: "dashed",
          borderColor: error
            ? "error.main"
            : selectedFile
            ? "primary.main"
            : "text.secondary",
          cursor: "pointer",
          "&:hover": { borderColor: "primary.main" },
          backgroundColor: "background.paper",
          borderRadius: 2,
          height: "100%",
        }}
        onClick={triggerFileInput}
      >
        {selectedFile ? (
          <>
            <AttachFileIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2" color="primary" fontWeight="medium">
              {selectedFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click to replace
            </Typography>
          </>
        ) : (
          <>
            <UploadIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
              Click to upload PDF
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports PDF files
            </Typography>
          </>
        )}
      </Paper>

      {/* Error Message */}
      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: "block", textAlign: "center" }}
        >
          {error}
        </Typography>
      )}

      {/* ✅ File List UI (but only ever 0 or 1 file) */}
      {selectedFile && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Stack spacing={1}>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: "primary.main",
                borderRadius: 1,
                backgroundColor: "action.hover",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <AttachFileIcon color="primary" fontSize="small" />
                <Box>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(selectedFile.size)}
                  </Typography>
                </Box>
              </Stack>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering upload zone
                  removeFile();
                }}
                sx={{ color: "text.secondary" }}
                aria-label={`remove ${selectedFile.name}`}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Paper>
          </Stack>
        </Box>
      )}

      {/* Hidden File Input — still allows multiple selection, but we only use first */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept=".pdf,application/pdf"
        // Keep `multiple` so user can re-select even if same file was picked before
        multiple
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default PdfUpload;
