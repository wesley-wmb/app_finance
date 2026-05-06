import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Transaction } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-")
  return `${day}/${month}/${year}`
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Últimas transações</CardTitle>
        <Link
          href="/transactions"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Ver todas <ArrowRight size={12} />
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma transação ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    t.type === "income" ? "bg-green-500" : "bg-red-400"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
                      <Badge variant="secondary" className="text-xs py-0">{t.category}</Badge>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-semibold whitespace-nowrap ${
                  t.type === "income" ? "text-green-600" : "text-red-500"
                }`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
