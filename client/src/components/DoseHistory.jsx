import { formatDate, formatTime } from '../lib/utils'

const statusColor = {
  taken: 'bg-green-100 text-green-700',
  missed: 'bg-red-100 text-red-700',
  snoozed: 'bg-yellow-100 text-yellow-700',
}

export default function DoseHistory({ doses }) {
  if (!doses.length) return <p className="text-gray-400 text-sm">No dose history yet.</p>

  return (
    <div className="flex flex-col gap-2">
      {doses.map((d) => (
        <div key={d._id} className="flex items-center justify-between bg-white rounded-lg shadow-sm px-4 py-3">
          <div>
            <p className="font-medium text-sm">{d.medicationId?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-400">{formatDate(d.scheduledAt)} · {formatTime(d.scheduledAt.slice(11, 16))}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[d.status]}`}>
            {d.status}
          </span>
        </div>
      ))}
    </div>
  )
}
