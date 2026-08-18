<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '?' },
  size: { type: Number, default: 48 },
  src: { type: String, default: null },
  online: { type: Boolean, default: false }
})

const initials = computed(() => {
  const parts = String(props.name).trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0] || '?')[0].toUpperCase()
})

const palette = ['#1E7B4B', '#2F6FAE', '#A5640C', '#7A4FB0', '#C0484F', '#0F7A8C']
const hue = computed(() => {
  let h = 0
  for (const c of String(props.name)) h = (h * 31 + c.charCodeAt(0)) % 997
  return palette[h % palette.length]
})
</script>

<template>
  <span class="avatar" :style="{ width: size + 'px', height: size + 'px', fontSize: size * 0.36 + 'px', background: hue, color: '#fff' }">
    <img v-if="src" :src="src" :alt="name" :style="{ width: size + 'px', height: size + 'px' }" class="avatar-img" />
    <template v-else>{{ initials }}</template>
    <span v-if="online" class="online-dot" :style="{ width: Math.max(10, size * 0.22) + 'px', height: Math.max(10, size * 0.22) + 'px' }" />
  </span>
</template>

<style scoped>
.avatar { position: relative; }
.avatar-img { border-radius: 50%; }
.online-dot {
  position: absolute;
  right: 0;
  bottom: 1px;
  background: #2bb673;
  border: 2px solid #fff;
  border-radius: 50%;
}
</style>
