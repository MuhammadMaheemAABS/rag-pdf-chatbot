// app/ui/components/FileUpload.tsx
"use client";

import { useState } from "react";
import GenericAutocomplete, {
  GenericAutocompleteOption,
} from "@/ui/common/GenericAutocomplete";
import GenericButton from "@/ui/common/GenericButton";
import GenericCard from "@/ui/common/GenericCard";
import GenericLabel from "@/ui/common/GenericLabel";
import GenericSnackbar from "@/ui/common/GenericSnackbar";
import PdfUpload from "@/ui/components/PdfUpload";
import ConfirmationDialog from "@/ui/components/ConfirmationDialog";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import { useUpload } from "../../hooks/useUpload";
import { useDocuments } from "../../hooks/useDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";
import { DocumentItem } from "../../types/document";

interface ExtendedDocumentItem extends GenericAutocompleteOption {
  document_id: string;
  filename: string;
  collection_name: string;
}
export default function FileUpload({
  onDocumentSelect,
}: {
  onDocumentSelect: (id: string | null) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<ExtendedDocumentItem | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const { mutate: upload, isPending, isError, error, data } = useUpload();
  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    refetch,
  } = useDocuments();
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument();

  const handleUpload = () => {
    if (selectedFile) {
      upload(selectedFile, {
        onSuccess: (uploadData) => {
          setSelectedFile(null);
          refetch(); // Refresh the documents list
          setSnackbar({
            open: true,
            message: `Successfully uploaded: ${uploadData.filename}`,
            severity: "success",
          });
        },
        onError: (err) => {
          setSnackbar({
            open: true,
            message: `Upload failed: ${err.message}`,
            severity: "error",
          });
        },
      });
    }
  };

  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDocument) {
      deleteDocument(selectedDocument.document_id, {
        onSuccess: () => {
          setSelectedDocument(null);
          onDocumentSelect(null);
          setOpenConfirmDialog(false);
          setSnackbar({
            open: true,
            message: "Document deleted successfully",
            severity: "success",
          });
          refetch(); // Refresh the documents list
        },
        onError: (err) => {
          setOpenConfirmDialog(false);
          setSnackbar({
            open: true,
            message: `Deletion failed: ${err.message}`,
            severity: "error",
          });
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <GenericCard
      sx={{
        alignItems: "center",
        justifyContent: "center",
        maxWidth: 1000,
        elevation: 7,
      }}
    >
      <GenericLabel variant="h5" color="primary">
        Upload Your PDF Documents
      </GenericLabel>
      <Divider sx={{ mt: 3, width: 1000 }} />

      <Box sx={{ mt: 4, width: 900, height: 200 }}>
        <PdfUpload onFileSelect={setSelectedFile} />
      </Box>

      <GenericButton
        sx={{ mt: 11, width: 900 }}
        onClick={handleUpload}
        disabled={!selectedFile || isPending}
      >
        {isPending ? "Uploading..." : "Upload Document"}
      </GenericButton>

      {data && (
        <Box sx={{ mt: 2, color: "success.main", textAlign: "center" }}>
          ✅ Uploaded! Document ID: <strong>{data.document_id}</strong>
        </Box>
      )}
      {isError && (
        <Box sx={{ mt: 2, color: "error.main", textAlign: "center" }}>
          ❌ Error: {error?.message}
        </Box>
      )}

      <Divider sx={{ mt: 3, width: 1000 }} />

      {/* ✅ Document Autocomplete */}
      <Box
        sx={{
          mt: 2,
          width: 900,
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          height: 56,
        }}
      >
        <GenericAutocomplete
          sx={{ width: 850 }}
          options={
            documentsData?.documents?.map((doc: DocumentItem) => ({
              id: doc.document_id,
              label: doc.filename,
              ...doc,
            })) || []
          }
          value={selectedDocument}
          onChange={(_, newValue) => {
            const doc = newValue as ExtendedDocumentItem | null;
            setSelectedDocument(doc);
            onDocumentSelect(doc?.document_id || null);
          }}
          loading={isLoadingDocuments}
          placeholder="Select a document..."
        />
        <GenericButton
          onClick={handleDeleteClick}
          disabled={!selectedDocument || isDeleting}
          color="error"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </GenericButton>
      </Box>

      {/* ✅ Confirmation Dialog for Delete */}
      <ConfirmationDialog
        open={openConfirmDialog}
        onClose={handleCancelDelete}
        title="Delete Document"
        content={`Are you sure you want to delete "${selectedDocument?.filename}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* ✅ Snackbar for Upload/Delete Notifications */}
      <GenericSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        autoHideDuration={4000}
      />
    </GenericCard>
  );
}
