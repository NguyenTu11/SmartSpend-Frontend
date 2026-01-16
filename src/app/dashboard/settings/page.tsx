"use client"

import { useState, useRef } from "react"
import { Wallet as WalletIcon, Tag, Plus, Edit, Trash2, Award, TrendingUp, Camera } from "lucide-react"
import { useProfile, useFinancialScore, useUpdateProfile, useUpdateAvatar } from "@/hooks/useAuth"
import { useWallets, useCreateWallet, useUpdateWallet, useDeleteWallet } from "@/hooks/useWallet"
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategory"
import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/Select"
import { Modal } from "@/components/Modal"
import { ShimmerList } from "@/components/ShimmerLoading"
import { showToast } from "@/components/Toast"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { User, FinancialScoreResponse } from "@/types/user"
import { Wallet } from "@/types/wallet"
import { Category } from "@/types/category"
import { formatCurrency } from "@/lib/utils"
import { CurrencyInput } from "@/components/CurrencyInput"

export default function SettingsPage() {
    const { data: user, isLoading: userLoading } = useProfile()
    const { data: financialScore, isLoading: scoreLoading } = useFinancialScore()

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
                <p className="text-gray-500 mt-1">Quản lý tài khoản và dữ liệu</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfileSection user={user} isLoading={userLoading} />
                <FinancialScoreSection score={financialScore} isLoading={scoreLoading} />
            </div>

            <WalletsSection />
            <CategoriesSection />
        </div>
    )
}

function ProfileSection({ user, isLoading }: { user: User | undefined; isLoading: boolean }) {
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ name: "", bio: "" })
    const updateMutation = useUpdateProfile()
    const avatarMutation = useUpdateAvatar()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleEdit = () => {
        setFormData({ name: user?.name || "", bio: user?.bio || "" })
        setShowModal(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateMutation.mutate(formData, {
            onSuccess: () => {
                showToast("Cập nhật thông tin thành công", "success")
                setShowModal(false)
            },
            onError: () => {
                showToast("Có lỗi xảy ra", "error")
            },
        })
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        avatarMutation.mutate(file, {
            onSuccess: () => showToast("Cập nhật ảnh đại diện thành công", "success"),
            onError: () => showToast("Cập nhật ảnh thất bại", "error"),
        })
        e.target.value = ""
    }

    return (
        <Card title="Thông tin cá nhân" subtitle="Thông tin tài khoản của bạn" action={
            <Button size="sm" variant="outline" onClick={handleEdit} leftIcon={<Edit className="w-4 h-4" />}>
                Chỉnh sửa
            </Button>
        }>
            {isLoading ? (
                <div className="space-y-4">
                    <div className="shimmer h-16 w-16 rounded-full" />
                    <div className="shimmer h-6 w-48 rounded" />
                    <div className="shimmer h-4 w-32 rounded" />
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                            <img src="/images/user_default.png" alt={user?.name || "User"} className="w-16 h-16 rounded-full object-cover" />
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarMutation.isPending}
                            className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                            <Camera className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                        <p className="text-gray-500">{user?.email}</p>
                        {user?.bio && <p className="text-sm text-gray-400 mt-1">{user.bio}</p>}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <span>Tiền tệ: VND</span>
                        </div>
                    </div>
                </div>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Cập nhật thông tin" size="sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tên"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Giới thiệu"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Viết đôi dòng về bạn..."
                    />
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="submit" isLoading={updateMutation.isPending} className="flex-1">
                            Cập nhật
                        </Button>
                    </div>
                </form>
            </Modal>
        </Card>
    )
}

function FinancialScoreSection({ score, isLoading }: { score: FinancialScoreResponse | undefined; isLoading: boolean }) {
    const getScoreColor = (value: number) => {
        if (value >= 80) return "text-green-600"
        if (value >= 60) return "text-yellow-600"
        if (value >= 40) return "text-orange-600"
        return "text-red-600"
    }

    const getScoreBg = (value: number) => {
        if (value >= 80) return "bg-green-500"
        if (value >= 60) return "bg-yellow-500"
        if (value >= 40) return "bg-orange-500"
        return "bg-red-500"
    }

    return (
        <Card title="Điểm tài chính" subtitle="Đánh giá sức khỏe tài chính">
            {isLoading ? (
                <div className="space-y-4">
                    <div className="shimmer h-24 rounded-lg" />
                    <div className="shimmer h-4 w-full rounded" />
                    <div className="shimmer h-4 w-3/4 rounded" />
                </div>
            ) : !score ? (
                <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có dữ liệu</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreBg(score.score)} bg-opacity-10`}>
                                <span className={`text-4xl font-bold ${getScoreColor(score.score)}`}>
                                    {score.score}
                                </span>
                            </div>
                            <div className="text-center mt-2">
                                <span className={`text-sm font-medium px-3 py-1 rounded-full ${getScoreBg(score.score)} bg-opacity-20 ${getScoreColor(score.score)}`}>
                                    {score.grade}
                                </span>
                            </div>
                        </div>
                    </div>

                    {score.components?.length > 0 && (
                        <div className="space-y-2">
                            {score.components.map((comp: any, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{comp.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getScoreBg(comp.score / comp.maxScore * 100)}`}
                                                style={{ width: `${(comp.score / comp.maxScore) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500">{comp.score}/{comp.maxScore}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {score.recommendations?.length > 0 && (
                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Gợi ý cải thiện</h4>
                            <ul className="space-y-1">
                                {score.recommendations.slice(0, 3).map((rec: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-500 flex items-start gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </Card>
    )
}

function WalletsSection() {
    const [showModal, setShowModal] = useState(false)
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: "", balance: 0 })

    const { data: wallets, isLoading } = useWallets()
    const createMutation = useCreateWallet()
    const updateMutation = useUpdateWallet()
    const deleteMutation = useDeleteWallet()

    const resetForm = () => {
        setFormData({ name: "", balance: 0 })
        setEditingWallet(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingWallet) {
            updateMutation.mutate(
                { id: editingWallet._id, data: formData },
                {
                    onSuccess: () => {
                        showToast("Cập nhật ví thành công", "success")
                        setShowModal(false)
                        resetForm()
                    },
                }
            )
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    showToast("Tạo ví thành công", "success")
                    setShowModal(false)
                    resetForm()
                },
            })
        }
    }

    const handleDelete = () => {
        if (!deleteId) return
        deleteMutation.mutate(deleteId, {
            onSuccess: () => {
                showToast("Xóa ví thành công", "success")
                setDeleteId(null)
            },
        })
    }

    return (
        <Card
            title="Ví tiền"
            subtitle="Quản lý các ví của bạn"
            action={
                <Button size="sm" onClick={() => { resetForm(); setShowModal(true) }} leftIcon={<Plus className="w-4 h-4" />}>
                    Thêm ví
                </Button>
            }
        >
            {isLoading ? (
                <ShimmerList count={3} />
            ) : !wallets?.length ? (
                <p className="text-gray-500 text-center py-4">Chưa có ví nào</p>
            ) : (
                <div className="space-y-3">
                    {wallets.map((wallet) => (
                        <div key={wallet._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <WalletIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{wallet.name}</p>
                                    <p className="text-sm text-gray-500">{formatCurrency(wallet.balance)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => {
                                        setEditingWallet(wallet)
                                        setFormData({ name: wallet.name, balance: wallet.balance })
                                        setShowModal(true)
                                    }}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDeleteId(wallet._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); resetForm() }}
                title={editingWallet ? "Chỉnh sửa ví" : "Thêm ví mới"}
                size="sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tên ví"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ví tiền mặt"
                        required
                    />
                    <CurrencyInput
                        label="Số dư ban đầu"
                        value={formData.balance}
                        onChange={(value) => setFormData({ ...formData, balance: value })}
                        placeholder="0"
                    />
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm() }} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending} className="flex-1">
                            {editingWallet ? "Cập nhật" : "Tạo"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Xóa ví"
                message="Bạn có chắc chắn muốn xóa ví này?"
                isLoading={deleteMutation.isPending}
            />
        </Card>
    )
}

function CategoriesSection() {
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: "", type: "expense" as "income" | "expense" })

    const { data: categories, isLoading } = useCategories()
    const createMutation = useCreateCategory()
    const updateMutation = useUpdateCategory()
    const deleteMutation = useDeleteCategory()

    const resetForm = () => {
        setFormData({ name: "", type: "expense" })
        setEditingCategory(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingCategory) {
            updateMutation.mutate(
                { id: editingCategory._id, data: formData },
                {
                    onSuccess: () => {
                        showToast("Cập nhật danh mục thành công", "success")
                        setShowModal(false)
                        resetForm()
                    },
                }
            )
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    showToast("Tạo danh mục thành công", "success")
                    setShowModal(false)
                    resetForm()
                },
            })
        }
    }

    const handleDelete = () => {
        if (!deleteId) return
        deleteMutation.mutate(deleteId, {
            onSuccess: () => {
                showToast("Xóa danh mục thành công", "success")
                setDeleteId(null)
            },
        })
    }

    const expenseCategories = categories?.filter(c => c.type === "expense") || []
    const incomeCategories = categories?.filter(c => c.type === "income") || []

    return (
        <Card
            title="Danh mục"
            subtitle="Quản lý danh mục thu chi"
            action={
                <Button size="sm" onClick={() => { resetForm(); setShowModal(true) }} leftIcon={<Plus className="w-4 h-4" />}>
                    Thêm danh mục
                </Button>
            }
        >
            {isLoading ? (
                <ShimmerList count={4} />
            ) : !categories?.length ? (
                <p className="text-gray-500 text-center py-4">Chưa có danh mục nào</p>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Chi tiêu</h4>
                        <div className="flex flex-wrap gap-2">
                            {expenseCategories.map((cat) => (
                                <div key={cat._id} className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg group">
                                    <Tag className="w-4 h-4" />
                                    <span className="text-sm font-medium">{cat.name}</span>
                                    <button
                                        onClick={() => {
                                            setEditingCategory(cat)
                                            setFormData({ name: cat.name, type: cat.type || "expense" })
                                            setShowModal(true)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(cat._id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Thu nhập</h4>
                        <div className="flex flex-wrap gap-2">
                            {incomeCategories.map((cat) => (
                                <div key={cat._id} className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg group">
                                    <Tag className="w-4 h-4" />
                                    <span className="text-sm font-medium">{cat.name}</span>
                                    <button
                                        onClick={() => {
                                            setEditingCategory(cat)
                                            setFormData({ name: cat.name, type: cat.type || "income" })
                                            setShowModal(true)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-green-100 rounded"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(cat._id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-green-100 rounded"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); resetForm() }}
                title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                size="sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tên danh mục"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ăn uống"
                        required
                    />
                    <Select
                        label="Loại"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense" })}
                    >
                        <option value="expense">Chi tiêu</option>
                        <option value="income">Thu nhập</option>
                    </Select>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm() }} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending} className="flex-1">
                            {editingCategory ? "Cập nhật" : "Tạo"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Xóa danh mục"
                message="Bạn có chắc chắn muốn xóa danh mục này?"
                isLoading={deleteMutation.isPending}
            />
        </Card>
    )
}
