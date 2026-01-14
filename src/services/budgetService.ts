import { api } from "@/lib/axios"
import { Budget, BudgetPayload, BudgetStatus } from "@/types/budget"

export const budgetService = {
    getAll: () =>
        api.get<Budget[]>("/budgets"),

    getById: (id: string) =>
        api.get<Budget>(`/budgets/${id}`),

    create: (data: BudgetPayload) =>
        api.post<Budget>("/budgets", data),

    update: (id: string, data: Partial<BudgetPayload>) =>
        api.put<Budget>(`/budgets/${id}`, data),

    delete: (id: string) =>
        api.delete<{ message: string }>(`/budgets/${id}`),

    getStatus: () =>
        api.get<{ summary: { total: number; safe: number; warning: number; exceeded: number }; budgets: BudgetStatus[] }>("/budgets/status"),
}
