/**
 * Component for rendering formatted chat responses with think tags styled separately
 */
"use client";
import React, { useState, useEffect } from "react";
import { Box, Collapse } from "@mui/material";
import { parseForStyling } from "../../../lib/textFormatter";

interface FormattedTextRendererProps {
  text: string;
  expandThinkByDefault?: boolean;
}

// Helper function to render text with bold markdown (**text**) converted to <strong>
function renderTextWithBold(text: string) {
  const parts: (string | React.ReactNode)[] = [];
  const boldRegex = /\*\*([^\*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the bold part
    parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export default function FormattedTextRenderer({
  text,
  expandThinkByDefault = false,
}: FormattedTextRendererProps) {
  const [expandThink, setExpandThink] = useState(expandThinkByDefault);
  const [isClient, setIsClient] = useState(false);
  const parsed = parseForStyling(text);

  // Prevent hydration mismatch by ensuring this only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render client-specific UI on server
  if (!isClient) {
    return null;
  }

  return (
    <Box>
      {parsed.hasThink && parsed.thinkText && (
        <Box sx={{ mb: 2 }}>
          <Box
            onClick={() => setExpandThink(!expandThink)}
            sx={{
              cursor: "pointer",
              padding: "8px 12px",
              backgroundColor: "rgba(128, 128, 128, 0.1)",
              borderRadius: "4px",
              fontSize: "0.85em",
              color: "rgba(0, 0, 0, 0.5)",
              fontWeight: 500,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(128, 128, 128, 0.15)",
              },
            }}
          >
            {expandThink ? "▼" : "▶"} Reasoning Process (Click to expand)
          </Box>
          <Collapse in={expandThink}>
            <Box
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: "rgba(128, 128, 128, 0.08)",
                borderRadius: "4px",
                borderLeft: "3px solid rgba(128, 128, 128, 0.3)",
                fontSize: "0.9em",
                lineHeight: 1.6,
                opacity: 0.6,
                color: "text.secondary",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {renderTextWithBold(parsed.thinkText)}
            </Box>
          </Collapse>
        </Box>
      )}
      <Box
        sx={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          lineHeight: 1.8,
          "& strong": {
            fontWeight: 700,
          },
          "& em": {
            fontStyle: "italic",
          },
          "& ul, & ol": {
            ml: 2,
            mb: 1,
          },
          "& li": {
            mb: 0.5,
          },
          "& code": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            padding: "2px 6px",
            borderRadius: "3px",
            fontFamily: "monospace",
            fontSize: "0.95em",
          },
        }}
      >
        {renderTextWithBold(parsed.mainText)}
      </Box>
    </Box>
  );
}
