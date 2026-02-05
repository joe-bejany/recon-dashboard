import { api } from "./client";
import type { ReconWithLatestExecutionResponse, ReconConfigResponse } from "./types";

export async function listRecons(): Promise<ReconWithLatestExecutionResponse[]> {
  return api.get<ReconWithLatestExecutionResponse[]>("/recons");
}

export async function getReconConfig(
  reconId: string
): Promise<ReconConfigResponse> {
  return api.get<ReconConfigResponse>(`/recons/${reconId}/config`);
}
