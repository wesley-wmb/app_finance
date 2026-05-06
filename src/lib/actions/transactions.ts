"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { TransactionFormData } from "@/types"

export async function createTransaction(data: TransactionFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Não autorizado." }

  const { error } = await supabase.from("transactions").insert({
    ...data,
    user_id: user.id,
    amount: Number(data.amount),
  })

  if (error) return { error: "Erro ao salvar transação." }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
}

export async function updateTransaction(id: string, data: TransactionFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Não autorizado." }

  const { error } = await supabase
    .from("transactions")
    .update({ ...data, amount: Number(data.amount) })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: "Erro ao atualizar transação." }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Não autorizado." }

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: "Erro ao excluir transação." }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true }
}
