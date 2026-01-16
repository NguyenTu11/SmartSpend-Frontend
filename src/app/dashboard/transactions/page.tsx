"use client"

import { useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, ArrowUpRight, ArrowDownRight, Edit, Trash2, Camera, Download, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import {
    useTransactions,
    useCreateTransaction,
    useUpdateTransaction,
    useDeleteTransaction,
    useExportTransactions
} from "@/hooks/useTransaction"
import { useScanReceipt } from "@/hooks/useOcr"
import { useCategories } from "@/hooks/useCategory"
import { useWallets } from "@/hooks/useWallet"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/Select"
import { Modal } from "@/components/Modal"
import { ShimmerTable } from "@/components/ShimmerLoading"
import { showToast } from "@/components/Toast"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Transaction, TransactionPayload } from "@/types/transaction"
import { formatCurrency, formatDate, cn } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/categoryIcons"
import { CurrencyInput } from "@/components/CurrencyInput"

const ITEMS_PER_PAGE = 10

export default function TransactionsPage() {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [showOcrModal, setShowOcrModal] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [filterType, setFilterType] = useState<string>("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data: transactionsData, isLoading } = useTransactions({ type: filterType || undefined })
    const { data: categories } = useCategories()
    const { data: wallets } = useWallets()
    const createMutation = useCreateTransaction()
    const updateMutation = useUpdateTransaction()
    const deleteMutation = useDeleteTransaction()
    const exportMutation = useExportTransactions()
    const scanMutation = useScanReceipt()

    const transactions = transactionsData?.data || []

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (!startDate && !endDate) return true
            const txDate = new Date(tx.createdAt).setHours(0, 0, 0, 0)
            const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null
            const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null
            if (start && txDate < start) return false
            if (end && txDate > end) return false
            return true
        })
    }, [transactions, startDate, endDate])

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const [formData, setFormData] = useState<TransactionPayload>({
        walletId: "",
        categoryId: "",
        type: "expense",
        amount: 0,
    })

    const resetForm = () => {
        setFormData({
            walletId: wallets?.[0]?._id || "",
            categoryId: "",
            type: "expense",
            amount: 0,
        })
        setEditingTransaction(null)
    }

    const openCreateModal = () => {
        if (!wallets || wallets.length === 0) {
            showToast("Vui lòng tạo ví trước khi thêm giao dịch", "error")
            router.push("/dashboard/settings")
            return
        }
        resetForm()
        setShowModal(true)
    }

    const openEditModal = (tx: Transaction) => {
        setEditingTransaction(tx)
        setFormData({
            walletId: typeof tx.walletId === "object" ? tx.walletId._id : tx.walletId,
            categoryId: typeof tx.categoryId === "object" ? tx.categoryId._id : tx.categoryId,
            type: tx.type,
            amount: tx.amount,
        })
        setShowModal(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingTransaction) {
            updateMutation.mutate(
                { id: editingTransaction._id, data: formData },
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
                    showToast("Tạo giao dịch thành công", "success")
                    setShowModal(false)
                    resetForm()
                },
                onError: () => showToast("Tạo giao dịch thất bại", "error"),
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

    const handleExport = (format: "csv" | "json") => {
        exportMutation.mutate(
            { format },
            {
                onSuccess: (response) => {
                    const blob = new Blob([response.data], {
                        type: format === "csv" ? "text/csv" : "application/json"
                    })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `transactions.${format}`
                    link.click()
                    window.URL.revokeObjectURL(url)
                    showToast("Xuất file thành công", "success")
                },
                onError: () => showToast("Xuất thất bại", "error"),
            }
        )
    }

    const handleOcrScan = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.target.value = ""
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result as string
            scanMutation.mutate(
                { image: base64, saveImage: false },
                {
                    onSuccess: (response) => {
                        const data = response.data
                        if (data?.success && data.extractedData) {
                            setFormData({
                                ...formData,
                                amount: data.extractedData.amount || 0,
                                categoryId: data.matchedCategoryId || "",
                                type: "expense",
                                walletId: wallets?.[0]?._id || formData.walletId,
                            })
                            setShowOcrModal(false)
                            setShowModal(true)
                            showToast("Quét thành công", "success")
                        } else {
                            showToast("Không đọc được hóa đơn", "error")
                        }
                    },
                    onError: () => showToast("Quét thất bại", "error"),
                }
            )
        }
        reader.readAsDataURL(file)
    }

    const filteredCategories = categories?.filter(c => c.type === formData.type) || []

    return (
        <div className="space-y-4 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Giao dịch</h1>
                    <p className="text-sm text-gray-500">{filteredTransactions.length} giao dịch</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                        if (!wallets || wallets.length === 0) {
                            showToast("Vui lòng tạo ví trước khi thêm giao dịch", "error")
                            router.push("/dashboard/settings")
                            return
                        }
                        setShowOcrModal(true)
                    }} leftIcon={<Camera className="w-4 h-4" />}>
                        Quét
                    </Button>
                    <Button size="sm" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
                        Thêm mới
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <Select
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1) }}
                            className="w-32"
                        >
                            <option value="">Tất cả</option>
                            <option value="income">Thu nhập</option>
                            <option value="expense">Chi tiêu</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1) }}
                            className="flex-1"
                        />
                        <span className="text-gray-400">→</span>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1) }}
                            className="flex-1"
                        />
                    </div>
                    <div className="flex gap-1 ml-auto">
                        <Button size="sm" variant="ghost" onClick={() => handleExport("csv")}>
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <ShimmerTable rows={5} />
                ) : paginatedTransactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Không có giao dịch nào</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {paginatedTransactions.map((tx) => (
                            <div key={tx._id} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const categoryName = typeof tx.categoryId === "object" ? tx.categoryId.name : ""
                                        const CategoryIcon = getCategoryIcon(categoryName)
                                        return (
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                                tx.type === "income" ? "bg-green-100" : "bg-red-100"
                                            )}>
                                                <CategoryIcon className={cn(
                                                    "w-5 h-5",
                                                    tx.type === "income" ? "text-green-600" : "text-red-600"
                                                )} />
                                            </div>
                                        )
                                    })()}
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {typeof tx.categoryId === "object" ? tx.categoryId.name : "Không xác định"}
                                        </p>
                                        <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "font-semibold",
                                        tx.type === "income" ? "text-green-600" : "text-red-600"
                                    )}>
                                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => openEditModal(tx)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(tx._id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                            Trang {currentPage}/{totalPages}
                        </span>
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm() }} title={editingTransaction ? "Sửa giao dịch" : "Thêm giao dịch"} size="sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "expense", categoryId: "" })}
                            className={cn(
                                "py-2.5 rounded-xl font-medium transition-all",
                                formData.type === "expense"
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            Chi tiêu
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "income", categoryId: "" })}
                            className={cn(
                                "py-2.5 rounded-xl font-medium transition-all",
                                formData.type === "income"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            Thu nhập
                        </button>
                    </div>
                    <CurrencyInput
                        label="Số tiền"
                        value={formData.amount}
                        onChange={(value) => setFormData({ ...formData, amount: value })}
                        placeholder="0"
                        required
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ví</label>
                            <Select
                                value={formData.walletId}
                                onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                                required
                            >
                                <option value="">Chọn ví</option>
                                {wallets?.map((w) => (
                                    <option key={w._id} value={w._id}>{w.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                            <Select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            >
                                <option value="">Chọn danh mục</option>
                                {filteredCategories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <Button type="submit" className="w-full" isLoading={createMutation.isPending || updateMutation.isPending}>
                        {editingTransaction ? "Cập nhật" : "Tạo giao dịch"}
                    </Button>
                </form>
            </Modal>

            <Modal isOpen={showOcrModal} onClose={() => setShowOcrModal(false)} title="Quét hóa đơn" size="sm">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                        <Camera className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600">Chụp hoặc chọn ảnh hóa đơn để tự động nhập giao dịch</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleOcrScan}
                        className="hidden"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        isLoading={scanMutation.isPending}
                        className="w-full"
                    >
                        Chọn ảnh
                    </Button>
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Xóa giao dịch"
                message="Bạn có chắc chắn muốn xóa giao dịch này?"
                isLoading={deleteMutation.isPending}
            />
        </div >
    )
}
