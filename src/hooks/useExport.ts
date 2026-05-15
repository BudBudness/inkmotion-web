"use client";

import { useState, useCallback } from "react";
import { exportOutput } from "@/lib/api";
import type { ExportFormat, GenerationOutput, ApiError } from "@/types";

interface UseExportReturn {
  exporting: ExportFormat | null;
  exportError: string | null;
  doExport: (output: GenerationOutput, format: ExportFormat) => Promise<void>;
}

export function useExport(): UseExportReturn {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const doExport = useCallback(
    async (output: GenerationOutput, format: ExportFormat) => {
      setExporting(format);
      setExportError(null);

      try {
        const response = await exportOutput(output, format);

        if (format === "svg") {
          // Download as file
          const blob = new Blob([response.data], { type: "image/svg+xml" });
          triggerDownload(blob, response.filename);
        } else if (format === "png") {
          const binary = atob(response.data);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "image/png" });
          triggerDownload(blob, response.filename);
        } else if (format === "json") {
          const blob = new Blob([response.data], { type: "application/json" });
          triggerDownload(blob, response.filename);
        }
      } catch (err) {
        const apiErr = err as ApiError;
        setExportError(apiErr.detail ?? "Export failed.");
      } finally {
        setExporting(null);
      }
    },
    []
  );

  return { exporting, exportError, doExport };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
