import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Providers } from "@/components/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "VIMO",
    description: "Quản lý chi tiêu thông minh cùng với AI",
    icons: {
        icon: "/images/logo_mivo.png",
        apple: "/images/logo_mivo.png",
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi" data-scroll-behavior="smooth">
            <body className={inter.className}>
                <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
