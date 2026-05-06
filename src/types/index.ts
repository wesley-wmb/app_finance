export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  date: string
  category: string
  description: string
  created_at: string
}

export interface TransactionFormData {
  type: TransactionType
  amount: number
  date: string
  category: string
  description: string
}

export const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Vestuário",
  "Assinaturas",
  "Outros",
] as const

export const INCOME_CATEGORIES = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Presente",
  "Outros",
] as const
