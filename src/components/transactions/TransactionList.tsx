"use client"

import { useState, useMemo } from "react"
import { Pencil } from "lucide-react"
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types"
import { TransactionDialog } from "./TransactionDialog"
import { DeleteButton } from "./DeleteButton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-")
  return `${day}/${month}/${year}`
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterMonth, setFilterMonth] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchType = filterType === "all" || t.type === filterType
      const matchCategory = filterCategory === "all" || t.category === filterCategory
      const matchMonth = !filterMonth || t.date.startsWith(filterMonth)
      return matchType && matchCategory && matchMonth
    })
  }, [transactions, filterType, filterCategory, filterMonth])

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <Input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="w-40"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {ALL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(filterType !== "all" || filterCategory !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setFilterType("all"); setFilterCategory("all") }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Tabela */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Nenhuma transação encontrada.
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {formatDate(t.date)}
                  </TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold whitespace-nowrap ${
                    t.type === "income" ? "text-green-600" : "text-red-500"
                  }`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <TransactionDialog
                        transaction={t}
                        trigger={
                          <Button variant="ghost" size="icon" className="text-muted-foreground" title="Editar">
                            <Pencil size={15} />
                          </Button>
                        }
                      />
                      <DeleteButton id={t.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-right">
        {filtered.length} transaç{filtered.length === 1 ? "ão" : "ões"} encontrada{filtered.length === 1 ? "" : "s"}
      </p>
    </div>
  )
}
