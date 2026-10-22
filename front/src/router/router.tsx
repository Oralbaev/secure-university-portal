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
  const [access, setAccess] = useState<{
    pathname: string
    authorized: boolean | null
    mustChangePassword: boolean
  }>({ pathname: "", authorized: null, mustChangePassword: false })
  const location = useLocation()

  useEffect(() => {
    let cancelled = false
    const pathname = location.pathname
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

    const sessionRequest = token
      ? fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/me`,
          { headers: { Authorization: `Bearer ${token}` } },
        ).then((response) => {
          if (!response.ok) throw new Error("Session expired")
          return response.json()
        }).then((result) => ({
          authorized: true,
          mustChangePassword: Boolean(result.user?.mustChangePassword),
        }))
      : Promise.resolve({ authorized: false, mustChangePassword: false })

    sessionRequest
      .then((result) => {
        if (!cancelled) setAccess({ pathname, ...result })
      })
      .catch(() => {
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
        sessionStorage.removeItem("authToken")
        sessionStorage.removeItem("authUser")
        if (!cancelled) {
          setAccess({ pathname, authorized: false, mustChangePassword: false })
        }
      })
    return () => {
      cancelled = true
    }
  }, [location.pathname])

  const currentAccess =
    access.pathname === location.pathname
      ? access
      : { pathname: location.pathname, authorized: null, mustChangePassword: false }
  const { authorized, mustChangePassword } = currentAccess

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
