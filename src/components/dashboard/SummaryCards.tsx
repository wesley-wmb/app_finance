import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  income: number
  expense: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function SummaryCards({ income, expense }: Props) {
  const balance = income - expense

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
          <TrendingUp size={18} className="text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(income)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          <TrendingDown size={18} className="text-red-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-500">{formatCurrency(expense)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          <Wallet size={18} className={balance >= 0 ? "text-blue-500" : "text-red-500"} />
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-red-500"}`}>
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
