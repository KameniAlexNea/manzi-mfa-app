<script setup>
import Icon from './Icon.vue'

defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, default: '' }
})
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
      <div class="modal-sheet">
        <div class="sheet-head">
          <h3>{{ title }}</h3>
          <button class="icon-btn" aria-label="Fermer" @click="emit('close')">
            <Icon name="x" :size="18" />
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.sheet-head h3 { font-size: 18px; }
</style>
