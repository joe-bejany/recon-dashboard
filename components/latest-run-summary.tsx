"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import type { ReconciliationTest } from "@/lib/recon-data"
import {
  getStatusLabel,
  formatCurrency,
  getTimeSinceRun,
} from "@/lib/recon-data"

interface LatestRunSummaryProps {
  tests: ReconciliationTest[]
  onSelectTest: (test: ReconciliationTest) => void
}

function StatusBadge({ status }: { status: ReconciliationTest["status"] }) {
  const styles = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900/50",
    "failed-unresolved": "bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/50",
    "failed-investigating": "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50",
    "failed-resolved": "bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-800 dark:hover:bg-sky-900/50",
  }

  return (
    <Badge className={styles[status]}>
      {getStatusLabel(status)}
    </Badge>
  )
}

export function LatestRunSummary({ tests, onSelectTest }: LatestRunSummaryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const categories = [...new Set(tests.map((t) => t.category))]

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || test.status === statusFilter
    const matchesCategory = categoryFilter === "all" || test.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold text-card-foreground">
            Latest Run Summary
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-[200px] pl-8 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[160px] text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed-unresolved">Unresolved</SelectItem>
                <SelectItem value="failed-investigating">Investigating</SelectItem>
                <SelectItem value="failed-resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-[160px] text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Since Last Run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Delta</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.map((test) => (
              <TableRow
                key={test.id}
                className="cursor-pointer"
                onClick={() => onSelectTest(test)}
              >
                <TableCell className="font-medium text-card-foreground">{test.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {test.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-sm ${
                      getTimeSinceRun(test.lastRun).includes("hour") ||
                      getTimeSinceRun(test.lastRun).includes("<")
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {getTimeSinceRun(test.lastRun)}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={test.status} />
                </TableCell>
                <TableCell className="text-right font-mono">
                  {test.delta !== 0 ? (
                    <span className="text-red-600 dark:text-red-400">
                      {formatCurrency(test.delta)}
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400">$0.00</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {test.owner}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredTests.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tests match your current filters.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
