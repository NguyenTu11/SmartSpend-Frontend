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
                    <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        "w-full px-4 py-3 rounded-xl border bg-gray-50 transition-all duration-200 appearance-none cursor-pointer",
                        "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:bg-white",
                        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-no-repeat pr-10",
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                {error && (
                    <p className="mt-1.5 text-sm text-red-600">{error}</p>
                )}
            </div>
        )
    }
)

Select.displayName = "Select"
