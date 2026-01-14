import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { walletService } from "@/services/walletService"
import { WalletPayload } from "@/types/wallet"

export const useWallets = () => {
    return useQuery({
        queryKey: ["wallets"],
        queryFn: () => walletService.getAll(),
        select: (res) => res.data.data,
    })
}

export const useCreateWallet = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: WalletPayload) => walletService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallets"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
        },
    })
}

export const useUpdateWallet = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<WalletPayload> }) =>
            walletService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallets"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
        },
    })
}

export const useDeleteWallet = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => walletService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallets"] })
            queryClient.invalidateQueries({ queryKey: ["dashboardInsights"] })
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        },
    })
}
