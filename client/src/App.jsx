import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Medications from './pages/Medications'
import Reminders from './pages/Reminders'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'

function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { getMe } = useAuthStore()
  useEffect(() => { getMe() }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/medications" element={<PrivateRoute><Medications /></PrivateRoute>} />
        <Route path="/reminders" element={<PrivateRoute><Reminders /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
