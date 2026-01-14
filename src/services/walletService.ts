import { api } from "@/lib/axios"
import {
    Wallet,
    WalletPayload,
    WalletListResponse
} from "@/types/wallet"

export const walletService = {
    getAll: () =>
        api.get<WalletListResponse>("/wallets"),

    getById: (id: string) =>
        api.get<{ success: boolean; data: Wallet }>(`/wallets/${id}`),

    create: (data: WalletPayload) =>
        api.post<{ success: boolean; data: Wallet }>("/wallets", data),

    update: (id: string, data: Partial<WalletPayload>) =>
        api.put<{ success: boolean; data: Wallet }>(`/wallets/${id}`, data),

    delete: (id: string) =>
        api.delete<{ success: boolean; message: string }>(`/wallets/${id}`),
}
