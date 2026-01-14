interface CardProps {
    children: React.ReactNode
    className?: string
    title?: string
    subtitle?: string
    action?: React.ReactNode
}

export function Card({ children, className = "", title, subtitle, action }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
                    </div>
                    {action}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    )
}

interface StatsCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
}

export function StatsCard({ title, value, icon, trend, className = "" }: StatsCardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">{title}</span>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    {icon}
                </div>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {trend && (
                    <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                        {trend.isPositive ? "+" : ""}{trend.value}%
                    </span>
                )}
            </div>
        </div>
    )
}
