import type { ReconciliationTest, TestStatus, RootCause, AuditEvent, TransactionRecord } from "../recon-data";
import type {
  ReconWithLatestExecutionResponse,
  ExecutionDetailResponse,
  AuditEventResponse,
} from "./types";

/**
 * Maps backend recon + latest execution → frontend ReconciliationTest format.
 */
export function toReconciliationTest(
  recon: ReconWithLatestExecutionResponse
): ReconciliationTest {
  const exec = recon.latestExecution;

  let status: TestStatus = "success";
  if (exec) {
    if (exec.status === "SUCCEEDED") {
      status = "success";
    } else if (exec.status === "FAILED") {
      switch (exec.investigationStatus) {
        case "INVESTIGATING":
          status = "failed-investigating";
          break;
        case "RESOLVED":
        case "DISMISSED":
          status = "failed-resolved";
          break;
        default:
          status = "failed-unresolved";
      }
    }
  }

  // Calculate days failing
  let daysFailing = 0;
  if (exec && exec.status === "FAILED" && exec.investigationStatus !== "RESOLVED" && exec.investigationStatus !== "DISMISSED") {
    const executedAt = new Date(exec.executedAt);
    daysFailing = Math.max(0, Math.floor((Date.now() - executedAt.getTime()) / (1000 * 60 * 60 * 24)));
  }

  // Map category — default to the string from the backend or "Uncategorized"
  const category = (recon.category || "Uncategorized") as ReconciliationTest["category"];

  return {
    id: recon.id,
    name: recon.name,
    category,
    status,
    lastRun: exec?.executedAt || recon.updatedAt,
    daysFailing,
    delta: exec?.delta ?? 0,
    owner: recon.owner || recon.stakeholderEmail,
    severity: Math.abs(exec?.delta ?? 0) > 1000 ? "high" : "low",
    rootCause: (exec?.rootCause as RootCause) || undefined,
    resolutionNotes: exec?.note || undefined,
    executionId: exec?.id || undefined,
  };
}

/**
 * Maps backend audit events → frontend AuditEvent format.
 */
export function toAuditEvent(
  event: AuditEventResponse
): AuditEvent {
  let action = event.action;
  if (event.action === "STATUS_CHANGE") {
    action = `Status changed from ${event.previousValue || "none"} to ${event.newValue}`;
  } else if (event.action === "ROOT_CAUSE_SET") {
    action = `Root cause set to ${event.newValue}`;
  } else if (event.action === "NOTE_ADDED") {
    action = "Note added";
  } else if (event.action === "EXECUTION_COMPLETED") {
    action = `Execution completed: ${event.newValue}`;
  }

  return {
    id: event.id,
    testId: event.reconId,
    timestamp: event.createdAt,
    user: event.userEmail || "System",
    action,
    details: event.details || undefined,
  };
}

/**
 * Attempts to normalize execution result match/mismatch JSONB data into TransactionRecord[].
 * The shape varies by comparison strategy (LineMatch, Rolling, SQL).
 */
export function toTransactionRecords(
  items: Record<string, unknown>[] | null,
  matched: boolean
): TransactionRecord[] {
  if (!items || items.length === 0) return [];

  return items.map((item, index) => ({
    id: String(item.id || item.reference || `row-${index}`),
    date: String(item.date || item.recon_date || item.transaction_date || ""),
    description: String(item.description || item.name || item.concept || ""),
    amount: Number(item.amount || item.total || item.value || 0),
    reference: String(item.reference || item.tracking_id || item.external_id || item.id || ""),
    matched,
  }));
}
