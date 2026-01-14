import { useQuery } from "@tanstack/react-query"
import { analyticsService } from "@/services/analyticsService"

export const useAnalyticsByTime = (params: { from: string; to: string; groupBy?: "day" | "week" | "month" }) => {
    return useQuery({
        queryKey: ["analytics", "by-time", params],
        queryFn: () => analyticsService.getByTime(params),
        select: (res) => res.data,
        enabled: !!params.from && !!params.to,
    })
}

export const useWeeklyAnalytics = () => {
    return useQuery({
        queryKey: ["analytics", "weekly"],
        queryFn: () => analyticsService.getWeekly(),
        select: (res) => res.data,
    })
}

export const useYearlyAnalytics = (year?: number) => {
    return useQuery({
        queryKey: ["analytics", "yearly", year],
        queryFn: () => analyticsService.getYearly({ year }),
        select: (res) => res.data,
    })
}
