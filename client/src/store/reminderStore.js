import { create } from 'zustand'
import api from '../lib/axios'

const useReminderStore = create((set) => ({
  reminders: [],

  fetch: async () => {
    const { data } = await api.get('/reminders')
    set({ reminders: data })
  },

  create: async (payload) => {
    const { data } = await api.post('/reminders', payload)
    set((s) => ({ reminders: [data, ...s.reminders] }))
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/reminders/${id}`, payload)
    set((s) => ({ reminders: s.reminders.map((r) => (r._id === id ? data : r)) }))
  },

  remove: async (id) => {
    await api.delete(`/reminders/${id}`)
    set((s) => ({ reminders: s.reminders.filter((r) => r._id !== id) }))
  },

  toggle: async (id) => {
    const { data } = await api.patch(`/reminders/${id}/toggle`)
    set((s) => ({ reminders: s.reminders.map((r) => (r._id === id ? data : r)) }))
  },
}))

export default useReminderStore
