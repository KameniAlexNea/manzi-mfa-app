import { defineStore } from 'pinia'

const AUTH_KEY = 'manzi_authed'
const USER_KEY = 'manzi_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: localStorage.getItem(AUTH_KEY) === 'true',
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    // Rôle choisi sur la landing (Étape 1) : 'mentee' | 'mentor'
    role: localStorage.getItem('manzi_role') || null,
    loading: false
  }),
  getters: {
    displayName: (s) => s.user?.firstName || s.user?.name || 'Membre',
    isMentor: (s) => s.role === 'mentor',
    isMentee: (s) => s.role === 'mentee'
  },
  actions: {
    chooseRole(role) {
      this.role = role
      localStorage.setItem('manzi_role', role)
    },
    async login(provider) {
      this.loading = true
      // Simulated OAuth for the MVP (Google / LinkedIn / GitHub)
      await new Promise((r) => setTimeout(r, 600))
      const fallbackNames = { google: 'Alex', linkedin: 'Alex', github: 'alex-dev' }
      this.user = {
        id: 'me',
        name: fallbackNames[provider] || 'Membre',
        firstName: 'Alex',
        provider,
        email: provider === 'google' ? 'alex@gmail.com' : `${fallbackNames[provider]}@exemple.com`
      }
      this.isAuthenticated = true
      localStorage.setItem(AUTH_KEY, 'true')
      localStorage.setItem(USER_KEY, JSON.stringify(this.user))
      this.loading = false
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
      this.role = null
      localStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem('manzi_role')
      localStorage.removeItem('manzi_profile')
    }
  }
})
