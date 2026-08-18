<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import Icon from './Icon.vue'

const auth = useAuthStore()

const items = computed(() => {
  const base = [
    { label: 'Découvrir', icon: 'search', to: '/app/mentors' },
    { label: 'Agenda', icon: 'calendar', to: '/app/agenda' },
    { label: 'Offres', icon: 'briefcase', to: '/app/jobs' },
    { label: 'Profil', icon: 'user', to: '/app/profile' }
  ]
  if (auth.isMentor) {
    base.splice(2, 0, { label: 'Mentorés', icon: 'users', to: '/app/mentorees' })
  }
  return base
})
</script>

<template>
  <nav class="bottom-nav">
    <div class="bottom-nav-inner">
      <RouterLink v-for="item in items" :key="item.to" class="nav-item" :to="item.to">
        <Icon :name="item.icon" :size="22" class="nav-ico" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
