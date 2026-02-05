"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, AlertTriangle, Clock, DollarSign } from "lucide-react"
import type { ReconciliationTest } from "@/lib/recon-data"
import { formatCurrency } from "@/lib/recon-data"
import type { AnalyticsSummaryResponse } from "@/lib/api/types"

interface KpiCardsProps {
  tests: ReconciliationTest[]
  analytics?: AnalyticsSummaryResponse | null
}

export function KpiCards({ tests, analytics }: KpiCardsProps) {
  // Use server-computed analytics when available, otherwise compute client-side
  const totalTests = tests.length
  const passingTests = tests.filter(
    (t) => t.status === "success" || t.status === "failed-resolved"
  ).length

  const coverageRate = analytics?.coverageRate
    ?? (totalTests > 0 ? Math.round((passingTests / totalTests) * 1000) / 10 : 0)

  const openExceptions = analytics?.openExceptions
    ?? tests.filter(
      (t) => t.status === "failed-unresolved" || t.status === "failed-investigating"
    ).length

  const avgResolution = analytics?.avgTimeToResolveHours ?? 0

  const cashAtRisk = analytics?.cashAtRisk
    ?? tests
      .filter((t) => t.status === "failed-unresolved" || t.status === "failed-investigating")
      .reduce((acc, t) => acc + Math.abs(t.delta), 0)

  const kpis = [
    {
      title: "Coverage Rate",
      value: `${coverageRate}%`,
      subtitle: `${passingTests}/${totalTests} tests passing`,
      icon: ShieldCheck,
      color: coverageRate >= 95 ? "text-emerald-600" : "text-amber-600",
      bgColor: coverageRate >= 95 ? "bg-emerald-50" : "bg-amber-50",
    },
    {
      title: "Open Exceptions",
      value: openExceptions.toString(),
      subtitle: openExceptions === 0 ? "All clear" : "Needs attention",
      icon: AlertTriangle,
      color: openExceptions === 0 ? "text-emerald-600" : "text-red-600",
      bgColor: openExceptions === 0 ? "bg-emerald-50" : "bg-red-50",
    },
    {
      title: "Avg Time to Resolve",
      value: avgResolution ? `${avgResolution}h` : "N/A",
      subtitle: "Last 30 days",
      icon: Clock,
      color: "text-sky-600",
      bgColor: "bg-sky-50",
    },
    {
      title: "Cash at Risk",
      value: formatCurrency(cashAtRisk),
      subtitle: "Unreconciled amount",
      icon: DollarSign,
      color: cashAtRisk === 0 ? "text-emerald-600" : "text-red-600",
      bgColor: cashAtRisk === 0 ? "bg-emerald-50" : "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-border/60">
          <CardContent className="flex items-start gap-4 p-5">
            <div className={`rounded-lg p-2.5 ${kpi.bgColor}`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
              <p className={`text-2xl font-semibold tracking-tight ${kpi.color}`}>
                {kpi.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
