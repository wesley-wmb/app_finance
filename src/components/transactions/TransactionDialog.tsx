"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Transaction } from "@/types"
import { TransactionForm } from "./TransactionForm"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Props {
  transaction?: Transaction
  trigger?: React.ReactNode
}

export function TransactionDialog({ transaction, trigger }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus size={16} className="mr-1" />
            Nova transação
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
