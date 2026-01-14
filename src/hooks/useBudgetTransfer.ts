import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { budgetTransferService } from "@/services/budgetTransferService"
import { BudgetTransferPayload, BudgetTransferRespondPayload } from "@/types/budgetTransfer"

export const useBudgetTransferHistory = (params?: { status?: string; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["budgetTransfers", "history", params],
        queryFn: () => budgetTransferService.getHistory(params),
        select: (res) => res.data,
    })
}

export const usePendingBudgetTransfers = () => {
    return useQuery({
        queryKey: ["budgetTransfers", "pending"],
        queryFn: () => budgetTransferService.getPending(),
        select: (res) => res.data,
    })
}

export const useCreateBudgetTransfer = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: BudgetTransferPayload) => budgetTransferService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgetTransfers"] })
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })
}

export const useRespondBudgetTransfer = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: BudgetTransferRespondPayload }) =>
            budgetTransferService.respond(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgetTransfers"] })
            queryClient.invalidateQueries({ queryKey: ["budgets"] })
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })
}
