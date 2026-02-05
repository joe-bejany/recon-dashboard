"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import { Sparkles } from "lucide-react"
import type { AnalyticsSummaryResponse } from "@/lib/api/types"
import { getRootCauseLabel } from "@/lib/recon-data"

const reconRateConfig = {
  rate: {
    label: "Reconciliation Rate",
    color: "hsl(220, 72%, 50%)",
  },
}

const discrepancyConfig = {
  amount: {
    label: "Discrepancy ($)",
    color: "hsl(0, 72%, 51%)",
  },
}

const speedConfig = {
  hours: {
    label: "Hours to Fix",
    color: "hsl(160, 60%, 42%)",
  },
}

const rootCauseConfig = {
  count: {
    label: "Count",
    color: "hsl(220, 72%, 50%)",
  },
}

const rootCauseColors = [
  "hsl(220, 72%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(45, 90%, 52%)",
  "hsl(160, 60%, 42%)",
  "hsl(220, 14%, 70%)",
  "hsl(220, 14%, 82%)",
]

interface AnalyticsTrendsProps {
  analytics?: AnalyticsSummaryResponse | null
}

export function AnalyticsTrends({ analytics }: AnalyticsTrendsProps) {
  const reconRateData = analytics?.trends.reconRate ?? []
  const discrepancyData = analytics?.trends.discrepancyVolume ?? []
  const speedToFixData = analytics?.trends.speedToFix ?? []
  const rootCauseData = (analytics?.trends.rootCauseDistribution ?? []).map(d => ({
    ...d,
    cause: getRootCauseLabel(d.cause),
  }))

  const hasData = reconRateData.length > 0 || discrepancyData.length > 0

  return (
    <div className="flex flex-col gap-6">
      {!hasData && (
        <Card className="border-border/60">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No analytics data available yet. Data will appear once reconciliation executions have been recorded.
            </p>
          </CardContent>
        </Card>
      )}

      {hasData && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Reconciliation Rate */}
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Reconciliation Rate
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Last 90 days - % of tests passing daily
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={reconRateConfig} className="h-[280px] w-full">
                <LineChart data={reconRateData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => {
                      const d = new Date(v)
                      return `${d.getMonth() + 1}/${d.getDate()}`
                    }}
                    tick={{ fontSize: 11 }}
                    interval={14}
                  />
                  <YAxis domain={[90, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`${value}%`, "Rate"]}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--color-rate)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Discrepancy Volume */}
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Discrepancy Volume
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Last 30 days - Total $ unmatched per day
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={discrepancyConfig} className="h-[280px] w-full">
                <BarChart data={discrepancyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => {
                      const d = new Date(v)
                      return `${d.getMonth() + 1}/${d.getDate()}`
                    }}
                    tick={{ fontSize: 11 }}
                    interval={6}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [
                          `$${Number(value).toLocaleString()}`,
                          "Discrepancy",
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="amount" fill="var(--color-amount)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Speed to Fix */}
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Speed to Fix
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Last 30 days - Avg hours from failed to resolved
              </p>
            </CardHeader>
            <CardContent>
              {speedToFixData.length > 0 ? (
                <ChartContainer config={speedConfig} className="h-[280px] w-full">
                  <LineChart data={speedToFixData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => {
                        const d = new Date(v)
                        return `${d.getMonth() + 1}/${d.getDate()}`
                      }}
                      tick={{ fontSize: 11 }}
                      interval={6}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => [`${value} hours`, "Avg Speed"]}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="var(--color-hours)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                  No resolution data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Root Cause Distribution */}
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-card-foreground">
                Root Cause Distribution
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Last 30 days - Categorized failure reasons
              </p>
            </CardHeader>
            <CardContent>
              {rootCauseData.length > 0 ? (
                <ChartContainer config={rootCauseConfig} className="h-[280px] w-full">
                  <BarChart
                    data={rootCauseData}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="cause" type="category" tick={{ fontSize: 11 }} width={120} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name, item) => [
                            `${value} occurrences (${item.payload.percentage}%)`,
                            "Count",
                          ]}
                        />
                      }
                    />
                    <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                      {rootCauseData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={rootCauseColors[index % rootCauseColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                  No root cause data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Analyst */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-sky-50 p-1.5">
              <Sparkles className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-card-foreground">
                Automated Insights
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                AI analysis of reconciliation trends from the last 30 days
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100 shrink-0 mt-0.5">
                  Trend
                </Badge>
                <p className="text-sm text-sky-900 leading-relaxed">
                  Over the last 30 days, 40% of failures were tagged as &quot;Timing
                  Differences&quot; regarding the Arcus AirTime vendor. This suggests a
                  systemic latency issue rather than one-off data errors.{" "}
                  <strong>
                    Recommendation: Run Arcus tests 48 hours after billing to
                    account for delays.
                  </strong>
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 shrink-0 mt-0.5">
                  Pattern
                </Badge>
                <p className="text-sm text-amber-900 leading-relaxed">
                  Weekend gaps in MC settlement files account for 17% of all failures.
                  These are consistently resolved by Monday morning file ingestion and could
                  be suppressed with a scheduled delay rule to eliminate false positives.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shrink-0 mt-0.5">
                  Positive
                </Badge>
                <p className="text-sm text-emerald-900 leading-relaxed">
                  Average resolution time has decreased from 3.2 hours to 1.5 hours over
                  the past month. STP and Stripe reconciliation categories have maintained
                  100% success rate for 21 consecutive days.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
