"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, MessageSquare, BarChart3, LogOut, Calendar, TrendingUp } from "lucide-react"
import type { User, Chat } from "../types"

interface DashboardProps {
  user: User
  onSignOut: () => void
}

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // Load user's chats from localStorage (simulating MongoDB)
    const savedChats = localStorage.getItem(`chats_${user.id}`)
    if (savedChats) {
      setChats(JSON.parse(savedChats))
    }
  }, [user.id])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      userId: user.id,
      title: `Analysis ${chats.length + 1}`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    }

    const updatedChats = [newChat, ...chats]
    setChats(updatedChats)
    localStorage.setItem(`chats_${user.id}`, JSON.stringify(updatedChats))

    navigate(`/chat/${newChat.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-gray-600">Analyze your social media content and get detailed insights.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold text-gray-900">{chats.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Analyses This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    chats.filter((chat) => {
                      const chatDate = new Date(chat.createdAt)
                      const now = new Date()
                      return chatDate.getMonth() === now.getMonth() && chatDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Activity</p>
                <p className="text-2xl font-bold text-gray-900">{chats.length > 0 ? "Today" : "None"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Your Analysis Chats</h2>
                  <button
                    onClick={createNewChat}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </button>
                </div>
              </div>

              <div className="p-6">
                {chats.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first chat to start analyzing social media content.
                    </p>
                    <button
                      onClick={createNewChat}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create First Chat
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chats.map((chat) => (
                      <Link
                        key={chat.id}
                        to={`/chat/${chat.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{chat.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Created {new Date(chat.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={createNewChat}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium">New Analysis</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Start analyzing new content</p>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Platforms</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Instagram
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Facebook
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3"></div>
                  Twitter
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  YouTube
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
