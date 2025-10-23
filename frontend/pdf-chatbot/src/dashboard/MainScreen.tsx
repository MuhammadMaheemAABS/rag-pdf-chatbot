"use client";

import React, { useState } from "react";
import GenericLabel from "../ui/common/GenericLabel";
import GenericCard from "@/ui/common/GenericCard";
import DocumentLibraryUploader from "./FileUpload";
import ChatBox from "./ChatBox";
import Box from "@mui/material/Box";
function MainScreen() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  return (
    <>
      <GenericCard sx={{ alignItems: "center", justifyContent: "center" }}>
        <GenericLabel variant="h4" fontWeight={500} color="primary">
          RAG - PDF Chatbot
        </GenericLabel>
        <GenericLabel variant="body2" color="textSecondary">
          A chatbot interface that leverages Retrieval-Augmented Generation
          (RAG) to answer questions based on the content of uploaded PDF
          documents.
        </GenericLabel>
      </GenericCard>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 4,
          mb: 3,
          p: 4,
        }}
      >
        <DocumentLibraryUploader
          onDocumentSelect={setSelectedDocumentId}
        ></DocumentLibraryUploader>
        <ChatBox selectedDocumentId={selectedDocumentId}></ChatBox>
      </Box>
    </>
  );
}

export default MainScreen;
