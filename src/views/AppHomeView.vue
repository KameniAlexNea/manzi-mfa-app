<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useProfileStore } from '../stores/profile'
import { useCalendarStore } from '../stores/calendar'
import { BOOKING_TOPICS } from '../data/skills'
import Avatar from '../components/Avatar.vue'
import Icon from '../components/Icon.vue'

const router = useRouter()
const auth = useAuthStore()
const profile = useProfileStore()
const calendar = useCalendarStore()

const upcoming = computed(() => calendar.bookings.filter((b) => b.status === 'confirmed').slice(0, 3))
const topicLabel = (id) => BOOKING_TOPICS.find((t) => t.id === id)?.label || 'Quick Chat'
const initials = computed(() => profile.fullName || auth.displayName)

const stats = computed(() => {
  const arr = [
    { icon: 'clock', label: 'Quick Chats', value: calendar.bookings.filter((b) => b.status === 'confirmed').length }
  ]
  if (auth.isMentor) {
    arr.push({ icon: 'users', label: 'Mentorés', value: calendar.mentorees.filter((m) => m.status === 'active').length })
  } else {
    arr.push({ icon: 'book', label: 'Compétences', value: profile.profile.stack.length || 0 })
  }
  arr.push({ icon: 'briefcase', label: 'Offres', value: '6+' })
  return arr
})

const quickActions = computed(() => {
  const actions = [
    { icon: 'search', label: 'Trouver un mentor', to: '/app/mentors', desc: 'Découvrez des experts' }
  ]
  if (auth.isMentor) actions.unshift({ icon: 'users', label: 'Mes Mentorés', to: '/app/mentorees', desc: 'Suivez vos accompagnements' })
  actions.push(
    { icon: 'calendar', label: 'Mon agenda', to: '/app/agenda', desc: 'Réservations & dispo' },
    { icon: 'briefcase', label: 'Job Board', to: '/app/jobs', desc: 'Offres communautaires' }
  )
  return actions
})
</script>

<template>
  <div class="ah">
    <section class="ah-welcome card">
      <div class="grow">
        <h1>Bonjour, {{ profile.firstName || auth.displayName }} 👋</h1>
        <p class="text-soft">
          {{ auth.isMentor ? 'Prêt·e à accompagner votre communauté aujourd’hui ?' : 'Prêt·e à faire avancer votre carrière aujourd’hui ?' }}
        </p>
      </div>
      <Avatar :name="initials" :size="56" :src="profile.profile.photo" />
    </section>

    <section class="ah-stats">
      <div v-for="s in stats" :key="s.label" class="stat card">
        <Icon :name="s.icon" :size="20" class="text-green" />
        <strong>{{ s.value }}</strong>
        <span>{{ s.label }}</span>
      </div>
    </section>

    <section class="ah-actions">
      <button v-for="a in quickActions" :key="a.label" class="qa card" @click="router.push(a.to)">
        <span class="qa-ico"><Icon :name="a.icon" :size="20" /></span>
        <span class="grow">
          <strong>{{ a.label }}</strong>
          <small>{{ a.desc }}</small>
        </span>
        <Icon name="chevron-right" :size="17" class="text-soft" />
      </button>
    </section>

    <section class="card ah-upcoming">
      <div class="row">
        <h2>Mes prochains Quick Chats</h2>
        <span class="grow"></span>
        <button class="see-all" @click="router.push('/app/agenda')">Tout voir <Icon name="chevron-right" :size="15" /></button>
      </div>

      <div v-if="upcoming.length" class="bk-list">
        <div v-for="b in upcoming" :key="b.id" class="bk">
          <Avatar :name="b.mentorName" :size="42" />
          <div class="grow">
            <strong>{{ b.mentorName }}</strong>
            <p class="text-faint">{{ topicLabel(b.topic) }} · {{ b.duration }} min</p>
          </div>
          <span class="bk-when">
            {{ b.date?.slice(8, 10) }}/{{ b.date?.slice(5, 7) }} · {{ b.time }}
          </span>
        </div>
      </div>
      <div v-else class="empty-soft">
        <p class="text-soft">Aucun Quick Chat planifié.</p>
        <button class="btn btn-primary btn-sm" @click="router.push('/app/mentors')">Trouver un mentor</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ah-welcome {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
}
.ah-welcome h1 { font-size: 22px; font-weight: 800; }
.ah-welcome p { font-size: 14px; margin-top: 4px; }

.ah-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
  margin-top: 16px;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 18px;
}
.stat strong { font-family: var(--font-display); font-size: 26px; }
.stat span { font-size: 12.5px; color: var(--ink-soft); }

.ah-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
.qa {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 16px;
  text-align: left;
}
.qa-ico {
  width: 42px; height: 42px;
  border-radius: 12px;
  background: var(--green-mist);
  color: var(--green);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.qa strong { display: block; font-size: 14.5px; }
.qa small { font-size: 12px; color: var(--ink-faint); }

.ah-upcoming { padding: 20px; margin-top: 16px; }
.ah-upcoming h2 { font-size: 16px; }
.see-all {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 13px;
  font-weight: 700;
  color: var(--green);
}
.bk-list { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
.bk { display: flex; align-items: center; gap: 12px; }
.bk p { font-size: 12.5px; }
.bk-when {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--green-strong);
  background: var(--green-mist);
  padding: 6px 11px;
  border-radius: 999px;
  white-space: nowrap;
}
.empty-soft { text-align: center; padding: 22px 0 6px; }
</style>
