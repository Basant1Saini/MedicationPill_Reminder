import { create } from 'zustand'
import api from '../lib/axios'

const useMedicationStore = create((set) => ({
  medications: [],

  fetch: async () => {
    const { data } = await api.get('/medications')
    set({ medications: data })
  },

  create: async (payload) => {
    const { data } = await api.post('/medications', payload)
    set((s) => ({ medications: [data, ...s.medications] }))
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/medications/${id}`, payload)
    set((s) => ({ medications: s.medications.map((m) => (m._id === id ? data : m)) }))
  },

  remove: async (id) => {
    await api.delete(`/medications/${id}`)
    set((s) => ({ medications: s.medications.filter((m) => m._id !== id) }))
  },
}))

export default useMedicationStore
