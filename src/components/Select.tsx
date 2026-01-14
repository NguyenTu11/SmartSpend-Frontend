import { forwardRef, SelectHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    children?: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, children, className = "", id, ...props }, ref) => {
        const selectId = id || props.name

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        "w-full px-3 py-2 rounded-xl border transition-colors text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-offset-0",
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-200",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        )
    }
)

Select.displayName = "Select"
