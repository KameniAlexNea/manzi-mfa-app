<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LogoMark from './LogoMark.vue'
import Icon from './Icon.vue'
import Avatar from './Avatar.vue'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const router = useRouter()
const auth = useAuthStore()

const menu = computed(() => {
  const items = [
    { label: 'Dashboard', icon: 'home', to: '/app/home' },
    { label: 'Schedule', icon: 'calendar', to: '/app/agenda' }
  ]
  if (auth.isMentor) items.push({ label: 'Mentorés', icon: 'users', to: '/app/mentorees' })
  items.push(
    { label: 'Jobs', icon: 'briefcase', to: '/app/jobs' },
    { label: 'Messages', icon: 'message', to: '/app/messages' },
    { label: 'Ressources', icon: 'book', to: '/how-it-works' }
  )
  return items
})

const nav = (to) => {
  emit('close')
  router.push(to)
}

const goMain = () => {
  emit('close')
  router.push('/')
}

const logout = () => {
  emit('close')
  auth.logout()
  router.push('/')
}

const year = new Date().getFullYear()
</script>

<template>
  <div class="sidebar-wrap" :class="{ open }">
    <!-- overlay mobile -->
    <div v-if="open" class="overlay" @click="emit('close')" />

    <aside class="sidebar">
      <button class="side-brand" title="Retour au site" @click="goMain">
        <LogoMark :size="34" />
        <p class="side-tag">Professional Growth</p>
      </button>

      <nav class="side-menu">
        <button
          v-for="m in menu"
          :key="m.label"
          class="side-item"
          :class="{ active: $route.path === m.to }"
          @click="nav(m.to)"
        >
          <Icon :name="m.icon" :size="19" />
          <span>{{ m.label }}</span>
        </button>

        <div class="side-spacer" />

        <button class="side-item side-site" @click="goMain">
          <Icon name="globe" :size="19" />
          <span>Retour au site</span>
        </button>
        <button class="side-item" :class="{ active: $route.path === '/app/profile' }" @click="nav('/app/profile')">
          <Icon name="sliders" :size="19" />
          <span>Settings</span>
        </button>
        <button class="side-item" @click="nav('/how-it-works')">
          <Icon name="info" :size="19" />
          <span>Help Center</span>
        </button>
        <button class="side-item side-logout" @click="logout">
          <Icon name="logout" :size="19" />
          <span>Logout</span>
        </button>
      </nav>

      <div class="side-foot">
        <p>© {{ year }} Mongulu Collective. All rights reserved.</p>
        <div class="side-links">
          <a href="#" @click.prevent>About Us</a>
          <a href="#" @click.prevent>Privacy Policy</a>
          <a href="#" @click.prevent>Terms of Service</a>
          <a href="#" @click.prevent>Contact</a>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.sidebar-wrap { display: contents; }
.overlay {
  position: fixed;
  inset: 0;
  z-index: 48;
  background: rgba(20, 32, 27, 0.5);
}

.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 49;
  background: var(--cream-soft);
  border-right: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  padding: 22px 16px;
}

.side-brand {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  padding: 0 10px 20px;
  cursor: pointer;
  border-radius: 12px;
}
.side-brand:hover { background: var(--green-mist); }
.side-site { color: var(--green-strong); }
.side-tag { font-size: 12px; color: var(--ink-faint); margin-top: 4px; }

.side-menu { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.side-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-soft);
  text-align: left;
  transition: all 0.12s ease;
}
.side-item:hover { background: var(--green-mist); color: var(--green-strong); }
.side-item.active { background: var(--green); color: #fff; box-shadow: 0 4px 12px rgba(30, 123, 75, 0.28); }

.side-book { margin-top: 14px; }
.side-spacer { flex: 1; }
.side-logout { color: var(--danger); }
.side-logout:hover { background: var(--danger-soft); color: var(--danger); }

.side-foot { padding: 14px 10px 0; border-top: 1px solid var(--border-soft); }
.side-foot p { font-size: 11px; color: var(--ink-faint); }
.side-links { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 8px; }
.side-links a { font-size: 11.5px; color: var(--ink-faint); }
.side-links a:hover { color: var(--green); }

/* mobile: drawer off-canvas */
@media (min-width: 861px) {
  .overlay { display: none; }
}
@media (max-width: 860px) {
  .sidebar { transform: translateX(-100%); transition: transform 0.24s ease; box-shadow: var(--shadow-lg); }
  .sidebar-wrap.open .sidebar { transform: translateX(0); }
}
</style>
