import { defineStore } from 'pinia'

const KEY = 'manzi_profile'

const defaultProfile = () => ({
  firstName: '',
  lastName: '',
  title: '',
  years: '',
  school: '',
  company: '',
  linkedin: '',
  stack: [],
  bio: '',
  photo: null,
  level: 'Débutant'
})

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: { ...defaultProfile(), ...(JSON.parse(localStorage.getItem(KEY) || '{}')) },
    step: 1
  }),
  getters: {
    isComplete: (s) => !!(s.profile.firstName && s.profile.lastName && s.profile.title && s.profile.stack.length),
    fullName: (s) => `${s.profile.firstName} ${s.profile.lastName}`.trim()
  },
  actions: {
    update(patch) {
      this.profile = { ...this.profile, ...patch }
      this.persist()
    },
    toggleSkill(skill) {
      const i = this.profile.stack.indexOf(skill)
      if (i >= 0) this.profile.stack.splice(i, 1)
      else this.profile.stack.push(skill)
      this.persist()
    },
    setStep(n) {
      this.step = n
    },
    reset() {
      this.profile = defaultProfile()
      this.step = 1
      localStorage.removeItem(KEY)
    },
    persist() {
      localStorage.setItem(KEY, JSON.stringify(this.profile))
    }
  }
})
