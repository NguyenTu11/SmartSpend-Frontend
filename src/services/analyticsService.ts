import { api } from "@/lib/axios"
import {
    AnalyticsByTimeParams,
    AnalyticsByTimeResponse,
    WeeklyAnalyticsResponse,
    YearlyAnalyticsResponse
} from "@/types/analytics"

export const analyticsService = {
    getByTime: (params: AnalyticsByTimeParams) =>
        api.get<AnalyticsByTimeResponse>("/analytics/by-time", { params }),

    getWeekly: () =>
        api.get<WeeklyAnalyticsResponse>("/analytics/weekly"),

    getYearly: (params?: { year?: number }) =>
        api.get<YearlyAnalyticsResponse>("/analytics/yearly", { params }),
}
