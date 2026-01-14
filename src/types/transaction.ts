export type TransactionType = "income" | "expense"
export type RecurringFrequency = "daily" | "weekly" | "monthly"

export interface TransactionCategory {
    _id: string
    name: string
    icon?: string
    color?: string
    type: "income" | "expense"
}

export interface TransactionWallet {
    _id: string
    name: string
    balance: number
    currency: string
}

export interface Transaction {
    _id: string
    userId: string
    walletId: string | TransactionWallet
    categoryId: string | TransactionCategory
    type: TransactionType
    amount: number
    currency: string
    exchangeRate?: number
    location?: string
    tags?: string[]
    evidence?: string
    isRecurring?: boolean
    recurringFrequency?: RecurringFrequency
    lastRecurringDate?: string
    nextRecurringDate?: string
    createdAt: string
    updatedAt: string
}

export interface TransactionPayload {
    walletId: string
    categoryId: string
    type: TransactionType
    amount: number
    currency?: string
    location?: string
    tags?: string[]
    evidence?: string
    evidenceImage?: string
    isRecurring?: boolean
    recurringFrequency?: RecurringFrequency
}

export interface CategoryBreakdownItem {
    name: string
    amount: number
    count: number
    percentage: number
}

export interface WalletBreakdownItem {
    name: string
    income: number
    expense: number
    net: number
}

export interface TransactionSummary {
    period: {
        month: number
        year: number
    }
    summary: {
        totalIncome: number
        totalExpense: number
        netSavings: number
        transactionCount: number
    }
    comparison: {
        incomeChange: number
        expenseChange: number
        prevTotalIncome: number
        prevTotalExpense: number
    }
    categoryBreakdown: CategoryBreakdownItem[]
    walletBreakdown: WalletBreakdownItem[]
}

export interface TransactionListResponse {
    data: Transaction[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
