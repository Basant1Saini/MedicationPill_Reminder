import { useEffect, useState } from 'react'
import useReminderStore from '../store/reminderStore'
import useMedicationStore from '../store/medicationStore'
import ReminderForm from '../components/ReminderForm'
import { formatTime } from '../lib/utils'

export default function Reminders() {
  const { reminders, fetch, remove, toggle } = useReminderStore()
  const { medications, fetch: fetchMeds } = useMedicationStore()
  const [modal, setModal] = useState(null)

  useEffect(() => { fetch(); fetchMeds() }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reminders</h1>
        <button onClick={() => setModal('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add
        </button>
      </div>

      {reminders.length === 0
        ? <p className="text-gray-400">No reminders yet.</p>
        : <div className="flex flex-col gap-3">
            {reminders.map((r) => (
              <div key={r._id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{r.medicationId?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">
                    {r.times.map(formatTime).join(', ')} · {r.days.join(', ')}
                  </p>
                  <p className="text-xs text-gray-400">via {r.notifyVia.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(r._id)}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {r.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button onClick={() => setModal(r)} className="text-sm text-blue-500 hover:underline">Edit</button>
                  <button onClick={() => remove(r._id)} className="text-sm text-red-400 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
      }

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-4">{modal === 'add' ? 'Add' : 'Edit'} Reminder</h2>
            <ReminderForm onClose={() => setModal(null)} existing={modal === 'add' ? null : modal} />
          </div>
        </div>
      )}
    </div>
  )
}
