<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SidebarNav from '../components/SidebarNav.vue'
import Icon from '../components/Icon.vue'
import Avatar from '../components/Avatar.vue'
import ToastHost from '../components/ToastHost.vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const drawerOpen = ref(false)
const search = ref('')

const submitSearch = () => {
  const q = search.value.trim()
  drawerOpen.value = false
  router.push({ path: '/app/mentors', query: q ? { q } : {} })
}

const goProfile = () => {
  drawerOpen.value = false
  router.push('/app/profile')
}
</script>

<template>
  <div class="dash">
    <SidebarNav :open="drawerOpen" @close="drawerOpen = false" />

    <div class="dash-main">
      <header class="dash-topbar">
        <div class="dash-topbar-inner">
          <button class="icon-btn mobile-only" aria-label="Menu" @click="drawerOpen = true">
            <Icon name="menu" :size="20" />
          </button>

          <form class="dash-search" @submit.prevent="submitSearch">
            <Icon name="search" :size="18" class="text-soft" />
            <input v-model="search" type="search" placeholder="Rechercher…" />
          </form>

          <button class="icon-btn" aria-label="Notifications">
            <Icon name="bell" :size="19" />
            <span class="bell-dot" />
          </button>

          <button class="avatar-btn" aria-label="Mon profil" @click="goProfile">
            <Avatar :name="auth.displayName" :size="38" />
          </button>
        </div>
      </header>

      <main class="dash-content">
        <RouterView v-slot="{ Component }">
          <transition name="slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>

    <ToastHost />
  </div>
</template>

<style scoped>
.dash { min-height: 100vh; }

.dash-main {
  margin-left: 250px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dash-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(247, 243, 234, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-soft);
}
.dash-topbar-inner {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 22px;
}
.dash-search {
  flex: 1;
  max-width: 460px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 999px;
  padding: 10px 16px;
}
.dash-search input { flex: 1; border: none; outline: none; background: none; font-size: 14px; }

.icon-btn { position: relative; }
.bell-dot {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 8px;
  height: 8px;
  background: var(--danger);
  border-radius: 50%;
  border: 2px solid var(--card);
}

.avatar-btn { border-radius: 50%; display: inline-flex; }
.avatar-btn:hover { box-shadow: var(--shadow-md); }

.dash-content {
  flex: 1;
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  padding: 26px 22px 60px;
}

.mobile-only { display: none; }

@media (max-width: 860px) {
  .dash-main { margin-left: 0; }
  .mobile-only { display: inline-flex; }
  .dash-content { padding: 18px 16px 60px; }
}
</style>
