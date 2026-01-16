"use client"

import { useState, useEffect } from "react"
import { Input } from "./Input"
import { formatNumberWithDots, parseFormattedNumber } from "@/lib/utils"

interface CurrencyInputProps {
    label?: string
    value: number
    onChange: (value: number) => void
    placeholder?: string
    required?: boolean
}

export function CurrencyInput({ label, value, onChange, placeholder = "0", required = false }: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState("")

    useEffect(() => {
        if (value === 0) {
            setDisplayValue("")
        } else {
            setDisplayValue(formatNumberWithDots(value))
        }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, "")

        if (input === "") {
            setDisplayValue("")
            onChange(0)
            return
        }

        const formatted = formatNumberWithDots(input)
        setDisplayValue(formatted)
        onChange(parseFormattedNumber(formatted))
    }

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <Input
                type="text"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    )
}
