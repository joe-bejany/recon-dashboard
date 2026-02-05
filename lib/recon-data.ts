// Types
export type TestStatus = "success" | "failed-unresolved" | "failed-investigating" | "failed-resolved"
export type Severity = "low" | "high"
export type RootCause = "timing-difference" | "data-entry-error" | "engineer-bug" | "third-party-outage" | "missing-file" | "weekend-gap" | "unknown"

export interface ReconciliationTest {
  id: string
  name: string
  category: "STP" | "Bill Pay" | "Payment Processing" | "Stripe" | "Internal Bank Transfers" | "P&L" | "Marketplace"
  status: TestStatus
  lastRun: string
  daysFailing: number
  delta: number
  owner: string
  severity: Severity
  rootCause?: RootCause
  resolutionNotes?: string
}

export interface AuditEvent {
  id: string
  testId: string
  timestamp: string
  user: string
  action: string
  details?: string
}

export interface TransactionRecord {
  id: string
  date: string
  description: string
  amount: number
  reference: string
  matched: boolean
}

export interface TestDefinition {
  id: string
  name: string
  category: string
  sourceA: string
  sourceB: string
  frequency: string
  owner: string
  enabled: boolean
  tolerance: number
}

// Mock Data
export const reconciliationTests: ReconciliationTest[] = [
  {
    id: "stp-001",
    name: "STP Disbursements vs Bank Statement",
    category: "STP",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "stp-002",
    name: "STP Repayments vs Production Table",
    category: "STP",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "stp-003",
    name: "STP Transfers vs Analytics Table",
    category: "STP",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "stp-004",
    name: "STP Disbursements vs Production Table",
    category: "STP",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "stp-005",
    name: "STP Repayments vs Analytics Table",
    category: "STP",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "bp-001",
    name: "Pagaqui File vs Production Table",
    category: "Bill Pay",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Maria Lopez",
    severity: "low",
  },
  {
    id: "bp-002",
    name: "Arcus File vs Production Table",
    category: "Bill Pay",
    status: "failed-investigating",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 3,
    delta: -1250.50,
    owner: "Maria Lopez",
    severity: "low",
    rootCause: "timing-difference",
    resolutionNotes: "Arcus AirTime vendor latency causing 48hr delays in settlement file",
  },
  {
    id: "bp-003",
    name: "Arcus File vs Analytics Table",
    category: "Bill Pay",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Maria Lopez",
    severity: "low",
  },
  {
    id: "bp-004",
    name: "Pagaqui File vs Bank Statement",
    category: "Bill Pay",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Maria Lopez",
    severity: "low",
  },
  {
    id: "bp-005",
    name: "Arcus File vs Bank Statement",
    category: "Bill Pay",
    status: "failed-unresolved",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 12,
    delta: -42500.00,
    owner: "Maria Lopez",
    severity: "high",
    rootCause: "missing-file",
  },
  {
    id: "bp-006",
    name: "Pagaqui File vs Analytics Table",
    category: "Bill Pay",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Maria Lopez",
    severity: "low",
  },
  {
    id: "bp-007",
    name: "Bill Pay STP vs Bank Statement",
    category: "Bill Pay",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Maria Lopez",
    severity: "low",
  },
  {
    id: "pp-001",
    name: "Paymentology Auth vs Production",
    category: "Payment Processing",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Carlos Garcia",
    severity: "low",
  },
  {
    id: "pp-002",
    name: "Paymentology Settlement vs Bank",
    category: "Payment Processing",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Carlos Garcia",
    severity: "low",
  },
  {
    id: "pp-003",
    name: "MC Network Fees vs Invoice",
    category: "Payment Processing",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Carlos Garcia",
    severity: "low",
  },
  {
    id: "pp-004",
    name: "Paymentology Auth vs Analytics",
    category: "Payment Processing",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Carlos Garcia",
    severity: "low",
  },
  {
    id: "pp-005",
    name: "MC Settlement vs Production",
    category: "Payment Processing",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Carlos Garcia",
    severity: "low",
  },
  {
    id: "pp-006",
    name: "MC Settlement vs Analytics",
    category: "Payment Processing",
    status: "failed-resolved",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Carlos Garcia",
    severity: "low",
    rootCause: "weekend-gap",
    resolutionNotes: "Weekend gap in MC settlement file. Resolved after Monday file ingestion.",
  },
  {
    id: "pp-007",
    name: "MC USD Settlement vs Bank",
    category: "Payment Processing",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Carlos Garcia",
    severity: "low",
  },
  {
    id: "pp-008",
    name: "Paymentology Fees vs Invoice",
    category: "Payment Processing",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Carlos Garcia",
    severity: "low",
  },
  {
    id: "pp-009",
    name: "MC MXN Settlement vs Bank",
    category: "Payment Processing",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Carlos Garcia",
    severity: "low",
  },
  {
    id: "str-001",
    name: "Stripe Settlement vs Production",
    category: "Stripe",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "str-002",
    name: "Stripe Settlement vs Analytics",
    category: "Stripe",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "str-003",
    name: "Stripe Settlement vs Bank Statement",
    category: "Stripe",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "ibt-001",
    name: "BBVA Account vs STP Account",
    category: "Internal Bank Transfers",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "ibt-002",
    name: "BBVA Account vs SVB Account",
    category: "Internal Bank Transfers",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Joe Bejany",
    severity: "low",
  },
  {
    id: "pnl-001",
    name: "Revenue Table Check",
    category: "P&L",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Hiram",
    severity: "low",
  },
  {
    id: "pnl-002",
    name: "Loan Loss Table Check",
    category: "P&L",
    status: "success",
    lastRun: "2026-02-05T08:00:00Z",
    daysFailing: 0,
    delta: 0,
    owner: "Hiram",
    severity: "low",
  },
]

export const auditEvents: AuditEvent[] = [
  {
    id: "ae-001",
    testId: "bp-005",
    timestamp: "2026-01-24T09:00:00Z",
    user: "System",
    action: "Reconciliation Run Failed",
    details: "Delta: -$42,500.00. Arcus bank statement file not received for January settlement period.",
  },
  {
    id: "ae-002",
    testId: "bp-005",
    timestamp: "2026-01-24T10:15:00Z",
    user: "Maria Lopez",
    action: "Changed status to Investigating",
  },
  {
    id: "ae-003",
    testId: "bp-005",
    timestamp: "2026-01-24T10:30:00Z",
    user: "Maria Lopez",
    action: "Added note",
    details: "Arcus bank statement file not received. Contacted vendor for ETA.",
  },
  {
    id: "ae-004",
    testId: "bp-005",
    timestamp: "2026-01-26T14:00:00Z",
    user: "Maria Lopez",
    action: "Added note",
    details: "Vendor confirmed file delay due to internal system migration. Expected by Feb 7.",
  },
  {
    id: "ae-005",
    testId: "bp-002",
    timestamp: "2026-02-02T09:00:00Z",
    user: "System",
    action: "Reconciliation Run Failed",
    details: "Delta: -$1,250.50. 3 AirTime transactions pending in Arcus settlement.",
  },
  {
    id: "ae-006",
    testId: "bp-002",
    timestamp: "2026-02-02T10:15:00Z",
    user: "Maria Lopez",
    action: "Changed status to Investigating",
  },
  {
    id: "ae-007",
    testId: "bp-002",
    timestamp: "2026-02-02T10:30:00Z",
    user: "Maria Lopez",
    action: "Added note",
    details: "Known Arcus AirTime latency issue. Transactions typically settle within 48 hours.",
  },
  {
    id: "ae-008",
    testId: "pp-006",
    timestamp: "2026-02-03T09:00:00Z",
    user: "System",
    action: "Reconciliation Run Failed",
    details: "Delta: -$3,200.00. Weekend gap in MC settlement file.",
  },
  {
    id: "ae-009",
    testId: "pp-006",
    timestamp: "2026-02-03T10:00:00Z",
    user: "Carlos Garcia",
    action: "Changed status to Investigating",
  },
  {
    id: "ae-010",
    testId: "pp-006",
    timestamp: "2026-02-04T08:00:00Z",
    user: "System",
    action: "Reconciliation Run Succeeded",
  },
  {
    id: "ae-011",
    testId: "pp-006",
    timestamp: "2026-02-04T09:00:00Z",
    user: "Carlos Garcia",
    action: "Changed status to Resolved",
    details: "Weekend gap in MC settlement file. Resolved after Monday file ingestion.",
  },
]

export const sourceATransactions: TransactionRecord[] = [
  { id: "sa-001", date: "2026-01-20", description: "Arcus AirTime - Telcel", amount: 500.00, reference: "ARC-88201", matched: true },
  { id: "sa-002", date: "2026-01-20", description: "Arcus AirTime - Movistar", amount: 350.00, reference: "ARC-88202", matched: true },
  { id: "sa-003", date: "2026-01-21", description: "Arcus Utility - CFE", amount: 1200.00, reference: "ARC-88210", matched: true },
  { id: "sa-004", date: "2026-01-21", description: "Arcus AirTime - AT&T", amount: 450.50, reference: "ARC-88215", matched: false },
  { id: "sa-005", date: "2026-01-22", description: "Arcus Utility - Telmex", amount: 800.00, reference: "ARC-88220", matched: true },
  { id: "sa-006", date: "2026-01-22", description: "Arcus AirTime - Telcel", amount: 300.00, reference: "ARC-88225", matched: false },
  { id: "sa-007", date: "2026-01-23", description: "Arcus Utility - SADM", amount: 650.00, reference: "ARC-88230", matched: true },
  { id: "sa-008", date: "2026-01-23", description: "Arcus AirTime - Unefon", amount: 500.00, reference: "ARC-88235", matched: false },
  { id: "sa-009", date: "2026-01-24", description: "Arcus Utility - CFE", amount: 950.00, reference: "ARC-88240", matched: true },
  { id: "sa-010", date: "2026-01-24", description: "Arcus Utility - Izzi", amount: 750.00, reference: "ARC-88245", matched: true },
]

export const sourceBTransactions: TransactionRecord[] = [
  { id: "sb-001", date: "2026-01-20", description: "Arcus AirTime - Telcel", amount: 500.00, reference: "ARC-88201", matched: true },
  { id: "sb-002", date: "2026-01-20", description: "Arcus AirTime - Movistar", amount: 350.00, reference: "ARC-88202", matched: true },
  { id: "sb-003", date: "2026-01-21", description: "Arcus Utility - CFE", amount: 1200.00, reference: "ARC-88210", matched: true },
  { id: "sb-004", date: "2026-01-22", description: "Arcus Utility - Telmex", amount: 800.00, reference: "ARC-88220", matched: true },
  { id: "sb-005", date: "2026-01-23", description: "Arcus Utility - SADM", amount: 650.00, reference: "ARC-88230", matched: true },
  { id: "sb-006", date: "2026-01-24", description: "Arcus Utility - CFE", amount: 950.00, reference: "ARC-88240", matched: true },
  { id: "sb-007", date: "2026-01-24", description: "Arcus Utility - Izzi", amount: 750.00, reference: "ARC-88245", matched: true },
]

export const testDefinitions: TestDefinition[] = [
  { id: "td-001", name: "STP Disbursements vs Bank Statement", category: "STP", sourceA: "stp_disbursements", sourceB: "stp_bank_statement", frequency: "daily", owner: "Joe Bejany", enabled: true, tolerance: 0.01 },
  { id: "td-002", name: "STP Repayments vs Production Table", category: "STP", sourceA: "stp_repayments", sourceB: "production_repayments", frequency: "daily", owner: "Joe Bejany", enabled: true, tolerance: 0.01 },
  { id: "td-003", name: "Pagaqui File vs Production Table", category: "Bill Pay", sourceA: "pagaqui_settlement", sourceB: "production_billpay", frequency: "daily", owner: "Maria Lopez", enabled: true, tolerance: 0.01 },
  { id: "td-004", name: "Arcus File vs Production Table", category: "Bill Pay", sourceA: "arcus_settlement", sourceB: "production_billpay", frequency: "daily", owner: "Maria Lopez", enabled: true, tolerance: 0.50 },
  { id: "td-005", name: "Stripe Settlement vs Production", category: "Stripe", sourceA: "stripe_settlement", sourceB: "production_stripe", frequency: "daily", owner: "Joe Bejany", enabled: true, tolerance: 0.01 },
  { id: "td-006", name: "BBVA Account vs STP Account", category: "Internal Bank Transfers", sourceA: "bbva_ledger", sourceB: "stp_ledger", frequency: "daily", owner: "Joe Bejany", enabled: true, tolerance: 0.01 },
  { id: "td-007", name: "Revenue Table Check", category: "P&L", sourceA: "revenue_calculated", sourceB: "revenue_reported", frequency: "daily", owner: "Hiram", enabled: true, tolerance: 0.01 },
  { id: "td-008", name: "Loan Loss Table Check", category: "P&L", sourceA: "loan_loss_calculated", sourceB: "loan_loss_reported", frequency: "daily", owner: "Hiram", enabled: true, tolerance: 0.01 },
]

// Chart data
export const reconRateData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date("2025-11-07")
  date.setDate(date.getDate() + i)
  const base = 96 + Math.random() * 4
  return {
    date: date.toISOString().split("T")[0],
    rate: Math.min(100, Math.round(base * 10) / 10),
  }
})

export const discrepancyData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date("2026-01-06")
  date.setDate(date.getDate() + i)
  return {
    date: date.toISOString().split("T")[0],
    amount: Math.round(Math.random() * 15000),
  }
})

export const speedToFixData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date("2026-01-06")
  date.setDate(date.getDate() + i)
  return {
    date: date.toISOString().split("T")[0],
    hours: Math.round((0.5 + Math.random() * 4) * 10) / 10,
  }
})

export const rootCauseData = [
  { cause: "Timing Difference", count: 12, percentage: 40 },
  { cause: "Missing File", count: 6, percentage: 20 },
  { cause: "Weekend Gap", count: 5, percentage: 17 },
  { cause: "Third-Party Outage", count: 4, percentage: 13 },
  { cause: "Data Entry Error", count: 2, percentage: 7 },
  { cause: "Engineer Bug", count: 1, percentage: 3 },
]

// Helper functions
export function getStatusLabel(status: TestStatus): string {
  switch (status) {
    case "success": return "Success"
    case "failed-unresolved": return "Failed - Unresolved"
    case "failed-investigating": return "Failed - Investigating"
    case "failed-resolved": return "Failed - Resolved"
  }
}

export function getRootCauseLabel(cause: RootCause): string {
  switch (cause) {
    case "timing-difference": return "Timing Difference"
    case "data-entry-error": return "Data Entry Error"
    case "engineer-bug": return "Engineer Bug"
    case "third-party-outage": return "Third-Party Outage"
    case "missing-file": return "Missing File"
    case "weekend-gap": return "Weekend Gap"
    case "unknown": return "Unknown"
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function getTimeSinceRun(lastRun: string): string {
  const now = new Date("2026-02-05T12:00:00Z")
  const run = new Date(lastRun)
  const diffHours = Math.floor((now.getTime() - run.getTime()) / (1000 * 60 * 60))
  if (diffHours < 1) return "<1 hour"
  if (diffHours < 24) return `${diffHours} hours`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? "s" : ""}`
}
