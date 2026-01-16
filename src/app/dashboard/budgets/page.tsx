"use client"

import { useState } from "react"
import { Plus, Target, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import { useBudgets, useBudgetStatus, useCreateBudget, useUpdateBudget, useDeleteBudget } from "@/hooks/useBudget"
import { useCategories } from "@/hooks/useCategory"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/Select"
import { Modal } from "@/components/Modal"
import { ShimmerList } from "@/components/ShimmerLoading"
import { showToast } from "@/components/Toast"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Budget, BudgetPayload } from "@/types/budget"
import { formatCurrency, cn } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/categoryIcons"
import { CurrencyInput } from "@/components/CurrencyInput"

export default function BudgetsPage() {
    const [showModal, setShowModal] = useState(false)
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const { data: budgets } = useBudgets()
    const { data: budgetStatusData, isLoading } = useBudgetStatus()
    const { data: categories } = useCategories()
    const createMutation = useCreateBudget()
    const updateMutation = useUpdateBudget()
    const deleteMutation = useDeleteBudget()

    const budgetStatuses = budgetStatusData?.budgets || []
    const summary = budgetStatusData?.summary

    const [formData, setFormData] = useState<BudgetPayload>({
        categoryId: "",
        limit: 0,
        alertThreshold: 0.8,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
    })

    const resetForm = () => {
        setFormData({
            categoryId: "",
            limit: 0,
            alertThreshold: 0.8,
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
        })
        setEditingBudget(null)
    }

    const openCreateModal = () => {
        resetForm()
        setShowModal(true)
    }

    const openEditModal = (budgetId: string) => {
        const budget = budgets?.find(b => b._id === budgetId)
        if (!budget) return
        setEditingBudget(budget)
        setFormData({
            categoryId: typeof budget.categoryId === "object" ? budget.categoryId._id : budget.categoryId,
            limit: budget.limit,
            alertThreshold: budget.alertThreshold,
            startDate: budget.startDate.split("T")[0],
            endDate: budget.endDate.split("T")[0],
        })
        setShowModal(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingBudget) {
            updateMutation.mutate(
                { id: editingBudget._id, data: formData },
                {
                    onSuccess: () => {
                        showToast("Cập nhật thành công", "success")
                        setShowModal(false)
                        resetForm()
                    },
                    onError: () => showToast("Cập nhật thất bại", "error"),
                }
            )
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    showToast("Tạo ngân sách thành công", "success")
                    setShowModal(false)
                    resetForm()
                },
                onError: () => showToast("Tạo thất bại", "error"),
            })
        }
    }

    const handleDelete = () => {
        if (!deleteId) return
        deleteMutation.mutate(deleteId, {
            onSuccess: () => {
                showToast("Đã xóa", "success")
                setDeleteId(null)
            },
            onError: () => showToast("Xóa thất bại", "error"),
        })
    }

    const expenseCategories = categories?.filter(c => c.type === "expense") || []

    return (
        <div className="space-y-4 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ngân sách</h1>
                    <p className="text-sm text-gray-500">Quản lý hạn mức chi tiêu</p>
                </div>
                <Button size="sm" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
                    Thêm mới
                </Button>
            </div>

            {summary && (
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-2xl font-bold">{summary.safe}</span>
                        </div>
                        <p className="text-xs text-green-700">An toàn</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-yellow-600 mb-1">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-2xl font-bold">{summary.warning}</span>
                        </div>
                        <p className="text-xs text-yellow-700">Cảnh báo</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-red-600 mb-1">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-2xl font-bold">{summary.exceeded}</span>
                        </div>
                        <p className="text-xs text-red-700">Vượt mức</p>
                    </div>
                </div>
            )}

            {isLoading ? (
                <ShimmerList count={4} />
            ) : budgetStatuses.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có ngân sách nào</p>
                    <Button size="sm" variant="outline" onClick={openCreateModal} className="mt-3">
                        Tạo ngân sách đầu tiên
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {budgetStatuses.map((budget) => (
                        <div
                            key={budget.budgetId}
                            className={cn(
                                "bg-white rounded-xl border p-4",
                                budget.status === "EXCEEDED" ? "border-red-200" :
                                    budget.status === "WARNING" ? "border-yellow-200" : "border-gray-200"
                            )}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const CategoryIcon = getCategoryIcon(budget.categoryName)
                                        return (
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                                budget.status === "EXCEEDED" ? "bg-red-100" :
                                                    budget.status === "WARNING" ? "bg-yellow-100" : "bg-green-100"
                                            )}>
                                                <CategoryIcon className={cn(
                                                    "w-5 h-5",
                                                    budget.status === "EXCEEDED" ? "text-red-600" :
                                                        budget.status === "WARNING" ? "text-yellow-600" : "text-green-600"
                                                )} />
                                            </div>
                                        )
                                    })()}
                                    <div>
                                        <p className="font-medium text-gray-900">{budget.categoryName}</p>
                                        <p className="text-xs text-gray-500">
                                            Còn lại: {formatCurrency(budget.remaining)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openEditModal(budget.budgetId)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(budget.budgetId)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">{formatCurrency(budget.spent)}</span>
                                    <span className="font-medium">{formatCurrency(budget.limit)}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            budget.status === "EXCEEDED" ? "bg-red-500" :
                                                budget.status === "WARNING" ? "bg-yellow-500" : "bg-green-500"
                                        )}
                                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full",
                                        budget.status === "EXCEEDED" ? "bg-red-100 text-red-700" :
                                            budget.status === "WARNING" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                                    )}>
                                        {budget.percentage}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm() }} title={editingBudget ? "Sửa ngân sách" : "Thêm ngân sách"} size="sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                        <Select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            required
                            disabled={!!editingBudget}
                        >
                            <option value="">Chọn danh mục</option>
                            {expenseCategories.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </Select>
                    </div>
                    <CurrencyInput
                        label="Hạn mức (VND)"
                        value={formData.limit}
                        onChange={(value) => setFormData({ ...formData, limit: value })}
                        placeholder="0"
                        required
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cảnh báo khi đạt (%)</label>
                        <Select
                            value={(formData.alertThreshold ?? 0.8).toString()}
                            onChange={(e) => setFormData({ ...formData, alertThreshold: Number(e.target.value) })}
                        >
                            <option value="0.5">50%</option>
                            <option value="0.6">60%</option>
                            <option value="0.7">70%</option>
                            <option value="0.8">80%</option>
                            <option value="0.9">90%</option>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full" isLoading={createMutation.isPending || updateMutation.isPending}>
                        {editingBudget ? "Cập nhật" : "Tạo ngân sách"}
                    </Button>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Xóa ngân sách"
                message="Bạn có chắc chắn muốn xóa ngân sách này?"
                isLoading={deleteMutation.isPending}
            />
        </div >
    )
}
