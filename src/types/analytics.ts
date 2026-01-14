export type AnalyticsPeriod = "day" | "week" | "month" | "year"
export type GroupBy = "day" | "week" | "month"

export interface CategoryBreakdown {
    name: string
    amount: number
    percentage: number
}

export interface TimelineItem {
    date?: string
    week?: string
    month?: string
    income: number
    expense: number
}

export interface AnalyticsByTimeParams {
    from: string
    to: string
    groupBy?: GroupBy
}

export interface AnalyticsByTimeResponse {
    period: { from: string; to: string }
    summary: {
        totalIncome: number
        totalExpense: number
        netSavings: number
        transactionCount: number
    }
    timeline: TimelineItem[]
    categoryBreakdown: CategoryBreakdown[]
}

export interface WeeklyDailyBreakdown {
    day: string
    income: number
    expense: number
}

export interface WeeklyAnalyticsResponse {
    period: { from: string; to: string }
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
    dailyBreakdown: WeeklyDailyBreakdown[]
    categoryBreakdown: { name: string; amount: number }[]
}

export interface MonthlyBreakdown {
    month: number
    income: number
    expense: number
}

export interface YearlyAnalyticsResponse {
    year: number
    summary: {
        totalIncome: number
        totalExpense: number
        netSavings: number
        avgMonthlyIncome: number
        avgMonthlyExpense: number
        transactionCount: number
    }
    monthlyBreakdown: MonthlyBreakdown[]
    categoryBreakdown: CategoryBreakdown[]
}
