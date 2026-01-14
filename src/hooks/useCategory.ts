import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { categoryService } from "@/services/categoryService"
import { CategoryPayload } from "@/types/category"

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getAll(),
        select: (res) => res.data,
    })
}

export const useCreateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CategoryPayload) => categoryService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            queryClient.invalidateQueries({ queryKey: ["budgets"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
        },
    })
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CategoryPayload> }) =>
            categoryService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            queryClient.invalidateQueries({ queryKey: ["budgets"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
        },
    })
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => categoryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            queryClient.invalidateQueries({ queryKey: ["budgets"] })
            queryClient.invalidateQueries({ queryKey: ["budgetStatus"] })
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
        },
    })
}
