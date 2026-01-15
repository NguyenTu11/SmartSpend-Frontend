import {
    Utensils,
    Car,
    ShoppingBag,
    Gamepad2,
    Receipt,
    Heart,
    GraduationCap,
    MoreHorizontal,
    Wallet,
    TrendingUp,
    Gift,
    DollarSign,
    LucideIcon
} from "lucide-react"

const categoryIconMap: Record<string, LucideIcon> = {
    "Ăn uống": Utensils,
    "Di chuyển": Car,
    "Mua sắm": ShoppingBag,
    "Giải trí": Gamepad2,
    "Hóa đơn": Receipt,
    "Sức khỏe": Heart,
    "Giáo dục": GraduationCap,
    "Khác": MoreHorizontal,
    "Lương": Wallet,
    "Đầu tư": TrendingUp,
    "Quà tặng": Gift,
    "Thu nhập khác": DollarSign,
}

export const getCategoryIcon = (categoryName: string): LucideIcon => {
    return categoryIconMap[categoryName] || MoreHorizontal
}
