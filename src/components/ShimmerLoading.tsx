interface ShimmerProps {
    className?: string
}

export function Shimmer({ className = "" }: ShimmerProps) {
    return (
        <div className={`shimmer ${className}`} />
    )
}

export function ShimmerText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Shimmer
                    key={i}
                    className={`h-4 rounded ${i === lines - 1 ? "w-2/3" : "w-full"}`}
                />
            ))}
        </div>
    )
}

export function ShimmerAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    }

    return <Shimmer className={`${sizeClasses[size]} rounded-full`} />
}

export function ShimmerCard({ className = "" }: ShimmerProps) {
    return (
        <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
            <div className="flex items-center gap-4 mb-4">
                <ShimmerAvatar />
                <div className="flex-1">
                    <Shimmer className="h-4 w-1/3 rounded mb-2" />
                    <Shimmer className="h-3 w-1/2 rounded" />
                </div>
            </div>
            <ShimmerText lines={2} />
        </div>
    )
}

export function ShimmerTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex gap-4">
                {Array.from({ length: cols }).map((_, i) => (
                    <Shimmer key={i} className="h-4 flex-1 rounded" />
                ))}
            </div>
            <div className="divide-y">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="px-4 py-4 flex gap-4 items-center">
                        {Array.from({ length: cols }).map((_, colIndex) => (
                            <Shimmer key={colIndex} className="h-4 flex-1 rounded" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export function ShimmerStats({ count = 4 }: { count?: number }) {
    const gridCols = count === 4 ? "md:grid-cols-2 lg:grid-cols-4" : count === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
    return (
        <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                    <Shimmer className="h-4 w-1/2 rounded mb-3" />
                    <Shimmer className="h-8 w-3/4 rounded mb-2" />
                    <Shimmer className="h-3 w-1/3 rounded" />
                </div>
            ))}
        </div>
    )
}

export function ShimmerList({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
                    <ShimmerAvatar size="sm" />
                    <div className="flex-1">
                        <Shimmer className="h-4 w-1/2 rounded mb-2" />
                        <Shimmer className="h-3 w-3/4 rounded" />
                    </div>
                    <Shimmer className="h-6 w-16 rounded" />
                </div>
            ))}
        </div>
    )
}
