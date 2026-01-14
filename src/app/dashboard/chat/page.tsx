"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Send, ThumbsUp, ThumbsDown } from "lucide-react"
import { useChatHistory, useSendMessage, useSendFeedback } from "@/hooks/useChat"
import { useProfile } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { ShimmerList } from "@/components/ShimmerLoading"
import { ChatMessage } from "@/types/chat"

const DEFAULT_AVATAR = "/images/user_default.png"
const AI_AVATAR = "/images/logo_AI.jpeg"

interface PendingMessage {
    id: string
    message: string
}

export default function ChatPage() {
    const { data: messages, isLoading } = useChatHistory()
    const { data: user } = useProfile()
    const sendMessageMutation = useSendMessage()
    const sendFeedbackMutation = useSendFeedback()

    const [input, setInput] = useState("")
    const [pendingMessage, setPendingMessage] = useState<PendingMessage | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, pendingMessage])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || sendMessageMutation.isPending) return

        const messageText = input.trim()
        setPendingMessage({ id: Date.now().toString(), message: messageText })
        setInput("")

        sendMessageMutation.mutate(
            { message: messageText },
            {
                onSettled: () => {
                    setPendingMessage(null)
                }
            }
        )
    }

    const handleFeedback = (messageId: string, feedback: "like" | "dislike") => {
        sendFeedbackMutation.mutate({ id: messageId, data: { feedback } })
    }

    const getAvatarUrl = () => {
        if (user?.avatar?.url) return user.avatar.url
        return DEFAULT_AVATAR
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] fade-in">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Trợ lý tài chính AI</h1>
                <p className="text-sm text-gray-500">Hỏi đáp về chi tiêu và lời khuyên tài chính</p>
            </div>

            <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading ? (
                        <ShimmerList count={3} />
                    ) : !messages?.length && !pendingMessage ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Image
                                src={AI_AVATAR}
                                alt="AI Assistant"
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-full object-cover mb-4"
                            />
                            <h3 className="text-lg font-medium text-gray-900">Xin chào!</h3>
                            <p className="text-gray-500 mt-2 max-w-sm">
                                Tôi là trợ lý tài chính AI. Hãy hỏi tôi bất cứ điều gì về chi tiêu, ngân sách, hay lời khuyên tiết kiệm.
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages?.map((chat) => (
                                <MessageGroup
                                    key={chat._id}
                                    chat={chat}
                                    userAvatar={getAvatarUrl()}
                                    onFeedback={handleFeedback}
                                />
                            ))}

                            {pendingMessage && (
                                <>
                                    <div className="flex items-start gap-3 justify-end">
                                        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                                            <p className="whitespace-pre-wrap">{pendingMessage.message}</p>
                                        </div>
                                        <img
                                            src={getAvatarUrl()}
                                            alt="User"
                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        />
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Image
                                            src={AI_AVATAR}
                                            alt="AI"
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        />
                                        <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={sendMessageMutation.isPending}
                        />
                        <Button
                            type="submit"
                            isLoading={sendMessageMutation.isPending}
                            disabled={!input.trim()}
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function MessageGroup({
    chat,
    userAvatar,
    onFeedback
}: {
    chat: ChatMessage
    userAvatar: string
    onFeedback: (id: string, feedback: "like" | "dislike") => void
}) {
    return (
        <>
            <div className="flex items-start gap-3 justify-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                    <p className="whitespace-pre-wrap">{chat.message}</p>
                </div>
                <img
                    src={userAvatar}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
            </div>

            {chat.response && (
                <div className="flex items-start gap-3">
                    <Image
                        src="/images/logo_AI.jpeg"
                        alt="AI"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="max-w-[80%]">
                        <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
                            <p className="text-gray-800 whitespace-pre-wrap">{chat.response}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={() => onFeedback(chat._id, "like")}
                                className={`p-1.5 rounded-lg transition-colors ${chat.feedback === "like"
                                        ? "bg-green-100 text-green-600"
                                        : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                                    }`}
                            >
                                <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onFeedback(chat._id, "dislike")}
                                className={`p-1.5 rounded-lg transition-colors ${chat.feedback === "dislike"
                                        ? "bg-red-100 text-red-600"
                                        : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                                    }`}
                            >
                                <ThumbsDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
