"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Search, CheckCircle2 } from "lucide-react"
import type { ReconciliationTest } from "@/lib/recon-data"
import { formatCurrency, getRootCauseLabel } from "@/lib/recon-data"

interface AgingReportProps {
  tests: ReconciliationTest[]
  onSelectTest: (test: ReconciliationTest) => void
}

function TestRow({ test, onSelect }: { test: ReconciliationTest; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-4 rounded-lg border border-border/60 bg-card px-4 py-3 text-left transition-colors hover:bg-accent/50"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-card-foreground truncate">{test.name}</span>
          <Badge variant="outline" className="shrink-0 text-xs">
            {test.category}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>Owner: {test.owner}</span>
          {test.rootCause && (
            <span>Cause: {getRootCauseLabel(test.rootCause)}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        {test.daysFailing > 0 && (
          <span
            className={`text-sm font-semibold ${
              test.daysFailing > 7 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {test.daysFailing} day{test.daysFailing !== 1 ? "s" : ""}
          </span>
        )}
        <span className="text-sm font-mono font-medium text-red-600 dark:text-red-400">
          {formatCurrency(Math.abs(test.delta))}
        </span>
        {test.status === "failed-unresolved" && (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/50">
            Unresolved
          </Badge>
        )}
        {test.status === "failed-investigating" && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50">
            Investigating
          </Badge>
        )}
      </div>
    </button>
  )
}

export function AgingReport({ tests, onSelectTest }: AgingReportProps) {
  const critical = tests.filter(
    (t) =>
      (t.status === "failed-unresolved" || t.status === "failed-investigating") &&
      t.daysFailing > 1
  )

  const newFailures = tests.filter(
    (t) =>
      (t.status === "failed-unresolved" || t.status === "failed-investigating") &&
      t.daysFailing <= 1
  )

  const recentlyResolved = tests.filter((t) => t.status === "failed-resolved")

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-card-foreground">Aging Report</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {critical.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
                {"Critical / Unresolved (> 24 hours)"}
              </h3>
              <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/50">
                {critical.length}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              {critical.map((test) => (
                <TestRow key={test.id} test={test} onSelect={() => onSelectTest(test)} />
              ))}
            </div>
          </div>
        )}

        {newFailures.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {"New Failures (< 24 hours)"}
              </h3>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50">
                {newFailures.length}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              {newFailures.map((test) => (
                <TestRow key={test.id} test={test} onSelect={() => onSelectTest(test)} />
              ))}
            </div>
          </div>
        )}

        {recentlyResolved.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Recently Resolved
              </h3>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900/50">
                {recentlyResolved.length}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              {recentlyResolved.map((test) => (
                <button
                  type="button"
                  key={test.id}
                  onClick={() => onSelectTest(test)}
                  className="flex w-full items-center gap-4 rounded-lg border border-border/60 bg-card px-4 py-3 text-left transition-colors hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-card-foreground truncate">
                        {test.name}
                      </span>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {test.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {test.resolutionNotes}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900/50 shrink-0">
                    Resolved
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {critical.length === 0 && newFailures.length === 0 && recentlyResolved.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            All reconciliation tests are passing. No exceptions to report.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
