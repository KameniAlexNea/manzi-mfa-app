<script setup>
defineProps({
  steps: { type: Number, default: 3 },
  current: { type: Number, required: true }
})
</script>

<template>
  <div class="steps-wrap">
    <span class="steps-label">Étape {{ current }} <template v-if="steps > 1">sur {{ steps }}</template></span>
    <div class="steps">
      <span
        v-for="n in steps"
        :key="n"
        class="step-dot"
        :class="{ active: n === current, done: n < current }"
      />
    </div>
  </div>
</template>

<style scoped>
.steps-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 18px 0 8px;
}
.steps-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--green);
}
.steps { display: flex; align-items: center; gap: 8px; }
</style>
