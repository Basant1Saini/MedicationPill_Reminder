import { useEffect, useState } from 'react'
import api from '../lib/axios'
import DoseHistory from '../components/DoseHistory'
import useMedicationStore from '../store/medicationStore'

export default function History() {
  const [doses, setDoses] = useState([])
  const { medications, fetch } = useMedicationStore()
  const [form, setForm] = useState({ medicationId: '', scheduledAt: '', status: 'taken' })

  const loadDoses = () => api.get('/doses').then(({ data }) => setDoses(data))

  useEffect(() => { loadDoses(); fetch() }, [])

  const logDose = async (e) => {
    e.preventDefault()
    await api.post('/doses/log', form)
    setForm({ medicationId: '', scheduledAt: '', status: 'taken' })
    loadDoses()
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dose History</h1>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="font-semibold mb-3">Log a Dose</h2>
        <form onSubmit={logDose} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="text-sm font-medium">Medication</label>
            <select value={form.medicationId} onChange={(e) => setForm({ ...form, medicationId: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-1" required>
              <option value="">Select...</option>
              {medications.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-sm font-medium">Scheduled At</label>
            <input type="datetime-local" value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-1" required />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border rounded px-3 py-2 mt-1">
              <option value="taken">Taken</option>
              <option value="missed">Missed</option>
              <option value="snoozed">Snoozed</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Log</button>
        </form>
      </div>

      <DoseHistory doses={doses} />
    </div>
  )
}
