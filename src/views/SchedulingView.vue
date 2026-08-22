<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MENTORS } from '../data/mentors'
import { BOOKING_TOPICS } from '../data/skills'
import { useCalendarStore } from '../stores/calendar'
import { useToastStore } from '../stores/toast'
import Avatar from '../components/Avatar.vue'
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
const WD_BY_DAY = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'] // index = getDay() (dimanche = 0)
const DOW_HEADERS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'] // semaine commençant dimanche

const topicLabel = computed(() => BOOKING_TOPICS.find((t) => t.id === topic.value)?.label || 'Quick Chat')

const monthLabel = computed(() => `${MONTHS[viewMonth.value]} ${viewYear.value}`)

const isBeforeToday = (d) => {
  const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return d < today0
}

const isInMonth = (d) => d && d.getMonth() === viewMonth.value

const days = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  // Dimanche = 0 (début de semaine)
  const offset = first.getDay()
  const total = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const prevTotal = new Date(viewYear.value, viewMonth.value, 0).getDate()
  const arr = []
  // Jours de queue du mois précédent
  for (let i = offset - 1; i >= 0; i--) arr.push(new Date(viewYear.value, viewMonth.value - 1, prevTotal - i))
  for (let d = 1; d <= total; d++) arr.push(new Date(viewYear.value, viewMonth.value, d))
  // Jours de tête du mois suivant
  let next = 1
  while (arr.length % 7 !== 0) arr.push(new Date(viewYear.value, viewMonth.value + 1, next++))
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

const hasSlots = (d) => {
  if (!d) return false
  const wd = WD_BY_DAY[d.getDay()]
  return mentor.value.availability.some((a) => a.startsWith(wd))
}

const pick = (d) => {
  if (!d || isBeforeToday(d) || !isInMonth(d) || !hasSlots(d)) return
  selected.value = d
  selectedTime.value = ''
}

const isSelected = (d) => selected.value && d && d.toDateString() === selected.value.toDateString()

const slotTimes = computed(() => {
  if (!selected.value) return []
  const wd = WD_BY_DAY[selected.value.getDay()]
  const slots = mentor.value.availability.filter((a) => a.startsWith(wd))
  return slots.map((s) => s.split(' ')[1]).filter(Boolean)
})

const canConfirm = computed(() => selected.value && selectedTime.value)

const endOf = (t) => {
  const [h, m] = t.split(':').map(Number)
  const total = h * 60 + m + duration.value
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

const goBack = () => router.push(`/app/mentors/${mentor.value.id}/book`)

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
    <header class="sched-head">
      <h1>Book a Chat</h1>
      <p class="text-soft">
        Choisissez une date et une heure qui vous conviennent, et à <strong>{{ mentor.name }}</strong>.
      </p>
    </header>

    <!-- Étapes : Quick Details (fait) → Date & Heure (en cours) -->
    <div class="steps-2">
      <div class="step done">
        <span class="s-dot"><Icon name="check" :size="13" /></span>
        <span>Quick Details</span>
      </div>
      <div class="s-line" />
      <div class="step active">
        <span class="s-dot">2</span>
        <span>Date &amp; Heure</span>
      </div>
    </div>

    <div class="sched-grid">
      <!-- Carte mentor -->
      <aside class="col m-card card">
        <Avatar :name="mentor.name" :size="76" :online="mentor.online" />
        <h2>{{ mentor.name }}</h2>
        <p class="m-role">{{ mentor.title.toUpperCase() }}</p>
        <ul class="m-details">
          <li><Icon name="clock" :size="16" /> {{ duration }} min session</li>
          <li><Icon name="video" :size="16" /> Google Meet</li>
          <li><Icon name="globe" :size="16" /> UTC +1 (Afrique de l'Ouest)</li>
        </ul>
        <div class="m-exp">
          <p class="exp-title">Mentor Expertise</p>
          <div class="tags">
            <span v-for="s in mentor.stack.slice(0, 3)" :key="s" class="tag">{{ s }}</span>
          </div>
        </div>
      </aside>

      <!-- Calendrier -->
      <section class="col cal-col card">
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
              class="day"
              :class="{
                today: isInMonth(d) && d.toDateString() === today.toDateString(),
                selected: isSelected(d),
                muted: !isInMonth(d),
                disabled: isBeforeToday(d) || !isInMonth(d) || !hasSlots(d)
              }"
              :disabled="isBeforeToday(d) || !isInMonth(d) || !hasSlots(d)"
              @click="pick(d)"
            >
              {{ d.getDate() }}
            </button>
          </template>
        </div>

        <p class="sync-note">
          <Icon name="link" :size="14" />
          Intégration active : synchronisation avec l'agenda Google de {{ mentor.name }}. Seuls les créneaux réellement disponibles sont affichés.
        </p>
      </section>

      <!-- Créneaux -->
      <section class="col slots-col card">
        <h2 v-if="selected" class="slots-date">
          {{ selected.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase() }}
        </h2>
        <h2 v-else class="slots-date">SÉLECTIONNEZ UNE DATE</h2>
        <p class="slots-hint">Sélectionnez un créneau</p>

        <div v-if="selected" class="slot-list">
          <button v-for="t in slotTimes" :key="t" class="slot" :class="{ on: selectedTime === t }" @click="selectedTime = t">
            {{ t }} – {{ endOf(t) }}
          </button>
          <p v-if="!slotTimes.length" class="text-faint no-slot">Aucun créneau disponible ce jour.</p>
        </div>
        <p v-else class="text-faint slots-empty">Choisissez une date dans le calendrier.</p>

        <button class="btn btn-primary btn-lg btn-block" :disabled="!canConfirm" @click="confirmBooking">
          Confirmer la réservation
        </button>
        <button class="btn btn-ghost btn-block mt-8" @click="goBack">
          <Icon name="arrow-left" :size="16" /> Retour
        </button>
      </section>
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
.sched { padding-top: 8px; }

.sched-head h1 { font-size: 26px; font-weight: 800; }
.sched-head p { font-size: 14.5px; margin-top: 6px; }

/* Étapes (2) */
.steps-2 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0 20px;
}
.step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-faint);
}
.step.active { color: var(--green-strong); }
.step.done { color: var(--green-strong); }
.s-dot {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: var(--card);
  border: 2px solid var(--border);
  color: var(--ink-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
.step.active .s-dot { background: var(--green); border-color: var(--green); color: #fff; }
.step.done .s-dot { background: var(--green); border-color: var(--green); color: #fff; }
.s-line { flex: 1; max-width: 120px; height: 2px; background: var(--border); border-radius: 2px; }

/* 3 colonnes */
.sched-grid {
  display: grid;
  grid-template-columns: 250px 1fr 290px;
  gap: 18px;
  align-items: start;
}
.col { padding: 20px; }

/* Carte mentor */
.m-card { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.m-card h2 { font-size: 19px; margin-top: 6px; }
.m-role { font-size: 10.5px; letter-spacing: 0.08em; color: var(--ink-faint); font-weight: 700; }
.m-details {
  list-style: none;
  width: 100%;
  margin-top: 14px;
  border-top: 1px solid var(--border-soft);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.m-details li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-soft);
}
.m-details li svg { color: var(--green); }
.m-exp { width: 100%; margin-top: 16px; text-align: left; }
.exp-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-faint); font-weight: 700; margin-bottom: 8px; }
.m-exp .tags { display: flex; flex-wrap: wrap; gap: 6px; }

/* Calendrier */
.cal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.cal-month { font-family: var(--font-display); font-size: 15.5px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.dow { text-align: center; font-size: 11px; font-weight: 700; color: var(--ink-faint); padding: 4px 0; }
.day {
  aspect-ratio: 1;
  border-radius: 10px;
  font-size: 13px;
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
.day.muted { opacity: 0.35; background: transparent; }
.day.blank { background: none; }
.sync-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 12px;
  background: var(--green-mist);
  border-radius: 10px;
  font-size: 11.5px;
  color: var(--green-strong);
  line-height: 1.45;
}
.sync-note svg { flex-shrink: 0; margin-top: 1px; }

/* Créneaux */
.slots-col { display: flex; flex-direction: column; }
.slots-date { font-size: 13px; letter-spacing: 0.04em; }
.slots-hint { font-size: 12px; color: var(--ink-faint); margin: 4px 0 12px; }
.slot-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.slot {
  text-align: center;
  padding: 11px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--cream-soft);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  transition: all 0.12s ease;
}
.slot:hover { border-color: var(--green); }
.slot.on { background: var(--green); border-color: var(--green); color: #fff; }
.no-slot, .slots-empty { font-size: 13px; }
.slots-col .btn { margin-top: 8px; }

.ok { display: flex; justify-content: center; color: var(--green); margin-bottom: 10px; }
.modal-sheet h3 { font-size: 20px; }

@media (max-width: 1000px) {
  .sched-grid { grid-template-columns: 1fr 1fr; }
  .slots-col { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  .sched-grid { grid-template-columns: 1fr; }
}
</style>
