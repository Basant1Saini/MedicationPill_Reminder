import { create } from 'zustand'
import api from '../lib/axios'

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  getMe: async () => {
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    set({ user: data })
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    set({ user: data })
  },

  logout: async () => {
    await api.post('/auth/logout')
    set({ user: null })
  },
}))

export default useAuthStore
