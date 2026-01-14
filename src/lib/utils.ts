export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND"
}

export const formatShortCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(1).replace(/\.0$/, "") + " tỷ"
    }
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1).replace(/\.0$/, "") + " tr"
    }
    if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + " k"
    }
    return amount.toString() + " VND"
}

export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}

export const formatDateTime = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}

export const formatRelativeTime = (date: string | Date): string => {
    const now = new Date()
    const target = new Date(date)
    const diffMs = now.getTime() - target.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Vừa xong"
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return formatDate(date)
}

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
    return classes.filter(Boolean).join(" ")
}
