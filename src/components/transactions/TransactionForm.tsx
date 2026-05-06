"use client"

import { useState } from "react"
import { createTransaction, updateTransaction } from "@/lib/actions/transactions"
import { Transaction, TransactionFormData, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  transaction?: Transaction
  onSuccess: () => void
}

export function TransactionForm({ transaction, onSuccess }: Props) {
  const [type, setType] = useState<"income" | "expense">(transaction?.type ?? "expense")
  const [category, setCategory] = useState(transaction?.category ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data: TransactionFormData = {
      type,
      amount: parseFloat((form.elements.namedItem("amount") as HTMLInputElement).value),
      date: (form.elements.namedItem("date") as HTMLInputElement).value,
      category,
      description: (form.elements.namedItem("description") as HTMLInputElement).value,
    }

    const result = transaction
      ? await updateTransaction(transaction.id, data)
      : await createTransaction(data)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => { setType("expense"); setCategory("") }}
          className={`py-2 rounded-md text-sm font-medium border transition-colors ${
            type === "expense"
              ? "bg-red-50 border-red-300 text-red-700"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          Despesa
        </button>
        <button
          type="button"
          onClick={() => { setType("income"); setCategory("") }}
          className={`py-2 rounded-md text-sm font-medium border transition-colors ${
            type === "income"
              ? "bg-green-50 border-green-300 text-green-700"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          Receita
        </button>
      </div>

      {/* Valor */}
      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0,00"
          defaultValue={transaction?.amount}
          required
        />
      </div>

      {/* Data */}
      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={transaction?.date ?? new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          name="description"
          type="text"
          placeholder="Ex: Mercado, Salário..."
          defaultValue={transaction?.description}
          required
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading || !category}>
        {loading ? "Salvando..." : transaction ? "Salvar alterações" : "Adicionar"}
      </Button>
    </form>
  )
}
