import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold">💊 PillReminder</Link>
      {user && (
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/medications" className="hover:underline">Medications</Link>
          <Link to="/reminders" className="hover:underline">Reminders</Link>
          <Link to="/history" className="hover:underline">History</Link>
          <span className="opacity-75">{user.name}</span>
          <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
