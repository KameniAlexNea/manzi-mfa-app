<script setup>
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'

const router = useRouter()

defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
  subtitle: { type: String, default: '' }
})

const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/app/mentors')
}
</script>

<template>
  <header class="app-topbar">
    <div class="app-topbar-inner">
      <button v-if="showBack" class="icon-btn" aria-label="Retour" @click="goBack">
        <Icon name="arrow-left" :size="20" />
      </button>
      <div class="grow">
        <div class="title">{{ title }}</div>
        <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
      </div>
      <slot />
    </div>
  </header>
</template>

<style scoped>
.subtitle {
  font-size: 12px;
  color: var(--ink-faint);
  margin-top: -1px;
}
</style>
