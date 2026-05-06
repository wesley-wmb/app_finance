"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ArrowLeftRight, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { logout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: ArrowLeftRight },
]

export function AppShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-semibold text-base">FinançasPessoais</span>
          </div>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs text-muted-foreground">{email}</span>
            <form action={logout}>
              <Button variant="ghost" size="icon" type="submit" title="Sair">
                <LogOut size={16} />
              </Button>
            </form>
          </div>
        </div>

        {/* Nav mobile */}
        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-2 flex flex-col gap-1 bg-background">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  )
}
