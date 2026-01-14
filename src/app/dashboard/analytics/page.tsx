"use client"

import { useState, useMemo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useWeeklyAnalytics, useYearlyAnalytics } from "@/hooks/useAnalytics"
import { useTransactionSummary } from "@/hooks/useTransaction"
import { ShimmerStats, ShimmerCard } from "@/components/ShimmerLoading"
import { Card, StatsCard } from "@/components/Card"
import { formatCurrency, cn } from "@/lib/utils"

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<"month" | "year">("month")
    const { data: summaryData, isLoading: summaryLoading } = useTransactionSummary()
    const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyAnalytics()
    const { data: yearlyData, isLoading: yearlyLoading } = useYearlyAnalytics()

    const currentData = period === "month" ? summaryData : yearlyData
    const isLoading = period === "month" ? summaryLoading : yearlyLoading

    const categoryBreakdown = useMemo(() => {
        if (period === "month") {
            return summaryData?.categoryBreakdown || []
        }
        return yearlyData?.categoryBreakdown || []
    }, [period, summaryData, yearlyData])

    const maxMonthlyValue = useMemo(() => {
        if (!yearlyData?.monthlyBreakdown) return 0
        return Math.max(...yearlyData.monthlyBreakdown.map((m: { income: number; expense: number }) => Math.max(m.income, m.expense)))
    }, [yearlyData])

    return (
        <div className="space-y-4 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
                    <p className="text-sm text-gray-500">Phân tích chi tiêu của bạn</p>
                </div>
                <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                        onClick={() => setPeriod("month")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            period === "month" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                        )}
                    >
                        Tháng
                    </button>
                    <button
                        onClick={() => setPeriod("year")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            period === "year" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                        )}
                    >
                        Năm
                    </button>
                </div>
            </div>

            {isLoading ? (
                <ShimmerStats count={4} />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatsCard
                        title="Thu nhập"
                        value={formatCurrency(currentData?.summary?.totalIncome || 0)}
                        icon={<TrendingUp className="w-5 h-5" />}
                        trend={(currentData as any)?.comparison?.incomeChange ? {
                            value: Math.abs((currentData as any).comparison.incomeChange),
                            isPositive: (currentData as any).comparison.incomeChange >= 0
                        } : undefined}
                    />
                    <StatsCard
                        title="Chi tiêu"
                        value={formatCurrency(currentData?.summary?.totalExpense || 0)}
                        icon={<TrendingDown className="w-5 h-5" />}
                        trend={(currentData as any)?.comparison?.expenseChange ? {
                            value: Math.abs((currentData as any).comparison.expenseChange),
                            isPositive: (currentData as any).comparison.expenseChange <= 0
                        } : undefined}
                    />
                    <StatsCard
                        title="Tiết kiệm"
                        value={formatCurrency(currentData?.summary?.netSavings || 0)}
                        icon={<TrendingUp className="w-5 h-5" />}
                    />
                    <StatsCard
                        title="Giao dịch"
                        value={String(currentData?.summary?.transactionCount || 0)}
                        icon={<TrendingUp className="w-5 h-5" />}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card title="Chi tiêu theo danh mục" subtitle="Top danh mục chi tiêu">
                    {isLoading ? (
                        <ShimmerCard />
                    ) : categoryBreakdown.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
                    ) : (
                        <div className="space-y-3">
                            {categoryBreakdown.slice(0, 5).map((cat: { name: string; amount: number; percentage?: number }, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">{cat.name}</span>
                                        <span className="font-medium">{formatCurrency(cat.amount)}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                            style={{ width: `${cat.percentage || 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {period === "year" && yearlyData?.monthlyBreakdown && (
                    <Card title="Thu chi theo tháng" subtitle="So sánh 12 tháng">
                        <div className="flex items-end gap-1 h-40">
                            {yearlyData.monthlyBreakdown.map((m: any, i: number) => (
                                <div key={i} className="flex-1 flex flex-col gap-1">
                                    <div
                                        className="bg-green-400 rounded-t"
                                        style={{ height: `${maxMonthlyValue > 0 ? (m.income / maxMonthlyValue) * 100 : 0}%` }}
                                    />
                                    <div
                                        className="bg-red-400 rounded-b"
                                        style={{ height: `${maxMonthlyValue > 0 ? (m.expense / maxMonthlyValue) * 100 : 0}%` }}
                                    />
                                    <span className="text-xs text-center text-gray-400">
                                        {typeof m.month === "string" ? m.month.split("-")[1] : m.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-4 mt-3 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-green-400 rounded" />
                                <span>Thu nhập</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-red-400 rounded" />
                                <span>Chi tiêu</span>
                            </div>
                        </div>
                    </Card>
                )}

                {period === "month" && weeklyData?.dailyBreakdown && (
                    <Card title="Chi tiêu tuần này" subtitle="So sánh 7 ngày">
                        <div className="flex items-end gap-2 h-40">
                            {weeklyData.dailyBreakdown.map((d: { day: string; income: number; expense: number }, i: number) => {
                                const maxVal = Math.max(
                                    ...weeklyData.dailyBreakdown.map((x: { expense: number }) => x.expense),
                                    1
                                )
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full bg-gradient-to-t from-red-400 to-red-300 rounded-t"
                                            style={{ height: `${(d.expense / maxVal) * 100}%`, minHeight: d.expense > 0 ? 4 : 0 }}
                                        />
                                        <span className="text-xs text-gray-500">{d.day}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                )}
            </div>

            {weeklyData && period === "month" && (
                <Card title="So sánh với tuần trước">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">Thu nhập</p>
                            <p className="text-xl font-bold text-green-600">
                                {formatCurrency(weeklyData.summary?.totalIncome || 0)}
                            </p>
                            <p className={cn(
                                "text-sm",
                                (weeklyData.comparison?.incomeChange || 0) >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                                {weeklyData.comparison?.incomeChange >= 0 ? "+" : ""}
                                {weeklyData.comparison?.incomeChange || 0}%
                            </p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">Chi tiêu</p>
                            <p className="text-xl font-bold text-red-600">
                                {formatCurrency(weeklyData.summary?.totalExpense || 0)}
                            </p>
                            <p className={cn(
                                "text-sm",
                                (weeklyData.comparison?.expenseChange || 0) <= 0 ? "text-green-600" : "text-red-600"
                            )}>
                                {weeklyData.comparison?.expenseChange >= 0 ? "+" : ""}
                                {weeklyData.comparison?.expenseChange || 0}%
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
