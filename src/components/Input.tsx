import { forwardRef, InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", id, ...props }, ref) => {
        const inputId = id || props.name

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full px-4 py-3 rounded-xl border transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-offset-0",
                        "placeholder:text-gray-400",
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-600">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        )
    }
)

Input.displayName = "Input"
