"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import LandingPage from "./pages/LandingPage"
import SignIn from "./pages/SignIn"
import Dashboard from "./pages/Dashboard"
import ChatInterface from "./pages/ChatInterface"
import type { User } from "./types"

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already signed in (localStorage simulation)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleSignIn = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={user ? <Navigate to="/dashboard" /> : <SignIn onSignIn={handleSignIn} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/chat/:chatId"
          element={user ? <ChatInterface user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  )
}

export default App
