import { API_BASE_URL } from "@/lib/constants";
import type {
  GenerateRequest,
  GenerateResponse,
  ExportFormat,
  ExportResponse,
  ApiError,
} from "@/types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // non-JSON error body
    }
    const err: ApiError = { detail, status: res.status };
    throw err;
  }
  return res.json() as Promise<T>;
}

export async function checkHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(res);
}

export async function generateTypography(
  payload: GenerateRequest
): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<GenerateResponse>(res);
}

export async function exportOutput(
  output: import("@/types").GenerationOutput,
  format: ExportFormat
): Promise<ExportResponse> {
  const res = await fetch(`${API_BASE_URL}/export/${format}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ output }),
  });
  return handleResponse<ExportResponse>(res);
}
