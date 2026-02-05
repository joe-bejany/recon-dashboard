import { api } from "./client";
import type { ReconWithLatestExecutionResponse } from "./types";

export async function listRecons(): Promise<ReconWithLatestExecutionResponse[]> {
  return api.get<ReconWithLatestExecutionResponse[]>("/recons");
}
