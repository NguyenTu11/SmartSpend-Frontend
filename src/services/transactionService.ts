import { api } from "@/lib/axios"
import {
    Transaction,
    TransactionPayload,
    TransactionListResponse,
    TransactionSummary
} from "@/types/transaction"

export const transactionService = {
    getAll: (params?: { page?: number; limit?: number; type?: string }) =>
        api.get<TransactionListResponse>("/transactions", { params }),

    getById: (id: string) =>
        api.get<Transaction>(`/transactions/${id}`),

    create: (data: TransactionPayload) =>
        api.post<Transaction>("/transactions", data),

    update: (id: string, data: Partial<TransactionPayload>) =>
        api.put<Transaction>(`/transactions/${id}`, data),

    delete: (id: string) =>
        api.delete<{ message: string }>(`/transactions/${id}`),

    getSummary: (params?: { month?: number; year?: number }) =>
        api.get<TransactionSummary>("/transactions/summary", { params }),

    export: (params: { format: "csv" | "json"; startDate?: string; endDate?: string }) =>
        api.get("/transactions/export", { params, responseType: "blob" }),
}
