import { api } from "@/lib/axios"
import { Category, CategoryPayload } from "@/types/category"

export const categoryService = {
    getAll: () =>
        api.get<Category[]>("/categories"),

    getById: (id: string) =>
        api.get<Category>(`/categories/${id}`),

    create: (data: CategoryPayload) =>
        api.post<Category>("/categories", data),

    update: (id: string, data: Partial<CategoryPayload>) =>
        api.put<Category>(`/categories/${id}`, data),

    delete: (id: string) =>
        api.delete<{ message: string }>(`/categories/${id}`),
}
