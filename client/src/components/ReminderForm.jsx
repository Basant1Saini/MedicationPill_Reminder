import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useReminderStore from '../store/reminderStore'
import useMedicationStore from '../store/medicationStore'

const schema = z.object({
  medicationId: z.string().min(1, 'Select a medication'),
  times: z.string().min(1, 'Enter at least one time'),
  days: z.string().min(1, 'Enter days'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional(),
  notifyVia: z.array(z.string()).min(1, 'Select at least one notification method'),
})

export default function ReminderForm({ onClose, existing }) {
  const { create, update } = useReminderStore()
  const { medications } = useMedicationStore()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing ? {
      ...existing,
      medicationId: existing.medicationId?._id || existing.medicationId,
      times: existing.times.join(', '),
      days: existing.days.join(', '),
    } : { notifyVia: ['push'] },
  })

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      times: values.times.split(',').map((t) => t.trim()),
      days: values.days.split(',').map((d) => d.trim()),
    }
    existing ? await update(existing._id, payload) : await create(payload)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <label className="text-sm font-medium">Medication</label>
        <select {...register('medicationId')} className="w-full border rounded px-3 py-2 mt-1">
          <option value="">Select...</option>
          {medications.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        {errors.medicationId && <p className="text-red-500 text-xs">{errors.medicationId.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Times (comma separated, e.g. 08:00, 20:00)</label>
        <input {...register('times')} className="w-full border rounded px-3 py-2 mt-1" placeholder="08:00, 14:00" />
        {errors.times && <p className="text-red-500 text-xs">{errors.times.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Days (e.g. daily or Mon, Wed, Fri)</label>
        <input {...register('days')} className="w-full border rounded px-3 py-2 mt-1" placeholder="daily" />
        {errors.days && <p className="text-red-500 text-xs">{errors.days.message}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm font-medium">Start Date</label>
          <input type="date" {...register('startDate')} className="w-full border rounded px-3 py-2 mt-1" />
          {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate.message}</p>}
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium">End Date (optional)</label>
          <input type="date" {...register('endDate')} className="w-full border rounded px-3 py-2 mt-1" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notify via</label>
        <div className="flex gap-4 mt-1">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" value="push" {...register('notifyVia')} /> Push
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" value="email" {...register('notifyVia')} /> Email
          </label>
        </div>
        {errors.notifyVia && <p className="text-red-500 text-xs">{errors.notifyVia.message}</p>}
      </div>

      <div className="flex gap-2 mt-2">
        <button type="submit" className="flex-1 bg-blue-600 text-white rounded py-2 hover:bg-blue-700">
          {existing ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onClose} className="flex-1 border rounded py-2 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}
