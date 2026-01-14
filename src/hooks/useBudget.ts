import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { budgetService } from "@/services/budgetService"
import { BudgetPayload } from "@/types/budget"

export const useBudgets = () => {
    return useQuery({
        queryKey: ["budgets"],
        queryFn: () => budgetService.getAll(),
        select: (res) => res.data,
    })
}

export const useBudgetStatus = () => {
    return useQuery({
        queryKey: ["budgetStatus"],
        queryFn: () => budgetService.getStatus(),
        select: (res) => res.data,
    })
}

export const useCreateBudget = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: BudgetPayload) => budgetService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
        },
    })
}

export const useUpdateBudget = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<BudgetPayload> }) =>
            budgetService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
        },
    })
}

export const useDeleteBudget = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => budgetService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
        },
    })
}
