import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useMedicationStore from '../store/medicationStore'
import MedicationCard from '../components/MedicationCard'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  dosage: z.string().min(1, 'Required'),
  form: z.enum(['tablet', 'capsule', 'liquid', 'injection']),
  stock: z.coerce.number().min(0),
  refillAlert: z.coerce.number().min(1),
  notes: z.string().optional(),
})

function MedModal({ onClose, existing }) {
  const { create, update } = useMedicationStore()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing || { form: 'tablet', stock: 30, refillAlert: 5 },
  })

  const onSubmit = async (values) => {
    existing ? await update(existing._id, values) : await create(values)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">{existing ? 'Edit' : 'Add'} Medication</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {[['name', 'Name'], ['dosage', 'Dosage (e.g. 500mg)']].map(([field, label]) => (
            <div key={field}>
              <label className="text-sm font-medium">{label}</label>
              <input {...register(field)} className="w-full border rounded px-3 py-2 mt-1" />
              {errors[field] && <p className="text-red-500 text-xs">{errors[field].message}</p>}
            </div>
          ))}
          <div>
            <label className="text-sm font-medium">Form</label>
            <select {...register('form')} className="w-full border rounded px-3 py-2 mt-1">
              {['tablet', 'capsule', 'liquid', 'injection'].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium">Stock</label>
              <input type="number" {...register('stock')} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Refill Alert At</label>
              <input type="number" {...register('refillAlert')} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <textarea {...register('notes')} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </div>
          <div className="flex gap-2 mt-2">
            <button disabled={isSubmitting} className="flex-1 bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border rounded py-2 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Medications() {
  const { medications, fetch } = useMedicationStore()
  const [modal, setModal] = useState(null) // null | 'add' | med object

  useEffect(() => { fetch() }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medications</h1>
        <button onClick={() => setModal('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add
        </button>
      </div>

      {medications.length === 0
        ? <p className="text-gray-400">No medications yet. Add one!</p>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((m) => (
              <MedicationCard key={m._id} med={m} onEdit={(med) => setModal(med)} />
            ))}
          </div>
      }

      {modal && (
        <MedModal
          onClose={() => setModal(null)}
          existing={modal === 'add' ? null : modal}
        />
      )}
    </div>
  )
}
