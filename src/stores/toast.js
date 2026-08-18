import { defineStore } from 'pinia'

let seq = 0

export const useToastStore = defineStore('toast', {
  state: () => ({
    items: []
  }),
  actions: {
    show(message, type = 'success') {
      const id = ++seq
      this.items.push({ id, message, type })
      setTimeout(() => this.dismiss(id), 3200)
    },
    dismiss(id) {
      this.items = this.items.filter((t) => t.id !== id)
    }
  }
})
