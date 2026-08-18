<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useProfileStore } from '../stores/profile'
import { useCalendarStore } from '../stores/calendar'
import Icon from '../components/Icon.vue'
import Avatar from '../components/Avatar.vue'

const router = useRouter()
const auth = useAuthStore()
const profile = useProfileStore()
const calendar = useCalendarStore()

const initialsName = computed(() => profile.fullName || auth.displayName)

const bookingsCount = computed(() => calendar.bookings.filter((b) => b.status === 'confirmed').length)

const menu = computed(() => {
  const items = [
    { icon: 'user', label: 'Modifier mon profil', to: '/onboarding', desc: 'Vos informations, stack et bio' },
    { icon: 'calendar', label: 'Gérer mon agenda', to: '/app/agenda', desc: 'Vos créneaux et réservations' },
    { icon: 'link', label: 'Connecter un agenda', to: '/app/agenda/connect', desc: calendar.agendaConnected ? `Synchronisé avec ${calendar.agendaProvider}` : 'Calendly · Cal.com · Google' }
  ]
  if (auth.isMentor) items.push({ icon: 'users', label: 'Mes mentorés', to: '/app/mentorees', desc: 'Les personnes que vous accompagnez' })
  return items
})

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="pf">
    <section class="pf-hero card">
      <Avatar :name="initialsName" :size="72" :src="profile.profile.photo" />
      <div class="grow">
        <h1>{{ profile.fullName || 'Membre Mongulu' }}</h1>
        <p class="text-soft">{{ profile.profile.title || 'Aucun titre défini' }}</p>
        <span class="tag mt-8" :class="auth.isMentor ? 'tag-green' : 'tag-info'">
          {{ auth.isMentor ? 'Mentor' : 'Mentoré / Apprenti' }}
        </span>
      </div>
    </section>

    <section class="stats">
      <div class="stat card">
        <strong>{{ bookingsCount }}</strong>
        <span>Quick Chats</span>
      </div>
      <div class="stat card">
        <strong>{{ profile.profile.stack.length || 0 }}</strong>
        <span>Compétences</span>
      </div>
      <div class="stat card">
        <strong>{{ profile.profile.years || 0 }}</strong>
        <span>Années d’exp.</span>
      </div>
    </section>

    <section v-if="profile.profile.bio" class="card block">
      <h2>À propos</h2>
      <p>{{ profile.profile.bio }}</p>
      <div v-if="profile.profile.stack.length" class="tags mt-16">
        <span v-for="s in profile.profile.stack" :key="s" class="tag">{{ s }}</span>
      </div>
    </section>

    <section class="menu">
      <button v-for="m in menu" :key="m.label" class="menu-item card" @click="router.push(m.to)">
        <span class="mi-icon"><Icon :name="m.icon" :size="19" /></span>
        <span class="grow">
          <strong>{{ m.label }}</strong>
          <small>{{ m.desc }}</small>
        </span>
        <Icon name="chevron-right" :size="18" class="text-soft" />
      </button>
    </section>

    <section class="card signout">
      <div>
        <strong>{{ auth.user?.name || 'Membre' }}</strong>
        <p class="text-faint">{{ auth.user?.email }}</p>
      </div>
      <span class="grow"></span>
      <button class="btn btn-danger-ghost btn-sm" @click="logout">
        <Icon name="logout" :size="16" /> Déconnexion
      </button>
    </section>

    <p class="version text-faint text-center">Manzi-mfa · MVP · v0.1.0</p>
  </div>
</template>

<style scoped>
.pf { padding-top: 18px; }
.pf-hero { display: flex; align-items: center; gap: 16px; padding: 22px; }
.pf-hero h1 { font-size: 20px; font-weight: 800; }
.pf-hero p { font-size: 13px; }

.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 14px; }
.stat { text-align: center; padding: 16px 8px; }
.stat strong { display: block; font-family: var(--font-display); font-size: 22px; color: var(--green); }
.stat span { font-size: 12px; color: var(--ink-soft); }

.block { padding: 20px; margin-top: 14px; }
.block h2 { font-size: 16px; margin-bottom: 8px; }
.block p { font-size: 14px; color: var(--ink-soft); }
.tags { display: flex; flex-wrap: wrap; gap: 7px; }

.menu { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  text-align: left;
}
.mi-icon {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: var(--green-mist);
  color: var(--green);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.menu-item strong { display: block; font-size: 14px; }
.menu-item small { display: block; font-size: 12px; color: var(--ink-faint); }

.signout {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-top: 14px;
  font-size: 14px;
}
.signout p { font-size: 12px; }

.version { font-size: 11.5px; margin: 22px 0 6px; }
</style>
