"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { KpiCards } from "@/components/kpi-cards"
import { AgingReport } from "@/components/aging-report"
import { LatestRunSummary } from "@/components/latest-run-summary"
import { InvestigationWorkbench } from "@/components/investigation-workbench"
import { AnalyticsTrends } from "@/components/analytics-trends"
import { TestBuilder } from "@/components/test-builder"
import { reconciliationTests, type ReconciliationTest } from "@/lib/recon-data"
import {
  Activity,
  BarChart3,
  Settings2,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react"

export default function Page() {
  const [selectedTest, setSelectedTest] = useState<ReconciliationTest | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // If a test is selected, show the investigation workbench
  if (selectedTest) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="mx-auto max-w-[1400px] px-6 py-6">
          <InvestigationWorkbench
            test={selectedTest}
            onBack={() => setSelectedTest(null)}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
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
            <Button variant="outline" size="sm" className="gap-1.5 text-sm bg-transparent">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>

          <TabsContent value="overview" className="mt-0 flex flex-col gap-6">
            <KpiCards tests={reconciliationTests} />
            <AgingReport
              tests={reconciliationTests}
              onSelectTest={setSelectedTest}
            />
            <LatestRunSummary
              tests={reconciliationTests}
              onSelectTest={setSelectedTest}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <AnalyticsTrends />
          </TabsContent>

          <TabsContent value="configuration" className="mt-0">
            <TestBuilder />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function DashboardHeader() {
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
          <span className="hidden sm:inline">Last sync: Feb 5, 2026 08:00 AM</span>
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-emerald-600 font-medium">Live</span>
        </div>
      </div>
    </header>
  )
}
