import { createClient } from "@/lib/supabase/server"
import { Transaction } from "@/types"
import { TransactionList } from "@/components/transactions/TransactionList"
import { TransactionDialog } from "@/components/transactions/TransactionDialog"

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false })

  const transactions: Transaction[] = data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-sm text-muted-foreground">Gerencie suas receitas e despesas</p>
        </div>
        <TransactionDialog />
      </div>

      <TransactionList transactions={transactions} />
    </div>
  )
}
