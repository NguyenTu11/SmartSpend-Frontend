import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { transactionService } from "@/services/transactionService"
import { TransactionPayload } from "@/types/transaction"

export const useTransactions = (params?: { page?: number; limit?: number; type?: string }) => {
    return useQuery({
        queryKey: ["transactions", params],
        queryFn: () => transactionService.getAll(params),
        select: (res) => res.data,
    })
}

export const useTransactionSummary = (params?: { month?: number; year?: number }) => {
    return useQuery({
        queryKey: ["transactionSummary", params],
        queryFn: () => transactionService.getSummary(params),
        select: (res) => res.data,
    })
}

export const useCreateTransaction = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TransactionPayload) => transactionService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["transactionSummary"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
            queryClient.invalidateQueries({ queryKey: ["analytics"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
            queryClient.invalidateQueries({ queryKey: ["wallets"] })
        },
    })
}

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<TransactionPayload> }) =>
            transactionService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["transactionSummary"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
            queryClient.invalidateQueries({ queryKey: ["analytics"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
            queryClient.invalidateQueries({ queryKey: ["wallets"] })
        },
    })
}

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => transactionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["transactionSummary"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
            queryClient.invalidateQueries({ queryKey: ["analytics"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
            queryClient.invalidateQueries({ queryKey: ["wallets"] })
        },
    })
}

export const useExportTransactions = () => {
    return useMutation({
        mutationFn: (params: { format: "csv" | "json"; startDate?: string; endDate?: string }) =>
            transactionService.export(params),
    })
}
