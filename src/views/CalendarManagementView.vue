<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCalendarStore } from '../stores/calendar'
import { useAuthStore } from '../stores/auth'
import { BOOKING_TOPICS } from '../data/skills'
import Icon from '../components/Icon.vue'
import SheetModal from '../components/SheetModal.vue'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const calendar = useCalendarStore()
const auth = useAuthStore()
const toast = useToastStore()

const tab = ref(auth.isMentor ? 'bookings' : 'bookings')
const showAddSlot = ref(false)
const newSlot = ref({ day: 'Lundi', start: '09:00', end: '12:00' })

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

const topicLabel = (id) => BOOKING_TOPICS.find((t) => t.id === id)?.label || 'Quick Chat'

const upcoming = computed(() =>
  calendar.bookings.filter((b) => b.status === 'confirmed').slice(0, 12)
)
const past = computed(() => calendar.bookings.filter((b) => b.status !== 'confirmed'))

const addSlot = () => {
  const { day, start, end } = newSlot.value
  calendar.addSlot({ day, start, end })
  showAddSlot.value = false
  toast.show('Créneau ajouté ✅')
}
</script>

<template>
  <div class="agenda">
    <div class="agenda-tabs">
      <button class="tab" :class="{ on: tab === 'bookings' }" @click="tab = 'bookings'">
        Réservations ({{ upcoming.length }})
      </button>
      <button v-if="auth.isMentor" class="tab" :class="{ on: tab === 'avail' }" @click="tab = 'avail'">
        Disponibilités
      </button>
    </div>

    <!-- Réservations -->
    <template v-if="tab === 'bookings'">
      <div class="connect-banner card" @click="router.push('/app/agenda/connect')">
        <span class="cb-icon"><Icon name="link" :size="20" /></span>
        <div class="grow">
          <strong>Connectez votre agenda</strong>
          <p class="text-faint">Synchronisez Calendly ou Google Calendar pour gérer vos créneaux automatiquement.</p>
        </div>
        <Icon name="chevron-right" :size="18" class="text-soft" />
      </div>

      <div v-if="!upcoming.length" class="empty-state card">
        <div class="emoji">📅</div>
        <h3>Aucune réservation</h3>
        <p>Réservez un Quick Chat avec un mentor pour démarrer.</p>
        <button class="btn btn-primary mt-16" @click="router.push('/app/mentors')">Découvrir les mentors</button>
      </div>

      <div v-else class="bk-list">
        <article v-for="b in upcoming" :key="b.id" class="bk card">
          <span class="bk-date">
            <strong>{{ b.date?.slice(8, 10) || '—' }}</strong>
            <small>{{ b.date?.slice(0, 7)?.replace('-', '/') }}</small>
          </span>
          <div class="grow">
            <h3>{{ b.mentorName }}</h3>
            <p class="text-faint">{{ b.mentorTitle }}</p>
            <div class="row gap-8 mt-8 wrap">
              <span class="tag tag-green">{{ topicLabel(b.topic) }}</span>
              <span class="tag tag-outline"><Icon name="clock" :size="12" /> {{ b.time }} · {{ b.duration }} min</span>
            </div>
          </div>
        </article>
      </div>

      <div v-if="past.length" class="past-block">
        <h3 class="past-title">Historique</h3>
        <p v-for="b in past" :key="b.id" class="past-item text-faint">
          {{ b.mentorName }} · {{ b.date }} — annulé
        </p>
      </div>
    </template>

    <!-- Disponibilités (mentor) -->
    <template v-else>
      <div class="avail-head row">
        <p class="text-soft grow">Vos créneaux hebdomadaires de Quick Chat</p>
        <button class="btn btn-ghost btn-sm" @click="showAddSlot = true">
          <Icon name="plus" :size="15" /> Ajouter
        </button>
      </div>

      <div class="slot-list">
        <div v-for="(s, i) in calendar.availability" :key="i" class="slot-item card">
          <div>
            <strong>{{ s.day }}</strong>
            <p class="text-faint">{{ s.start }} – {{ s.end }}</p>
          </div>
          <span class="grow"></span>
          <button class="icon-btn" aria-label="Supprimer" @click="calendar.removeSlot(i)">
            <Icon name="x" :size="16" />
          </button>
        </div>
      </div>
      <p v-if="!calendar.availability.length" class="text-faint text-center mt-16">
        Aucun créneau défini. Ajoutez vos disponibilités.
      </p>

      <div class="connect-banner card" @click="router.push('/app/agenda/connect')">
        <span class="cb-icon"><Icon name="external" :size="20" /></span>
        <div class="grow">
          <strong>Synchroniser avec un agenda externe</strong>
          <p class="text-faint">Calendly · Cal.com · Google Calendar</p>
        </div>
        <Icon name="chevron-right" :size="18" class="text-soft" />
      </div>
    </template>

    <SheetModal :open="showAddSlot" title="Ajouter un créneau" @close="showAddSlot = false">
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
      <button class="btn btn-primary btn-block" @click="addSlot">Ajouter le créneau</button>
    </SheetModal>
  </div>
</template>

<style scoped>
.agenda { padding-top: 18px; }
.agenda-tabs {
  display: flex;
  gap: 8px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  padding: 5px;
  margin-bottom: 16px;
}
.tab {
  flex: 1;
  padding: 9px 12px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-soft);
}
.tab.on { background: var(--green); color: #fff; }

.connect-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 16px;
  margin-bottom: 16px;
  cursor: pointer;
  font-size: 14px;
}
.connect-banner p { font-size: 12.5px; margin-top: 2px; }
.cb-icon {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: var(--green-soft);
  color: var(--green);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bk-list { display: flex; flex-direction: column; gap: 12px; }
.bk { display: flex; gap: 14px; padding: 16px; }
.bk-date {
  width: 52px;
  border-radius: 14px;
  background: var(--green-soft);
  color: var(--green-strong);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  flex-shrink: 0;
}
.bk-date strong { font-size: 20px; font-family: var(--font-display); }
.bk-date small { font-size: 11px; font-weight: 600; }
.bk h3 { font-size: 15px; }

.past-block { margin-top: 22px; }
.past-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-faint); margin-bottom: 8px; }
.past-item { font-size: 13px; padding: 6px 0; }

.avail-head { margin-bottom: 12px; }
.slot-list { display: flex; flex-direction: column; gap: 10px; }
.slot-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  font-size: 14.5px;
}
.slot-item p { font-size: 12.5px; }
</style>
