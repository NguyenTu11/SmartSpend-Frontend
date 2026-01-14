export type BudgetTransferStatus = "pending" | "approved" | "rejected"

export interface BudgetTransfer {
    _id: string
    userId: string
    fromBudgetId: string
    toBudgetId: string
    fromCategoryName: string
    toCategoryName: string
    amount: number
    status: BudgetTransferStatus
    requestedAt: string
    respondedAt?: string
    createdAt: string
}

export interface BudgetTransferPayload {
    fromBudgetId: string
    toBudgetId: string
    amount: number
}

export interface BudgetTransferRespondPayload {
    action: "approve" | "reject"
}

export interface BudgetTransferListResponse {
    data: BudgetTransfer[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
