<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MENTORS } from '../data/mentors'
import { BOOKING_TOPICS } from '../data/skills'
import { useCalendarStore } from '../stores/calendar'
import { useToastStore } from '../stores/toast'
import Icon from '../components/Icon.vue'

const route = useRoute()
const router = useRouter()
const calendar = useCalendarStore()
const toast = useToastStore()

const mentor = computed(() => MENTORS.find((m) => m.id === route.params.id) || MENTORS[0])
const topic = computed(() => route.query.topic || 'orientation')
const duration = computed(() => Number(route.query.duration) || 15)
const note = computed(() => route.query.note || '')

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-based
const selected = ref(null) // Date
const selectedTime = ref('')
const confirmed = ref(null)

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const WD = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const DOW_HEADERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const topicLabel = computed(() => BOOKING_TOPICS.find((t) => t.id === topic.value)?.label || 'Quick Chat')

const monthLabel = computed(() => `${MONTHS[viewMonth.value]} ${viewYear.value}`)

const isBeforeToday = (d) => {
  const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return d < today0
}

const days = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  // Lundi = 0
  const offset = (first.getDay() + 6) % 7
  const total = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const arr = []
  for (let i = 0; i < offset; i++) arr.push(null)
  for (let d = 1; d <= total; d++) arr.push(new Date(viewYear.value, viewMonth.value, d))
  while (arr.length % 7 !== 0) arr.push(null)
  return arr
})

const prevMonth = () => {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- } else viewMonth.value--
  selected.value = null; selectedTime.value = ''
}
const nextMonth = () => {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ } else viewMonth.value++
  selected.value = null; selectedTime.value = ''
}

const pick = (d) => {
  if (!d || isBeforeToday(d)) return
  selected.value = d
  selectedTime.value = ''
}

const isSelected = (d) => selected.value && d && d.toDateString() === selected.value.toDateString()

const slotTimes = computed(() => {
  if (!selected.value) return []
  const wd = WD[(selected.value.getDay() + 6) % 7]
  const slots = mentor.value.availability.filter((a) => a.startsWith(wd))
  const times = slots.map((s) => s.split(' ')[1]).filter(Boolean)
  return times.length ? times : ['09:00', '10:30', '14:00', '16:30']
})

const canConfirm = computed(() => selected.value && selectedTime.value)

const localDateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const confirmBooking = () => {
  if (!canConfirm.value) return
  const dateStr = selected.value.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  calendar.addBooking({
    mentorId: mentor.value.id,
    mentorName: mentor.value.name,
    mentorTitle: mentor.value.title,
    topic: topic.value,
    duration: duration.value,
    date: localDateKey(selected.value),
    time: selectedTime.value,
    note: note.value
  })
  confirmed.value = { dateStr, time: selectedTime.value }
}

const done = () => {
  toast.show('Réservation confirmée ✅')
  router.push('/app/agenda')
}
</script>

<template>
  <div class="sched">
    <section class="card cal-card">
      <div class="cal-head">
        <button class="icon-btn" aria-label="Mois précédent" @click="prevMonth">
          <Icon name="chevron-left" :size="18" />
        </button>
        <strong class="cal-month">{{ monthLabel }}</strong>
        <button class="icon-btn" aria-label="Mois suivant" @click="nextMonth">
          <Icon name="chevron-right" :size="18" />
        </button>
      </div>

      <div class="cal-grid">
        <span v-for="(h, i) in DOW_HEADERS" :key="'h' + i" class="dow">{{ h }}</span>
        <template v-for="(d, i) in days" :key="i">
          <button
            v-if="d"
            class="day"
            :class="{
              today: d.toDateString() === today.toDateString(),
              selected: isSelected(d),
              disabled: isBeforeToday(d)
            }"
            :disabled="isBeforeToday(d)"
            @click="pick(d)"
          >
            {{ d.getDate() }}
          </button>
          <span v-else class="day blank" />
        </template>
      </div>
    </section>

    <section class="card slot-card">
      <h2 v-if="selected">
        Créneaux du {{ selected.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }}
      </h2>
      <h2 v-else>Sélectionnez une date</h2>

      <div v-if="selected" class="times">
        <button
          v-for="t in slotTimes"
          :key="t"
          class="time"
          :class="{ on: selectedTime === t }"
          @click="selectedTime = t"
        >
          <Icon name="clock" :size="15" /> {{ t }}
        </button>
      </div>
      <p v-else class="text-faint hint">Choisissez une date disponible dans le calendrier pour voir les créneaux.</p>
    </section>

    <div class="summary card">
      <div class="row gap-12">
        <span class="tag tag-green">{{ topicLabel }}</span>
        <span class="tag tag-outline">{{ duration }} min</span>
      </div>
      <p class="mt-8 text-soft" v-if="selected && selectedTime">
        <strong>{{ mentor.name }}</strong> · {{ selected.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }} à {{ selectedTime }}
      </p>
      <button class="btn btn-primary btn-lg btn-block mt-16" :disabled="!canConfirm" @click="confirmBooking">
        Confirmer la réservation
      </button>
    </div>

    <!-- Confirmation -->
    <Teleport to="body">
      <div v-if="confirmed" class="modal-backdrop" @click.self="confirmed = null">
        <div class="modal-sheet">
          <div class="ok"><Icon name="check-circle" :size="52" /></div>
          <h3 class="text-center">Quick Chat réservé !</h3>
          <p class="text-center text-soft">
            Votre échange de {{ duration }} minutes avec <strong>{{ mentor.name }}</strong><br />
            est confirmé le {{ confirmed.dateStr }} à {{ confirmed.time }}.
          </p>
          <div class="row gap-12 mt-24">
            <button class="btn btn-outline grow" @click="confirmed = null">Fermer</button>
            <button class="btn btn-primary grow" @click="done">Voir mon agenda</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.sched { padding-top: 18px; }
.cal-card, .slot-card { padding: 18px; margin-top: 14px; }
.cal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.cal-month { font-family: var(--font-display); font-size: 15.5px; }

.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.dow { text-align: center; font-size: 11px; font-weight: 700; color: var(--ink-faint); padding: 4px 0; }
.day {
  aspect-ratio: 1;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
  background: var(--cream-soft);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
}
.day:hover:not(.disabled) { background: var(--green-mist); }
.day.today { border-color: var(--green); color: var(--green-strong); }
.day.selected { background: var(--green); color: #fff; box-shadow: 0 4px 12px rgba(30, 123, 75, 0.3); }
.day.disabled { opacity: 0.35; cursor: not-allowed; }
.day.blank { background: none; }

.slot-card h2 { font-size: 15.5px; margin-bottom: 12px; }
.hint { font-size: 13px; }
.times { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; }
.time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 8px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  background: var(--cream-soft);
  font-size: 13px;
  font-weight: 600;
}
.time:hover { border-color: var(--green); }
.time.on { background: var(--green); border-color: var(--green); color: #fff; }

.summary { margin-top: 14px; padding: 18px; }

.ok { display: flex; justify-content: center; color: var(--green); margin-bottom: 10px; }
.modal-sheet h3 { font-size: 20px; }
</style>
