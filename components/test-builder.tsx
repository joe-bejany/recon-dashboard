"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil } from "lucide-react"
import type { TestDefinition, ReconciliationTest } from "@/lib/recon-data"

function TestFormDialog({
  test,
  trigger,
}: {
  test?: TestDefinition
  trigger: React.ReactNode
}) {
  const isEdit = !!test

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEdit ? "Edit Test" : "Create New Test"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the reconciliation test configuration."
              : "Define a new reconciliation test to monitor cash flows."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="test-name" className="text-sm">
              Test Name
            </Label>
            <Input
              id="test-name"
              defaultValue={test?.name || ""}
              placeholder="e.g. Stripe Settlement vs Bank Statement"
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Category</Label>
              <Select defaultValue={test?.category || ""}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STP">STP</SelectItem>
                  <SelectItem value="Bill Pay">Bill Pay</SelectItem>
                  <SelectItem value="Payment Processing">Payment Processing</SelectItem>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="Internal Bank Transfers">Internal Bank Transfers</SelectItem>
                  <SelectItem value="P&L">{"P&L"}</SelectItem>
                  <SelectItem value="Marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Frequency</Label>
              <Select defaultValue={test?.frequency || "daily"}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="source-a" className="text-sm">
                Source A (Table/File)
              </Label>
              <Input
                id="source-a"
                defaultValue={test?.sourceA || ""}
                placeholder="e.g. stripe_settlement"
                className="text-sm font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="source-b" className="text-sm">
                Source B (Table/File)
              </Label>
              <Input
                id="source-b"
                defaultValue={test?.sourceB || ""}
                placeholder="e.g. production_stripe"
                className="text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Owner</Label>
              <Select defaultValue={test?.owner || ""}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Joe Bejany">Joe Bejany</SelectItem>
                  <SelectItem value="Maria Lopez">Maria Lopez</SelectItem>
                  <SelectItem value="Carlos Garcia">Carlos Garcia</SelectItem>
                  <SelectItem value="Hiram">Hiram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tolerance" className="text-sm">
                Tolerance ($)
              </Label>
              <Input
                id="tolerance"
                type="number"
                step="0.01"
                defaultValue={test?.tolerance || 0.01}
                className="text-sm font-mono"
              />
            </div>
          </div>

          <Button className="mt-2 bg-[hsl(220,72%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(220,72%,45%)]">
            {isEdit ? "Update Test" : "Create Test"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface TestBuilderProps {
  tests?: ReconciliationTest[]
}

function testsToDefinitions(tests: ReconciliationTest[]): TestDefinition[] {
  return tests.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    sourceA: "—",
    sourceB: "—",
    frequency: "daily",
    owner: t.owner,
    enabled: true,
    tolerance: 0.01,
  }))
}

export function TestBuilder({ tests }: TestBuilderProps) {
  const [definitions, setDefinitions] = useState<TestDefinition[]>(
    tests ? testsToDefinitions(tests) : []
  )

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-card-foreground">
                Test Configuration
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Manage reconciliation test definitions. Changes take effect on the next scheduled run.
              </p>
            </div>
            <TestFormDialog
              trigger={
                <Button size="sm" className="gap-1.5 bg-[hsl(220,72%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(220,72%,45%)]">
                  <Plus className="h-3.5 w-3.5" />
                  Create Test
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Source A</TableHead>
                <TableHead>Source B</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Tolerance</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead className="w-[50px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {definitions.map((def) => (
                <TableRow key={def.id}>
                  <TableCell className="font-medium text-card-foreground">{def.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {def.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {def.sourceA}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {def.sourceB}
                  </TableCell>
                  <TableCell className="text-sm capitalize">{def.frequency}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{def.owner}</TableCell>
                  <TableCell className="font-mono text-xs">
                    ${def.tolerance.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={def.enabled}
                      onCheckedChange={(checked) => {
                        setDefinitions((prev) =>
                          prev.map((d) =>
                            d.id === def.id ? { ...d, enabled: checked } : d
                          )
                        )
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TestFormDialog
                      test={def}
                      trigger={
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Coverage Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(() => {
          const categoryMap = new Map<string, { total: number; enabled: number }>()
          for (const def of definitions) {
            const entry = categoryMap.get(def.category) || { total: 0, enabled: 0 }
            entry.total++
            if (def.enabled) entry.enabled++
            categoryMap.set(def.category, entry)
          }
          return Array.from(categoryMap.entries()).map(([label, val]) => ({
            label,
            current: val.enabled,
            total: val.total,
          }))
        })().map((cat) => (
          <Card key={cat.label} className="border-border/60">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{cat.label}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-xl font-semibold ${
                  cat.current === cat.total ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {cat.current}
                </span>
                <span className="text-sm text-muted-foreground">/ {cat.total} tests</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    cat.current === cat.total ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${(cat.current / cat.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
