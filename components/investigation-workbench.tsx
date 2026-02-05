"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Download, Clock, User, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import type { ReconciliationTest, AuditEvent } from "@/lib/recon-data"
import {
  auditEvents,
  sourceATransactions,
  sourceBTransactions,
  formatCurrency,
  getRootCauseLabel,
  getStatusLabel,
} from "@/lib/recon-data"

interface InvestigationWorkbenchProps {
  test: ReconciliationTest
  onBack: () => void
}

function AuditTimeline({ events }: { events: AuditEvent[] }) {
  return (
    <div className="flex flex-col gap-0">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
              event.action.includes("Failed")
                ? "bg-red-500"
                : event.action.includes("Succeeded") || event.action.includes("Resolved")
                  ? "bg-emerald-500"
                  : "bg-sky-500"
            }`} />
            {index < events.length - 1 && (
              <div className="w-px flex-1 bg-border min-h-[24px]" />
            )}
          </div>
          <div className="pb-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                {new Date(event.timestamp).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-xs font-medium text-card-foreground">{event.user}</span>
            </div>
            <p className="text-sm text-card-foreground mt-0.5">{event.action}</p>
            {event.details && (
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {event.details}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function InvestigationWorkbench({ test, onBack }: InvestigationWorkbenchProps) {
  const [status, setStatus] = useState(test.status)
  const [rootCause, setRootCause] = useState(test.rootCause || "unknown")
  const [notes, setNotes] = useState("")

  const testEvents = auditEvents.filter((e) => e.testId === test.id)
  const sourceA = sourceATransactions
  const sourceB = sourceBTransactions

  const sourceATotal = sourceA.reduce((acc, t) => acc + t.amount, 0)
  const sourceBTotal = sourceB.reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">{test.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline">{test.category}</Badge>
            <span className="text-sm text-muted-foreground">
              Run: {new Date(test.lastRun).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {test.delta !== 0 && (
              <span className="text-sm font-mono font-semibold text-red-600">
                Delta: {formatCurrency(test.delta)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Panel: The Evidence */}
        <div className="flex flex-col gap-6">
          {/* Transaction Matcher */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-card-foreground">
                  Transaction Matcher
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs bg-transparent">
                  <Download className="h-3.5 w-3.5" />
                  Download Mismatched CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {/* Source A */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-card-foreground">
                      Source A: Vendor File
                    </h4>
                    <span className="text-xs font-mono text-muted-foreground">
                      Total: {formatCurrency(sourceATotal)}
                    </span>
                  </div>
                  <div className="rounded-lg border border-border/60 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-xs">Description</TableHead>
                          <TableHead className="text-xs text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sourceA.map((txn) => (
                          <TableRow
                            key={txn.id}
                            className={!txn.matched ? "bg-red-50" : ""}
                          >
                            <TableCell className="text-xs py-2">{txn.date}</TableCell>
                            <TableCell className={`text-xs py-2 ${!txn.matched ? "text-red-700 font-medium" : "text-card-foreground"}`}>
                              {txn.description}
                              {!txn.matched && (
                                <AlertCircle className="inline ml-1 h-3 w-3 text-red-500" />
                              )}
                            </TableCell>
                            <TableCell className={`text-xs py-2 text-right font-mono ${!txn.matched ? "text-red-700 font-medium" : ""}`}>
                              {formatCurrency(txn.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Source B */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-card-foreground">
                      Source B: Bank Statement
                    </h4>
                    <span className="text-xs font-mono text-muted-foreground">
                      Total: {formatCurrency(sourceBTotal)}
                    </span>
                  </div>
                  <div className="rounded-lg border border-border/60 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-xs">Description</TableHead>
                          <TableHead className="text-xs text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sourceB.map((txn) => (
                          <TableRow key={txn.id}>
                            <TableCell className="text-xs py-2">{txn.date}</TableCell>
                            <TableCell className="text-xs py-2 text-card-foreground">{txn.description}</TableCell>
                            <TableCell className="text-xs py-2 text-right font-mono">
                              {formatCurrency(txn.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 rounded-lg bg-muted/50 p-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Source A: <strong className="text-card-foreground">{sourceA.length}</strong> txns
                  </span>
                  <span className="text-muted-foreground">
                    Source B: <strong className="text-card-foreground">{sourceB.length}</strong> txns
                  </span>
                  <span className="text-red-600 font-medium">
                    {sourceA.filter((t) => !t.matched).length} unmatched
                  </span>
                </div>
                <span className="text-sm font-mono font-semibold text-red-600">
                  Delta: {formatCurrency(sourceATotal - sourceBTotal)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: The Audit Workflow */}
        <div className="flex flex-col gap-4">
          {/* Status & Controls */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Audit Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Current Status
                </label>
                <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="failed-unresolved">Open</SelectItem>
                    <SelectItem value="failed-investigating">Investigating</SelectItem>
                    <SelectItem value="failed-resolved">Resolved</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Owner
                </label>
                <div className="flex items-center gap-2 text-sm text-card-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {test.owner}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Root Cause
                </label>
                <Select value={rootCause} onValueChange={(v) => setRootCause(v as typeof rootCause)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timing-difference">Timing Difference</SelectItem>
                    <SelectItem value="data-entry-error">Data Entry Error</SelectItem>
                    <SelectItem value="engineer-bug">Engineer Bug</SelectItem>
                    <SelectItem value="third-party-outage">Third-Party Outage</SelectItem>
                    <SelectItem value="missing-file">Missing File</SelectItem>
                    <SelectItem value="weekend-gap">Weekend Gap</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Resolution Notes
                </label>
                <Textarea
                  placeholder="Describe the root cause and resolution..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] text-sm"
                />
              </div>

              <Button className="w-full bg-[hsl(220,72%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(220,72%,45%)]">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Audit History */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base font-semibold text-card-foreground">
                  Audit History
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {testEvents.length > 0 ? (
                <AuditTimeline events={testEvents} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No audit events recorded for this test.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
