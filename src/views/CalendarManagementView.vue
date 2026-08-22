<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCalendarStore } from '../stores/calendar'
import { BOOKING_TOPICS } from '../data/skills'
import Icon from '../components/Icon.vue'
import SheetModal from '../components/SheetModal.vue'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const calendar = useCalendarStore()
const toast = useToastStore()

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const TIMES = []
for (let h = 8; h <= 20; h++) {
  TIMES.push(`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`)
}

const topicLabel = (id) => BOOKING_TOPICS.find((t) => t.id === id)?.label || 'Quick Chat'
const upcoming = computed(() => calendar.bookings.filter((b) => b.status === 'confirmed').slice(0, 6))

// --- Connexion agenda
const connected = computed(() => calendar.agendaConnected)
const providerLabel = computed(() => {
  const p = calendar.agendaProvider
  return { calendly: 'calendly.com/@user', calcom: 'cal.com/@user', google: 'google.calendar@user.com' }[p] || 'agenda connecté'
})
const syncNow = () => {
  toast.show('Synchronisation en cours…')
  setTimeout(() => toast.show('Agenda synchronisé ✅'), 1200)
}
const disconnect = () => {
  calendar.disconnectAgenda()
  toast.show('Agenda déconnecté')
}

// --- Paramètres de synchronisation
const calendars = ref([
  { name: 'Personal', dot: '#2f6fae', checked: true },
  { name: 'Family Events', dot: '#f2a93b', checked: false },
  { name: 'Work (Company Corp)', dot: '#1e7b4b', checked: true },
  { name: 'Old Archive', dot: '#8a978f', checked: false }
])
const targetCalendar = ref('Work (Company Corp)')

// --- Règles de disponibilité (périodes par jour)
const dayPeriods = (day) => calendar.availability.filter((s) => s.day === day)
const addPeriod = (day) => {
  calendar.addSlot({ day, start: '09:00', end: '12:00' })
  toast.show(`Créneau ajouté pour ${day}`)
}
const removePeriod = (day, index) => {
  const period = dayPeriods(day)[index]
  if (!period) return
  const global = calendar.availability.indexOf(period)
  if (global >= 0) calendar.availability.splice(global, 1)
  calendar.persist()
}

// --- Créneau personnalisé
const showAddSlot = ref(false)
const newSlot = ref({ day: 'Lundi', start: '09:00', end: '12:00' })
const addSlot = () => {
  calendar.addSlot({ ...newSlot.value })
  showAddSlot.value = false
  toast.show('Créneau personnalisé ajouté ✅')
}

// --- Vérification & sauvegarde
const runTest = () => toast.show('Aucun chevauchement détecté ✅')
const saveChanges = () => {
  calendar.persist()
  toast.show('Modifications enregistrées ✅')
}
</script>

<template>
  <div class="cm">
    <header class="cm-head">
      <h1>Calendar Management</h1>
      <p class="text-soft">
        Gérez la connexion de votre agenda, vos synchronisations et vos règles de disponibilité.
      </p>
    </header>

    <!-- Connection Status + Sync Settings (2 colonnes) -->
    <div class="cm-cols">
    <section class="cm-card card">
      <div class="cm-card-head">
        <h2>Connection Status</h2>
        <span v-if="connected" class="pill ok"><span class="dot" /> Connected</span>
        <span v-else class="pill off"><span class="dot" /> Not connected</span>
      </div>

      <div v-if="connected" class="conn-body">
        <div class="conn-account">
          <span class="acc-ico"><Icon name="google" :size="18" /></span>
          <div>
            <strong>{{ providerLabel }}</strong>
            <p class="text-faint">Last synced: 2 minutes ago</p>
          </div>
        </div>
        <p class="conn-text">
          Votre Google Agenda est bien intégré. Manzi-mfa vérifie automatiquement les conflits sur vos calendriers sélectionnés.
        </p>
        <div class="row gap-12">
          <button class="btn btn-primary" @click="syncNow"><Icon name="refresh" :size="16" /> Sync Now</button>
          <button class="btn btn-danger-ghost" @click="disconnect">Disconnect</button>
        </div>
      </div>

      <div v-else class="conn-body">
        <p class="conn-text">
          Connectez votre agenda pour synchroniser vos disponibilités et éviter les conflits de réservation.
        </p>
        <button class="btn btn-primary" @click="router.push('/app/agenda/connect')">
          <Icon name="link" :size="16" /> Connecter un agenda
        </button>
      </div>
    </section>

    <!-- Sync Settings -->
    <section class="cm-card card">
      <div class="cm-card-head">
        <h2>Sync Settings</h2>
      </div>
      <p class="cm-label">Check for conflicts in:</p>
      <div class="cal-rows">
        <label v-for="c in calendars" :key="c.name" class="cal-row">
          <span class="c-dot" :style="{ background: c.dot }" />
          <span class="grow">{{ c.name }}</span>
          <input v-model="c.checked" type="checkbox" class="toggle" />
        </label>
      </div>
      <p class="cm-label mt-16">Add new bookings to:</p>
      <select v-model="targetCalendar" class="select">
        <option v-for="c in calendars" :key="c.name" :value="c.name">{{ c.name }}</option>
      </select>
      <p class="hint text-faint mt-8">
        Les nouveaux mentorés recevront automatiquement une invitation sur ce calendrier.
      </p>
    </section>
    </div>

    <!-- Availability Rules -->
    <section class="cm-card card">
      <div class="cm-card-head">
        <h2>Availability Rules</h2>
        <button class="btn btn-ghost btn-sm" @click="showAddSlot = true">
          <Icon name="plus" :size="15" /> Add Custom Override
        </button>
      </div>
      <p class="cm-label">
        Définissez, pour chaque jour, les créneaux pendant lesquels vous êtes disponible pour les sessions de mentorat.
      </p>
      <div class="day-rows">
        <div v-for="d in DAYS" :key="d" class="day-row">
          <div class="day-main">
            <span class="day-name">{{ d }}</span>
            <span class="day-state" :class="dayPeriods(d).length ? 'on' : ''">
              {{ dayPeriods(d).length ? 'Active' : 'Unavailable' }}
            </span>
          </div>
          <div class="periods">
            <div v-for="(p, i) in dayPeriods(d)" :key="i" class="period">
              <select v-model="p.start" class="select period-select" @change="calendar.persist()">
                <option v-for="t in TIMES" :key="t" :value="t">{{ t }}</option>
              </select>
              <span class="period-sep">–</span>
              <select v-model="p.end" class="select period-select" @change="calendar.persist()">
                <option v-for="t in TIMES" :key="t" :value="t">{{ t }}</option>
              </select>
              <button class="icon-btn" aria-label="Supprimer le créneau" @click="removePeriod(d, i)">
                <Icon name="x" :size="15" />
              </button>
            </div>
            <button class="add-period" @click="addPeriod(d)">
              <Icon name="plus" :size="14" /> Ajouter un créneau
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Sessions à venir -->
    <section v-if="upcoming.length" class="cm-card card">
      <div class="cm-card-head">
        <h2>Sessions à venir</h2>
        <span class="tag tag-green">{{ upcoming.length }}</span>
      </div>
      <div class="bk-list">
        <div v-for="b in upcoming" :key="b.id" class="bk">
          <span class="bk-date">
            <strong>{{ b.date?.slice(8, 10) }}</strong>
            <small>{{ b.date?.slice(5, 7) }}/{{ b.date?.slice(0, 4) }}</small>
          </span>
          <div class="grow">
            <strong>{{ b.mentorName }}</strong>
            <p class="text-faint">{{ topicLabel(b.topic) }} · {{ b.time }} · {{ b.duration }} min</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Calendar Health Check -->
    <section class="health">
      <div>
        <strong>Calendar Health Check</strong>
        <p class="text-soft">
          All systems are operational. No overlapping events detected for the upcoming sessions.
        </p>
      </div>
      <div class="row gap-12">
        <button class="btn btn-outline btn-sm" @click="runTest">Test</button>
        <button class="btn btn-primary btn-sm" @click="saveChanges">Save Changes</button>
      </div>
    </section>

    <SheetModal :open="showAddSlot" title="Ajouter un créneau personnalisé" @close="showAddSlot = false">
      <div class="field">
        <label>Jour</label>
        <select v-model="newSlot.day" class="select">
          <option v-for="d in DAYS" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div class="input-group">
        <div class="field">
          <label>Début</label>
          <select v-model="newSlot.start" class="select">
            <option v-for="t in TIMES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="field">
          <label>Fin</label>
          <select v-model="newSlot.end" class="select">
            <option v-for="t in TIMES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary btn-block" @click="addSlot">Ajouter</button>
    </SheetModal>
  </div>
</template>

<style scoped>
.cm { padding-top: 8px; }
.cm-head h1 { font-size: 24px; font-weight: 800; }
.cm-head p { font-size: 14px; margin-top: 6px; }

.cm-card { padding: 20px; margin-top: 16px; }

.cm-cols {
  display: grid;
  grid-template-columns: minmax(0, 2fr) 3fr;
  gap: 16px;
  margin-top: 16px;
  align-items: start;
}
.cm-cols .cm-card { margin-top: 0; }
@media (max-width: 720px) {
  .cm-cols { grid-template-columns: 1fr; }
}

.cm-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.cm-card-head h2 { font-size: 16.5px; white-space: nowrap; }

/* Connection */
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
}
.pill .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.pill.ok { background: var(--green-mist); color: var(--green-strong); }
.pill.off { background: var(--border-soft); color: var(--ink-soft); }

.conn-account { display: flex; align-items: center; gap: 12px; min-width: 0; }
.conn-account > div { min-width: 0; }
.conn-account strong { display: block; overflow-wrap: anywhere; }
.acc-ico {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.conn-text { font-size: 13.5px; color: var(--ink-soft); margin: 12px 0 16px; max-width: 560px; }
.cm-card .row { flex-wrap: wrap; }

/* Sync settings */
.cm-label { font-size: 13px; font-weight: 600; color: var(--ink-soft); margin-bottom: 10px; }
.cal-rows { display: flex; flex-direction: column; }
.cal-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 4px;
  border-bottom: 1px solid var(--border-soft);
  font-size: 14px;
  cursor: pointer;
}
.cal-row:last-child { border-bottom: none; }
.c-dot { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; }
.toggle { accent-color: var(--green); width: 20px; height: 20px; }

/* Availability rules */
.day-rows { display: flex; flex-direction: column; margin-top: 4px; }
.day-row {
  padding: 12px 4px;
  border-bottom: 1px solid var(--border-soft);
}
.day-row:last-child { border-bottom: none; }
.day-main { display: flex; align-items: center; gap: 12px; }
.day-name { flex: 1; font-size: 14px; font-weight: 600; }
.day-state { font-size: 12px; font-weight: 700; color: var(--ink-faint); }
.day-state.on { color: var(--green-strong); }
.periods {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  padding-left: 2px;
}
.period { display: flex; align-items: center; gap: 8px; }
.period-select {
  width: 96px;
  flex: 0 0 auto;
  padding: 7px 10px;
  font-size: 13px;
  border-radius: 10px;
}
.period-sep { color: var(--ink-faint); font-weight: 700; }
.add-period {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  align-self: flex-start;
  margin-top: 2px;
  padding: 6px 11px;
  border-radius: 999px;
  background: var(--green-mist);
  color: var(--green-strong);
  font-size: 12.5px;
  font-weight: 600;
}
.add-period:hover { background: var(--green-soft); }

/* Sessions à venir */
.bk-list { display: flex; flex-direction: column; gap: 10px; }
.bk { display: flex; align-items: center; gap: 12px; }
.bk-date {
  width: 48px;
  border-radius: 12px;
  background: var(--green-soft);
  color: var(--green-strong);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 4px;
  flex-shrink: 0;
}
.bk-date strong { font-size: 17px; font-family: var(--font-display); }
.bk-date small { font-size: 10px; font-weight: 600; }
.bk p { font-size: 12.5px; }

/* Health check */
.health {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  padding: 18px 20px;
  flex-wrap: wrap;
  background: var(--green-mist);
  border: 1px solid #cfe3d6;
  border-radius: var(--radius-lg);
}
.health strong { font-size: 14.5px; }
.health p { font-size: 12.5px; margin-top: 3px; max-width: 460px; }
</style>
