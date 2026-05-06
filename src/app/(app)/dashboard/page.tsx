import { createClient } from "@/lib/supabase/server"
import { Transaction } from "@/types"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { CategoryChart } from "@/components/dashboard/CategoryChart"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { TransactionDialog } from "@/components/transactions/TransactionDialog"

function getCurrentMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]
  return { start, end }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { start, end } = getCurrentMonthRange()

  const { data: monthData } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false })

  const { data: recentData } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false })
    .limit(5)

  const transactions: Transaction[] = monthData ?? []
  const recent: Transaction[] = recentData ?? []

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const categoryTotals = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})

  const chartData = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  const now = new Date()
  const monthName = now.toLocaleString("pt-BR", { month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize">Dashboard</h1>
          <p className="text-sm text-muted-foreground capitalize">{monthName}</p>
        </div>
        <TransactionDialog />
      </div>

      <SummaryCards income={income} expense={expense} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryChart data={chartData} />
        <RecentTransactions transactions={recent} />
      </div>
    </div>
  )
}
