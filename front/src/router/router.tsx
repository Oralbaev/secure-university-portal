import React from "react"
import { useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom"

import LandingPage from "../pages/LandingPage"
import Dashboard from "../pages/Dashboard"
import Profile from "../pages/Profile"
import ChangePassword from "../pages/ChangePassword"

const ProtectedRoutes = () => {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [mustChangePassword, setMustChangePassword] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setAuthorized(null)
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    if (!token) {
      setAuthorized(false)
      return
    }

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Session expired")
        return response.json()
      })
      .then((result) => {
        setMustChangePassword(Boolean(result.user?.mustChangePassword))
        setAuthorized(true)
      })
      .catch(() => {
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
        sessionStorage.removeItem("authToken")
        sessionStorage.removeItem("authUser")
        setAuthorized(false)
      })
  }, [location.pathname])

  if (authorized === null) return null
  if (authorized && mustChangePassword && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />
  }
  if (authorized && !mustChangePassword && location.pathname === "/change-password") {
    return <Navigate to="/dashboard" replace />
  }
  return authorized ? <Outlet /> : <Navigate to="/" replace />
}

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  </Router>
)

export default App
