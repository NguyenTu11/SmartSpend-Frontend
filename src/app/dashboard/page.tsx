"use client"

import Link from "next/link"
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Target,
    Calendar,
    Brain,
    AlertTriangle,
    Sparkles,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight
} from "lucide-react"
import { useDashboardInsights } from "@/hooks/useDashboard"
import { Card } from "@/components/Card"
import { ShimmerStats, ShimmerList } from "@/components/ShimmerLoading"
import { formatCurrency } from "@/lib/utils"

const COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#6366F1"]

export default function DashboardPage() {
    const { data, isLoading } = useDashboardInsights()

    if (isLoading) {
        return (
            <div className="space-y-6 fade-in">
                <ShimmerStats count={4} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 h-80 shimmer" />
                    <div className="bg-white rounded-xl p-6 h-80 shimmer" />
                </div>
                <div className="bg-white rounded-xl p-6 h-40 shimmer" />
                <ShimmerList count={5} />
            </div>
        )
    }

    if (!data) return null

    const { heroStats, charts, warnings, aiInsights, recentTransactions } = data

    return (
        <div className="space-y-6 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
                    <p className="text-gray-500 mt-1">Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <HeroCard
                    title="Tổng chi tháng này"
                    value={formatCurrency(heroStats.totalExpenseThisMonth)}
                    icon={<Wallet className="w-5 h-5" />}
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                    trend={heroStats.expenseChange}
                    trendLabel="so với tháng trước"
                />
                <HeroCard
                    title="Ngân sách còn lại"
                    value={formatCurrency(heroStats.budgetRemaining)}
                    icon={<Target className="w-5 h-5" />}
                    iconBg={heroStats.budgetPercentage > 80 ? "bg-red-100" : heroStats.budgetPercentage > 60 ? "bg-yellow-100" : "bg-green-100"}
                    iconColor={heroStats.budgetPercentage > 80 ? "text-red-600" : heroStats.budgetPercentage > 60 ? "text-yellow-600" : "text-green-600"}
                    progress={heroStats.budgetPercentage}
                />
                <HeroCard
                    title="Chi tiêu hôm nay"
                    value={formatCurrency(heroStats.todayExpense)}
                    icon={<Calendar className="w-5 h-5" />}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                    subtitle="Hãy chi tiêu có kế hoạch"
                />
                <HeroCard
                    title="Dự đoán cuối tháng"
                    value={formatCurrency(heroStats.predictedMonthEnd)}
                    icon={<Brain className="w-5 h-5" />}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    subtitle="Theo tốc độ hiện tại"
                    isAI
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Chi tiêu theo ngày" subtitle="Xu hướng chi tiêu trong tháng">
                    <div className="h-64">
                        <DailyExpenseChart data={charts.dailyExpenses} />
                    </div>
                </Card>

                <Card title="Phân bổ theo danh mục" subtitle="Tiền của bạn đi đâu">
                    <div className="h-64">
                        <CategoryPieChart data={charts.categoryBreakdown} />
                    </div>
                </Card>
            </div>

            {(warnings.length > 0 || aiInsights.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {warnings.length > 0 && (
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <h3 className="font-semibold text-red-800">Cảnh báo ngân sách</h3>
                            </div>
                            <ul className="space-y-3">
                                {warnings.map((w, i) => (
                                    <li key={i} className="flex items-center justify-between">
                                        <span className="text-gray-700">{w.category}</span>
                                        <span className={`font-medium ${w.status === "EXCEEDED" ? "text-red-600" : "text-yellow-600"}`}>
                                            {w.percentage}% {w.status === "EXCEEDED" ? "vượt" : "đã dùng"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {aiInsights.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-purple-800">Gợi ý từ AI</h3>
                            </div>
                            <ul className="space-y-3">
                                {aiInsights.map((insight, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                        <span className="text-gray-700">{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <Card
                title="Giao dịch gần đây"
                action={
                    <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        Xem tất cả <ChevronRight className="w-4 h-4" />
                    </Link>
                }
            >
                {recentTransactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Chưa có giao dịch nào</p>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentTransactions.map((tx) => (
                            <div key={tx._id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                                        {tx.type === "income" ? (
                                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <ArrowDownRight className="w-5 h-5 text-red-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{tx.category}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}

function HeroCard({
    title,
    value,
    icon,
    iconBg,
    iconColor,
    trend,
    trendLabel,
    progress,
    subtitle,
    isAI
}: {
    title: string
    value: string
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    trend?: number
    trendLabel?: string
    progress?: number
    subtitle?: string
    isAI?: boolean
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{title}</span>
                <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center ${iconColor}`}>
                    {icon}
                </div>
            </div>
            <div className="mb-2">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {isAI && <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">AI</span>}
            </div>
            {trend !== undefined && (
                <div className="flex items-center gap-1">
                    {trend >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${trend >= 0 ? "text-red-500" : "text-green-500"}`}>
                        {trend >= 0 ? "+" : ""}{trend}%
                    </span>
                    <span className="text-sm text-gray-400">{trendLabel}</span>
                </div>
            )}
            {progress !== undefined && (
                <div className="mt-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${progress > 80 ? "bg-red-500" : progress > 60 ? "bg-yellow-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{progress}% đã sử dụng</p>
                </div>
            )}
            {subtitle && !trend && !progress && (
                <p className="text-sm text-gray-400">{subtitle}</p>
            )}
        </div>
    )
}

function DailyExpenseChart({ data }: { data: { date: string; amount: number }[] }) {
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-400">Chưa có dữ liệu</div>
    }

    const maxAmount = Math.max(...data.map(d => d.amount), 1)
    const minAmount = Math.min(...data.map(d => d.amount))
    const width = 400
    const height = 200
    const padding = { top: 20, right: 20, bottom: 40, left: 20 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const points = data.map((d, i) => {
        const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth
        const y = padding.top + chartHeight - ((d.amount - minAmount) / (maxAmount - minAmount || 1)) * chartHeight
        return { x, y, ...d }
    })

    const createSmoothPath = (pts: typeof points) => {
        if (pts.length < 2) return ""
        let path = `M ${pts[0].x} ${pts[0].y}`
        for (let i = 0; i < pts.length - 1; i++) {
            const current = pts[i]
            const next = pts[i + 1]
            const cpx = (current.x + next.x) / 2
            path += ` Q ${current.x} ${current.y}, ${cpx} ${(current.y + next.y) / 2}`
        }
        const last = pts[pts.length - 1]
        path += ` T ${last.x} ${last.y}`
        return path
    }

    const linePath = createSmoothPath(points)
    const areaPath = linePath + ` L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
        y: padding.top + chartHeight * (1 - ratio),
        value: minAmount + (maxAmount - minAmount) * ratio
    }))

    return (
        <div className="relative h-full group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="chartLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="50%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient id="chartAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#A855F7" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {gridLines.map((line, i) => (
                    <g key={i}>
                        <line
                            x1={padding.left}
                            y1={line.y}
                            x2={width - padding.right}
                            y2={line.y}
                            stroke="#E5E7EB"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    </g>
                ))}
                <path d={areaPath} fill="url(#chartAreaGradient)" />
                <path
                    d={linePath}
                    fill="none"
                    stroke="url(#chartLineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className="transition-all duration-300"
                />
                {points.map((p, i) => (
                    <g key={i} className="cursor-pointer">
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="6"
                            fill="white"
                            stroke="url(#chartLineGradient)"
                            strokeWidth="3"
                            className="transition-all duration-200 hover:r-8"
                        />
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="3"
                            fill="#8B5CF6"
                        />
                    </g>
                ))}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-4">
                <span>Ngày 1</span>
                <span>Ngày {Math.ceil(data.length / 2)}</span>
                <span>Ngày {data.length}</span>
            </div>
        </div>
    )
}

function CategoryPieChart({ data }: { data: { name: string; amount: number; percentage: number }[] }) {
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-400">Chưa có dữ liệu</div>
    }

    const total = data.reduce((sum, d) => sum + d.amount, 0)
    let currentAngle = 0

    const segments = data.map((d, i) => {
        const angle = (d.amount / total) * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        currentAngle = endAngle

        if (data.length === 1) {
            return {
                path: "",
                isFullCircle: true,
                color: COLORS[i % COLORS.length],
                ...d
            }
        }

        const startRad = (startAngle - 90) * (Math.PI / 180)
        const endRad = (endAngle - 90) * (Math.PI / 180)
        const largeArc = angle > 180 ? 1 : 0

        const x1 = 50 + 40 * Math.cos(startRad)
        const y1 = 50 + 40 * Math.sin(startRad)
        const x2 = 50 + 40 * Math.cos(endRad)
        const y2 = 50 + 40 * Math.sin(endRad)

        return {
            path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
            isFullCircle: false,
            color: COLORS[i % COLORS.length],
            ...d
        }
    })

    return (
        <div className="flex items-center gap-4 h-full">
            <div className="flex-shrink-0 w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {segments.map((s, i) => (
                        s.isFullCircle ? (
                            <circle key={i} cx="50" cy="50" r="40" fill={s.color} className="hover:opacity-80 transition-opacity" />
                        ) : (
                            <path key={i} d={s.path} fill={s.color} className="hover:opacity-80 transition-opacity" />
                        )
                    ))}
                    <circle cx="50" cy="50" r="25" fill="white" />
                </svg>
            </div>
            <div className="flex-1 space-y-2 overflow-hidden">
                {data.slice(0, 5).map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-sm text-gray-600 truncate flex-1">{d.name}</span>
                        <span className="text-sm font-medium text-gray-900">{d.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
