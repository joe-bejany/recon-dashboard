"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { KpiCards } from "@/components/kpi-cards"
import { AgingReport } from "@/components/aging-report"
import { LatestRunSummary } from "@/components/latest-run-summary"
import { InvestigationWorkbench } from "@/components/investigation-workbench"
import { AnalyticsTrends } from "@/components/analytics-trends"
import { TestBuilder } from "@/components/test-builder"
import { listRecons } from "@/lib/api/recons"
import { getAnalyticsSummary } from "@/lib/api/analytics"
import { toReconciliationTest } from "@/lib/api/transform"
import type { AnalyticsSummaryResponse } from "@/lib/api/types"
import type { ReconciliationTest } from "@/lib/recon-data"
import {
  Activity,
  BarChart3,
  Settings2,
  LayoutDashboard,
  RefreshCw,
  Loader2,
} from "lucide-react"

export default function Page() {
  const [selectedTest, setSelectedTest] = useState<ReconciliationTest | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [tests, setTests] = useState<ReconciliationTest[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [reconsData, analyticsData] = await Promise.all([
        listRecons(),
        getAnalyticsSummary(),
      ])
      setTests(reconsData.map(toReconciliationTest))
      setAnalytics(analyticsData)
      setLastSync(new Date())
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  if (selectedTest) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader lastSync={lastSync} />
        <main className="mx-auto max-w-[1400px] px-6 py-6">
          <InvestigationWorkbench
            test={selectedTest}
            onBack={() => {
              setSelectedTest(null)
              fetchData()
            }}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader lastSync={lastSync} />
      <main className="mx-auto max-w-[1400px] px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-card border border-border/60">
              <TabsTrigger value="overview" className="gap-1.5 text-sm">
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-1.5 text-sm">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="configuration" className="gap-1.5 text-sm">
                <Settings2 className="h-4 w-4" />
                Test Configuration
              </TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-sm bg-transparent"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Refresh
            </Button>
          </div>

          <TabsContent value="overview" className="mt-0 flex flex-col gap-6">
            {loading ? (
              <DashboardSkeleton />
            ) : (
              <>
                <KpiCards tests={tests} analytics={analytics} />
                <AgingReport
                  tests={tests}
                  onSelectTest={setSelectedTest}
                />
                <LatestRunSummary
                  tests={tests}
                  onSelectTest={setSelectedTest}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            {loading ? (
              <AnalyticsSkeleton />
            ) : (
              <AnalyticsTrends analytics={analytics} />
            )}
          </TabsContent>

          <TabsContent value="configuration" className="mt-0">
            <TestBuilder tests={tests} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function DashboardHeader({ lastSync }: { lastSync: Date | null }) {
  const syncText = lastSync
    ? lastSync.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " " +
      lastSync.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Connecting..."

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(220,72%,50%)]">
            <Activity className="h-4 w-4 text-[hsl(0,0%,100%)]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-none">
              Nelo Reconciliation
            </h1>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">
              Cash Flow Monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Last sync: {syncText}</span>
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-emerald-600 font-medium">Live</span>
        </div>
      </div>
    </header>
  )
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[100px] rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-[300px] rounded-lg" />
      <Skeleton className="h-[400px] rounded-lg" />
    </>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[350px] rounded-lg" />
      ))}
    </div>
  )
}
