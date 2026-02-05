"use client"

import { useAuth } from "./context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, LogIn } from "lucide-react"

/**
 * Wraps the app and requires authentication before showing content.
 * In production, this would redirect to the Nelo SSO login page.
 * For now, it accepts a JWT token directly (for development).
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, login } = useAuth()
  const [tokenInput, setTokenInput] = useState("")

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(220,72%,50%)]">
            <Activity className="h-4 w-4 text-[hsl(0,0%,100%)]" />
          </div>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  // Skip auth gate entirely if NEXT_PUBLIC_AUTH_DISABLED is set (for local dev)
  if (process.env.NEXT_PUBLIC_AUTH_DISABLED === "true") {
    return <>{children}</>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/60">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(220,72%,50%)]">
                <Activity className="h-6 w-6 text-[hsl(0,0%,100%)]" />
              </div>
            </div>
            <CardTitle className="text-xl">Nelo Reconciliation</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your access token to continue
            </p>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                if (tokenInput.trim()) login(tokenInput.trim())
              }}
            >
              <Input
                type="password"
                placeholder="Paste JWT token..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="font-mono text-sm"
              />
              <Button
                type="submit"
                disabled={!tokenInput.trim()}
                className="w-full gap-2 bg-[hsl(220,72%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(220,72%,45%)]"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
