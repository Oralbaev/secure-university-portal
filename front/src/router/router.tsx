import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import LandingPage from "../pages/LandingPage"
import Dashboard from "../pages/Dashboard"
import Profile from "../pages/Profile"

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </Router>
)

export default App
