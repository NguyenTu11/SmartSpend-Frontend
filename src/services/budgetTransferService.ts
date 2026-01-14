import { api } from "@/lib/axios"
import {
    BudgetTransfer,
    BudgetTransferPayload,
    BudgetTransferRespondPayload,
    BudgetTransferListResponse
} from "@/types/budgetTransfer"

export const budgetTransferService = {
    getHistory: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get<BudgetTransferListResponse>("/budget-transfers", { params }),

    getPending: () =>
        api.get<BudgetTransfer[]>("/budget-transfers/pending"),

    create: (data: BudgetTransferPayload) =>
        api.post<BudgetTransfer>("/budget-transfers", data),

    respond: (id: string, data: BudgetTransferRespondPayload) =>
        api.put<{ message: string; transfer: BudgetTransfer }>(`/budget-transfers/${id}/respond`, data),
}
