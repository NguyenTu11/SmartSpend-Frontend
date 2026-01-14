export interface BudgetCategory {
    _id: string
    name: string
}

export interface Budget {
    _id: string
    userId: string
    categoryId: string | BudgetCategory
    limit: number
    alertThreshold: number
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
}

export interface BudgetPayload {
    categoryId: string
    limit: number
    alertThreshold?: number
    startDate: string
    endDate: string
}

export interface BudgetStatus {
    budgetId: string
    categoryId: string
    categoryName: string
    limit: number
    spent: number
    remaining: number
    percentage: number
    status: "SAFE" | "WARNING" | "EXCEEDED"
    alertThreshold: number
    startDate: string
    endDate: string
}

export interface BudgetStatusResponse {
    summary: {
        total: number
        safe: number
        warning: number
        exceeded: number
    }
    budgets: BudgetStatus[]
}
