<script setup>
defineProps({
  size: { type: Number, default: 40 },
  withText: { type: Boolean, default: true },
  light: { type: Boolean, default: false }
})
</script>

<template>
  <div class="logo" :class="{ 'logo-light': light }">
    <span class="logo-mark" :style="{ width: size + 'px', height: size + 'px' }">
      <svg :width="size * 0.62" :height="size * 0.62" viewBox="0 0 64 64" fill="none">
        <g fill="currentColor">
          <circle cx="24" cy="27" r="6.5" />
          <circle cx="40" cy="27" r="6.5" />
          <path d="M32 23c-4.5 0-8 3.2-8 7.5V34c0 4.5 3.6 8 8 8s8-3.5 8-8v-3.5c0-4.3-3.5-7.5-8-7.5z" opacity="0.95" />
          <circle cx="24" cy="46" r="5" />
          <circle cx="40" cy="46" r="5" />
          <path d="M32 41.5c-3.4 0-6 2.3-6 5.4 0 3.2 2.7 5.1 6 5.1s6-1.9 6-5.1c0-3.1-2.6-5.4-6-5.4z" opacity="0.6" />
        </g>
      </svg>
    </span>
    <span v-if="withText" class="logo-text">Manzi-mfa</span>
  </div>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.logo-mark {
  border-radius: 14px;
  background: var(--green);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(30, 123, 75, 0.3);
}
.logo-text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.logo-light .logo-text { color: #fff; }
</style>
