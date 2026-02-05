// Backend API response types — mirrors the DTOs from recon-platform

export interface ReconWithLatestExecutionResponse {
  id: string;
  name: string;
  stakeholderEmail: string;
  configUrl: string;
  active: boolean;
  owner: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  latestExecution: {
    id: string;
    executedAt: string;
    status: "RUNNING" | "SUCCEEDED" | "FAILED";
    delta: number | null;
    investigationStatus: "OPEN" | "INVESTIGATING" | "RESOLVED" | "DISMISSED" | null;
    rootCause: string | null;
    assignedTo: string | null;
    resolvedAt: string | null;
    investigatingSince: string | null;
    note: string | null;
  } | null;
}

export interface ExecutionDetailResponse {
  id: string;
  reconId: string;
  executedAt: string;
  reconDates: string[];
  status: "RUNNING" | "SUCCEEDED" | "FAILED";
  delta: number | null;
  note: string | null;
  mismatchTolerance: number | null;
  investigationStatus: "OPEN" | "INVESTIGATING" | "RESOLVED" | "DISMISSED" | null;
  rootCause: string | null;
  assignedTo: string | null;
  resolvedAt: string | null;
  investigatingSince: string | null;
  result: {
    id: string;
    currency: string | null;
    leftFiles: string[] | null;
    rightFiles: string[] | null;
    leftAmount: number | null;
    rightAmount: number | null;
    matches: Record<string, unknown>[] | null;
    mismatches: Record<string, unknown>[] | null;
    sqlQuery: string | null;
    sqlResult: string | null;
    unexpectedFailureReason: string | null;
  } | null;
  auditEvents: AuditEventResponse[];
}

export interface AuditEventResponse {
  id: string;
  executionId: string;
  reconId: string;
  userEmail: string | null;
  action: string;
  previousValue: string | null;
  newValue: string | null;
  details: string | null;
  createdAt: string;
}

export interface AnalyticsSummaryResponse {
  coverageRate: number;
  openExceptions: number;
  avgTimeToResolveHours: number | null;
  cashAtRisk: number;
  trends: {
    reconRate: Array<{ date: string; rate: number }>;
    discrepancyVolume: Array<{ date: string; amount: number }>;
    speedToFix: Array<{ date: string; hours: number }>;
    rootCauseDistribution: Array<{ cause: string; count: number; percentage: number }>;
  };
}

export interface ReconConfigResponse {
  id: string;
  name: string;
  owner: string | null;
  category: string | null;
  stakeholderEmail: string;
  active: boolean;
  configUrl: string;
  schedule: { cron: string } | null;
  strategy: string | null;
  mismatchTolerance: number | null;
  sources: {
    left: Array<{
      file: string;
      database?: string;
      amount_column?: string;
      currency?: string;
      match_columns?: string[];
    }> | null;
    right: Array<{
      file: string;
      database?: string;
      amount_column?: string;
      currency?: string;
      match_columns?: string[];
    }> | null;
    sql: {
      file: string;
      database?: string;
    } | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvestigateRequest {
  investigationStatus?: string;
  rootCause?: string;
  assignedTo?: string;
  notes?: string;
}

export interface AddNoteRequest {
  text: string;
}
