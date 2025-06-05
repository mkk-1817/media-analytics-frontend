"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { Send, ArrowLeft, BarChart3, LogOut, ExternalLink, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import type { User, Message, MediaAnalysis } from "../types"

interface ChatInterfaceProps {
  user: User
  onSignOut: () => void
}

export default function ChatInterface({ user, onSignOut }: ChatInterfaceProps) {
  const { chatId } = useParams<{ chatId: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load messages for this chat
    const savedMessages = localStorage.getItem(`messages_${chatId}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Add welcome message for new chats
      const welcomeMessage: Message = {
        id: "1",
        chatId: chatId!,
        type: "system",
        content:
          "Welcome! Share a social media link (Instagram, Facebook, Twitter, or YouTube) and I'll provide a detailed analysis of the content.",
        timestamp: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
    }
  }, [chatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem(`messages_${chatId}`, JSON.stringify(newMessages))
  }

  const detectPlatform = (url: string): "instagram" | "facebook" | "twitter" | "youtube" | null => {
    if (url.includes("instagram.com")) return "instagram"
    if (url.includes("facebook.com")) return "facebook"
    if (url.includes("twitter.com") || url.includes("x.com")) return "twitter"
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
    return null
  }

  const generateMockAnalysis = (url: string, platform: string): MediaAnalysis => {
    const analyses = {
      instagram: {
        summary:
          "This Instagram reel showcases a lifestyle brand promoting sustainable fashion. The video features a model wearing eco-friendly clothing in a natural outdoor setting. The content emphasizes environmental consciousness and ethical fashion choices.",
        sentiment: "positive" as const,
        tags: ["fashion", "sustainability", "lifestyle", "eco-friendly", "outdoor"],
      },
      facebook: {
        summary:
          "This Facebook post discusses the latest trends in digital marketing. It includes statistics about social media engagement and provides actionable tips for businesses to improve their online presence.",
        sentiment: "neutral" as const,
        tags: ["marketing", "business", "social media", "engagement", "tips"],
      },
      twitter: {
        summary:
          "This Twitter thread explores the impact of AI on modern technology. The author shares insights about machine learning applications and discusses future implications for various industries.",
        sentiment: "positive" as const,
        tags: ["AI", "technology", "machine learning", "future", "innovation"],
      },
      youtube: {
        summary:
          "This YouTube video is a comprehensive tutorial on web development using React. The creator explains component architecture, state management, and best practices for building scalable applications.",
        sentiment: "positive" as const,
        tags: ["programming", "react", "tutorial", "web development", "education"],
      },
    }

    const analysis = analyses[platform as keyof typeof analyses]

    return {
      id: Date.now().toString(),
      chatId: chatId!,
      url,
      platform: platform as any,
      type: platform === "youtube" ? "video" : Math.random() > 0.5 ? "video" : "image",
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      tags: analysis.tags,
      timestamp: new Date().toISOString(),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: chatId!,
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    saveMessages(newMessages)
    setInputValue("")
    setLoading(true)

    // Check if input contains a social media URL
    const platform = detectPlatform(inputValue)

    setTimeout(() => {
      if (platform) {
        // Generate analysis
        const analysis = generateMockAnalysis(inputValue, platform)

        const systemMessage: Message = {
          id: (Date.now() + 1).toString(),
          chatId: chatId!,
          type: "system",
          content: `I've analyzed the ${platform} content. Here's what I found:`,
          mediaAnalysis: analysis,
          timestamp: new Date().toISOString(),
        }

        const updatedMessages = [...newMessages, systemMessage]
        setMessages(updatedMessages)
        saveMessages(updatedMessages)
      } else {
        // Regular response
        const systemMessage: Message = {
          id: (Date.now() + 1).toString(),
          chatId: chatId!,
          type: "system",
          content:
            "Please share a valid social media link from Instagram, Facebook, Twitter, or YouTube for me to analyze.",
          timestamp: new Date().toISOString(),
        }

        const updatedMessages = [...newMessages, systemMessage]
        setMessages(updatedMessages)
        saveMessages(updatedMessages)
      }
      setLoading(false)
    }, 2000)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100"
      case "negative":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4" />
      case "negative":
        return <ThumbsDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MediaAnalytics</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src={user.picture || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button onClick={onSignOut} className="text-gray-500 hover:text-gray-700 p-2">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-3xl rounded-lg p-4 ${
                  message.type === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"
                }`}
              >
                <p className="text-sm">{message.content}</p>

                {message.mediaAnalysis && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {message.mediaAnalysis.platform}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 capitalize">{message.mediaAnalysis.type}</span>
                      </div>
                      <a
                        href={message.mediaAnalysis.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2">Content Summary</h4>
                    <p className="text-gray-700 text-sm mb-4">{message.mediaAnalysis.summary}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500">Sentiment:</span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(message.mediaAnalysis.sentiment)}`}
                        >
                          {getSentimentIcon(message.mediaAnalysis.sentiment)}
                          <span className="ml-1 capitalize">{message.mediaAnalysis.sentiment}</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-xs font-medium text-gray-500 block mb-2">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {message.mediaAnalysis.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs opacity-70 mt-2">{new Date(message.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Analyzing content...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste a social media link or ask a question..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Supported platforms: Instagram, Facebook, Twitter, YouTube
          </p>
        </div>
      </div>
    </div>
  )
}
