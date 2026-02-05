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
