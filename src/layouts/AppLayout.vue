<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTopBar from '../components/AppTopBar.vue'
import BottomNav from '../components/BottomNav.vue'
import ToastHost from '../components/ToastHost.vue'

const route = useRoute()
const title = computed(() => route.meta?.title || 'Manzi-mfa')

// Pages qui veulent un topbar minimal / sans retour
const noBack = ['/app/mentors', '/app/agenda', '/app/jobs', '/app/profile', '/app/mentorees']
const showBack = computed(() => !noBack.includes(route.path))
</script>

<template>
  <div class="app-shell">
    <AppTopBar :title="title" :show-back="showBack" />
    <main class="app-content">
      <RouterView v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <BottomNav />
    <ToastHost />
  </div>
</template>
