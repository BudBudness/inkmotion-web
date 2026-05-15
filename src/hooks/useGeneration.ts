"use client";

import { useState, useCallback } from "react";
import { generateTypography } from "@/lib/api";
import type { GenerationConfig, GenerationOutput, ApiError } from "@/types";

interface UseGenerationReturn {
  output: GenerationOutput | null;
  loading: boolean;
  error: string | null;
  generate: (config: GenerationConfig) => Promise<void>;
  reset: () => void;
}

export function useGeneration(): UseGenerationReturn {
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (config: GenerationConfig) => {
    if (!config.text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await generateTypography({
        text: config.text,
        preset: config.preset,
        config: {
          dripLevel: config.dripLevel,
          shadowDepth: config.shadowDepth,
          highlightStrength: config.highlightStrength,
          animationMode: config.animationMode,
        },
      });
      setOutput(response.data);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.detail ?? "Generation failed. Check the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setOutput(null);
    setError(null);
  }, []);

  return { output, loading, error, generate, reset };
}
