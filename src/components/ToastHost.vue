<script setup>
import { useToastStore } from '../stores/toast'
import Icon from './Icon.vue'

const toast = useToastStore()
</script>

<template>
  <div class="toast-wrap">
    <TransitionGroup name="pop-in">
      <div v-for="t in toast.items" :key="t.id" class="toast" :class="t.type === 'success' ? 'toast-success' : ''">
        <Icon :name="t.type === 'error' ? 'x' : 'check' " :size="16" />
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>
