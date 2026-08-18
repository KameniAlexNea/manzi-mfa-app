import { defineStore } from 'pinia'
import { JOBS } from '../data/jobs'

const KEY = 'manzi_jobs'
const SAVED_KEY = 'manzi_saved_jobs'

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: JSON.parse(localStorage.getItem(KEY) || 'null') || [...JOBS],
    saved: JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
  }),
  getters: {
    byId: (s) => (id) => s.jobs.find((j) => j.id === id)
  },
  actions: {
    publish(job) {
      const newJob = {
        id: 'job-' + Date.now(),
        logo: (job.company || 'C').trim().slice(0, 2).toUpperCase(),
        postedAt: 'À l’instant',
        stack: job.stack || [],
        featured: false,
        ...job
      }
      this.jobs.unshift(newJob)
      localStorage.setItem(KEY, JSON.stringify(this.jobs))
      return newJob
    },
    toggleSaved(id) {
      const i = this.saved.indexOf(id)
      if (i >= 0) this.saved.splice(i, 1)
      else this.saved.push(id)
      localStorage.setItem(SAVED_KEY, JSON.stringify(this.saved))
    },
    isSaved(id) {
      return this.saved.includes(id)
    }
  }
})
