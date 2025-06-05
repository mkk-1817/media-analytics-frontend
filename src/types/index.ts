export interface User {
  id: string
  name: string
  email: string
  picture: string
}

export interface Chat {
  id: string
  userId: string
  title: string
  createdAt: string
  lastActivity: string
}

export interface MediaAnalysis {
  id: string
  chatId: string
  url: string
  platform: "instagram" | "facebook" | "twitter" | "youtube"
  type: "video" | "image" | "post"
  summary: string
  sentiment: "positive" | "negative" | "neutral"
  tags: string[]
  timestamp: string
}

export interface Message {
  id: string
  chatId: string
  type: "user" | "system"
  content: string
  mediaAnalysis?: MediaAnalysis
  timestamp: string
}
