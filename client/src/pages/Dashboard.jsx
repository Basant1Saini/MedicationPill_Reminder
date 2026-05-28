import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../lib/axios'
import useMedicationStore from '../store/medicationStore'

const COLORS = ['#22c55e', '#ef4444', '#f59e0b']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const { medications, fetch } = useMedicationStore()

  useEffect(() => {
    fetch()
    api.get('/doses/stats').then(({ data }) => setStats(data))
  }, [])

  const lowStock = medications.filter((m) => m.stock <= m.refillAlert)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Doses', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: 'Taken', value: stats.taken, color: 'bg-green-50 text-green-700' },
            { label: 'Missed', value: stats.missed, color: 'bg-red-50 text-red-700' },
            { label: 'Adherence', value: `${stats.adherence}%`, color: 'bg-purple-50 text-purple-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
              <p className="text-sm opacity-70">{s.label}</p>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Adherence chart */}
      {stats && stats.total > 0 && (
        <div className="bg-white rounded-xl shadow p-4 mb-8">
          <h2 className="font-semibold mb-4">Adherence Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={[
                { name: 'Taken', value: stats.taken },
                { name: 'Missed', value: stats.missed },
                { name: 'Snoozed', value: stats.total - stats.taken - stats.missed },
              ]} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h2 className="font-semibold text-red-700 mb-2">⚠️ Low Stock Alerts</h2>
          <ul className="flex flex-col gap-1">
            {lowStock.map((m) => (
              <li key={m._id} className="text-sm text-red-600">
                {m.name} — only <strong>{m.stock}</strong> remaining
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
