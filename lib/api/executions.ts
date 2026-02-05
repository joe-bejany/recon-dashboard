import { api } from "./client";
import type {
  ExecutionDetailResponse,
  AuditEventResponse,
  InvestigateRequest,
  AddNoteRequest,
} from "./types";

export async function getExecutionDetail(
  executionId: string
): Promise<ExecutionDetailResponse> {
  return api.get<ExecutionDetailResponse>(`/executions/${executionId}`);
}

export async function updateInvestigation(
  executionId: string,
  body: InvestigateRequest
): Promise<ExecutionDetailResponse> {
  return api.patch<ExecutionDetailResponse>(
    `/executions/${executionId}/investigate`,
    body
  );
}

export async function addNote(
  executionId: string,
  body: AddNoteRequest
): Promise<AuditEventResponse> {
  return api.post<AuditEventResponse>(
    `/executions/${executionId}/notes`,
    body
  );
}

export async function getAuditTrail(
  executionId: string
): Promise<AuditEventResponse[]> {
  return api.get<AuditEventResponse[]>(
    `/executions/${executionId}/audit-trail`
  );
}

export async function downloadMismatchesCsv(
  executionId: string,
  filename?: string
): Promise<void> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(
    `${API_BASE_URL}/executions/${executionId}/mismatches/csv`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Failed to download CSV (${response.status})`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `mismatches-${executionId}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
