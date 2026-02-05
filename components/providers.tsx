"use client"

import { AuthProvider } from "@/lib/auth/context"
import { AuthGate } from "@/lib/auth/auth-gate"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  )
}
