import useMedicationStore from '../store/medicationStore'

export default function MedicationCard({ med, onEdit }) {
  const { remove } = useMedicationStore()

  const stockColor = med.stock <= med.refillAlert
    ? 'text-red-500 font-semibold'
    : 'text-green-600'

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{med.name}</h3>
          <p className="text-sm text-gray-500">{med.dosage} · {med.form}</p>
        </div>
        <span className={`text-sm ${stockColor}`}>{med.stock} left</span>
      </div>
      {med.notes && <p className="text-sm text-gray-400">{med.notes}</p>}
      <div className="flex gap-2 mt-2">
        <button onClick={() => onEdit(med)} className="flex-1 text-sm border border-blue-500 text-blue-500 rounded py-1 hover:bg-blue-50">
          Edit
        </button>
        <button onClick={() => remove(med._id)} className="flex-1 text-sm border border-red-400 text-red-400 rounded py-1 hover:bg-red-50">
          Delete
        </button>
      </div>
    </div>
  )
}
