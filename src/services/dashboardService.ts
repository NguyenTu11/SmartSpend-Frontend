import { api } from "@/lib/axios"

export interface DashboardHeroStats {
    totalExpenseThisMonth: number
    expenseChange: number
    budgetRemaining: number
    budgetPercentage: number
    todayExpense: number
    predictedMonthEnd: number
    totalBalance: number
}

export interface DailyExpense {
    date: string
    amount: number
}

export interface CategoryBreakdown {
    name: string
    amount: number
    percentage: number
}

export interface BudgetWarning {
    category: string
    percentage: number
    status: "WARNING" | "EXCEEDED"
    spent: number
    limit: number
}

export interface RecentTransaction {
    _id: string
    type: "income" | "expense"
    amount: number
    category: string
    createdAt: string
}

export interface DashboardInsights {
    heroStats: DashboardHeroStats
    charts: {
        dailyExpenses: DailyExpense[]
        categoryBreakdown: CategoryBreakdown[]
    }
    warnings: BudgetWarning[]
    aiInsights: string[]
    recentTransactions: RecentTransaction[]
}

export const dashboardService = {
    getInsights: () => api.get<DashboardInsights>("/dashboard/insights"),
}
