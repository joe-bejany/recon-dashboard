import { api } from "./client";
import type { AnalyticsSummaryResponse } from "./types";

export async function getAnalyticsSummary(): Promise<AnalyticsSummaryResponse> {
  return api.get<AnalyticsSummaryResponse>("/analytics/summary");
}
