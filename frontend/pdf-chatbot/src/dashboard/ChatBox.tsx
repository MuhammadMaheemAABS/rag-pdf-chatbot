import GenericButton from "@/ui/common/GenericButton";
import GenericCard from "@/ui/common/GenericCard";
import GenericLabel from "@/ui/common/GenericLabel";
import GenericPaper from "@/ui/common/GenericPaper";
import GenericSnackbar from "@/ui/common/GenericSnackbar";
import GenericTextField from "@/ui/common/GenericTextField";
import FormattedTextRenderer from "@/ui/components/FormattedTextRenderer";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import { useState, useRef, useEffect } from "react";
import { useAsk } from "../../hooks/useAsk";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export default function ChatBox({
  selectedDocumentId,
}: {
  selectedDocumentId: string | null;
}) {
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState<"detailed" | "concise">("detailed");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Upload your PDF and Select your Pdf, and then ask me anything.",
      sender: "bot",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutate: ask } = useAsk();

  const handleModeChange = (newMode: "detailed" | "concise") => {
    setMode(newMode);
  };

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    if (!selectedDocumentId) {
      setSnackbarMessage("Please select a document first.");
      setSnackbarOpen(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Add "Thinking..." message
    const thinkingId = "thinking-" + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: thinkingId, text: "Thinking...", sender: "bot" },
    ]);

    ask(
      {
        question: inputValue,
        mode: mode,
        document_id: selectedDocumentId || "",
      },
      {
        onSuccess: (data) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === thinkingId
                ? {
                    id: Date.now().toString(),
                    text: data.answer,
                    sender: "bot",
                  }
                : msg
            )
          );
        },
        onError: (error) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === thinkingId
                ? {
                    id: Date.now().toString(),
                    text: `Error: ${error.message}`,
                    sender: "bot",
                  }
                : msg
            )
          );
        },
      }
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <GenericCard
      sx={{
        pt: 3,
        pl: 0,
        pr: 0,
        pb: 2,
        width: 850,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <GenericLabel
        sx={{ display: "flex", justifyContent: "center" }}
        variant="h5"
        color="primary"
      >
        Chat with your Document
      </GenericLabel>
      <Divider sx={{ mt: 3, width: "100%" }} />
      <GenericPaper
        sx={{
          p: 2,
          width: "100%",
          height: 510,
          backgroundColor: "background.paper",
          borderRadius: 1.5,
          display: "flex",
          flexDirection: "column",
          boxShadow: 0,
        }}
      >
        <Box
          sx={{
            mt: 2,
            flexGrow: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 1,
            pb: 1,
            // Custom scrollbar styles
            "&::-webkit-scrollbar": {
              ml: 1,
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
            },
            // Firefox support
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  msg.sender === "user" ? "primary.main" : "divider",
                color: msg.sender === "user" ? "white" : "text.primary",
                borderRadius: 2,
                p: 1.5,
                maxWidth: "80%",
                wordBreak: "break-word",
              }}
            >
              {msg.sender === "bot" ? (
                <FormattedTextRenderer
                  text={msg.text}
                  expandThinkByDefault={false}
                />
              ) : (
                msg.text
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
      </GenericPaper>

      <Divider sx={{ mb: 2, width: "100%" }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          ml: 2,
          mr: 2,
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <GenericLabel variant="body1">Response Mode:</GenericLabel>
          <Box sx={{ display: "flex", gap: 1 }}>
            <GenericButton
              variant={mode === "detailed" ? "contained" : "outlined"}
              onClick={() => handleModeChange("detailed")}
            >
              Detailed
            </GenericButton>
            <GenericButton
              variant={mode === "concise" ? "contained" : "outlined"}
              onClick={() => handleModeChange("concise")}
            >
              Concise
            </GenericButton>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1, ml: 2, mr: 2 }}>
        <GenericTextField
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          fullWidth
        />
        <GenericButton onClick={handleSend}>Send</GenericButton>
      </Box>
      <GenericSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity="warning"
        onClose={() => setSnackbarOpen(false)}
      />
    </GenericCard>
  );
}
