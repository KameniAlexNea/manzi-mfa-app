import { defineStore } from 'pinia'

const BOOKINGS_KEY = 'manzi_bookings'
const AVAIL_KEY = 'manzi_availability'

// Créneaux par défaut du mentor (moi)
const defaultAvailability = [
  { day: 'Lundi', start: '09:00', end: '12:00' },
  { day: 'Mardi', start: '14:00', end: '17:00' },
  { day: 'Jeudi', start: '10:00', end: '13:00' },
  { day: 'Vendredi', start: '09:00', end: '11:00' }
]

// Réservations initiales (côté mentor : mes mentorés, côté mentoré : mes quick chats)
const seedBookings = [
  {
    id: 'bk-1',
    mentorId: 'mentor-1',
    mentorName: 'Amara Diallo',
    mentorTitle: 'Développeuse Frontend Senior',
    topic: 'cv',
    duration: 15,
    date: '2026-08-20',
    time: '10:00',
    status: 'confirmed',
    note: 'Review de mon CV avant candidature'
  },
  {
    id: 'bk-2',
    mentorId: 'mentor-8',
    mentorName: 'Moussa Traoré',
    mentorTitle: 'Architecte Solutions',
    topic: 'orientation',
    duration: 30,
    date: '2026-08-22',
    time: '16:00',
    status: 'confirmed',
    note: 'Quelle spécialisation choisir ?'
  }
]

// Mentorés rattachés à "mon" profil mentor (pour la vue "Mes mentorés")
const seedMentorees = [
  {
    id: 'mr-1',
    name: 'Léa Kouassi',
    title: 'Étudiante en reconversion',
    goal: 'Devenir développeuse frontend',
    nextSession: 'Jeu 21 août · 10:00',
    status: 'confirmed',
    messages: 3
  },
  {
    id: 'mr-2',
    name: 'Yannick Essomba',
    title: 'Junior Data Analyst',
    goal: 'Préparer un entretien Data',
    nextSession: 'Lun 25 août · 09:30',
    status: 'confirmed',
    messages: 1
  },
  {
    id: 'mr-3',
    name: 'Awa Ndiaye',
    title: 'Bootcamp Le Wagon',
    goal: 'Review de projet final',
    nextSession: '—',
    status: 'pending',
    messages: 0
  }
]

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    availability: JSON.parse(localStorage.getItem(AVAIL_KEY) || 'null') || [...defaultAvailability],
    bookings: JSON.parse(localStorage.getItem(BOOKINGS_KEY) || 'null') || [...seedBookings],
    mentorees: [...seedMentorees],
    agendaConnected: localStorage.getItem('manzi_agenda_connected') === 'true',
    agendaProvider: localStorage.getItem('manzi_agenda_provider') || null
  }),
  actions: {
    addBooking(booking) {
      this.bookings.unshift({ id: 'bk-' + Date.now(), status: 'confirmed', ...booking })
      this.persist()
    },
    cancelBooking(id) {
      this.bookings = this.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      this.persist()
    },
    addSlot(slot) {
      this.availability.push(slot)
      this.persist()
    },
    removeSlot(index) {
      this.availability.splice(index, 1)
      this.persist()
    },
    connectAgenda(provider) {
      this.agendaConnected = true
      this.agendaProvider = provider
      localStorage.setItem('manzi_agenda_connected', 'true')
      localStorage.setItem('manzi_agenda_provider', provider)
    },
    disconnectAgenda() {
      this.agendaConnected = false
      this.agendaProvider = null
      localStorage.removeItem('manzi_agenda_connected')
      localStorage.removeItem('manzi_agenda_provider')
    },
    persist() {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(this.bookings))
      localStorage.setItem(AVAIL_KEY, JSON.stringify(this.availability))
    }
  }
})
