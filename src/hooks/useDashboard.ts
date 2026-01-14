import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "@/services/dashboardService"

export const useDashboardInsights = () => {
    return useQuery({
        queryKey: ["dashboardInsights"],
        queryFn: () => dashboardService.getInsights(),
        select: (res) => res.data,
        refetchInterval: 60000,
    })
}
