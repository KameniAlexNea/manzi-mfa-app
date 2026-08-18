<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MENTORS } from '../data/mentors'
import MentorCard from '../components/MentorCard.vue'
import Icon from '../components/Icon.vue'
import SheetModal from '../components/SheetModal.vue'
import { EXPERIENCE_LEVELS } from '../data/skills'

const router = useRouter()

const query = ref('')
const openFilter = ref(false)
const filters = ref({
  stacks: [],
  levels: [],
  onlineOnly: false
})

const STACKS = ['React', 'Vue.js', 'Node.js', 'Python', 'Java', 'Flutter', 'AWS', 'Data', 'DevOps', 'Product', 'Architecture']

const allStacks = computed(() => {
  const set = new Set()
  MENTORS.forEach((m) => m.stack.forEach((s) => set.add(s)))
  return [...set].sort()
})

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return MENTORS.filter((m) => {
    if (q) {
      const hay = `${m.name} ${m.title} ${m.company} ${m.stack.join(' ')}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (filters.value.onlineOnly && !m.online) return false
    if (filters.value.stacks.length) {
      const has = filters.value.stacks.some((s) => m.stack.some((ms) => ms.toLowerCase().includes(s.toLowerCase())))
      if (!has) return false
    }
    return true
  })
})

const toggleStackFilter = (s) => {
  const i = filters.value.stacks.indexOf(s)
  if (i >= 0) filters.value.stacks.splice(i, 1)
  else filters.value.stacks.push(s)
}
const clearFilters = () => {
  filters.value = { stacks: [], levels: [], onlineOnly: false }
}
</script>

<template>
  <div class="find">
    <div class="search-bar">
      <Icon name="search" :size="19" class="text-soft" />
      <input v-model="query" type="search" placeholder="Rechercher un mentor, une stack…" />
      <button class="icon-btn" aria-label="Filtres" :class="{ active: filters.stacks.length || filters.onlineOnly }" @click="openFilter = true">
        <Icon name="filter" :size="18" />
      </button>
    </div>

    <p class="result-count text-faint">
      {{ results.length }} mentor{{ results.length > 1 ? 's' : '' }} disponible{{ results.length > 1 ? 's' : '' }}
    </p>

    <div v-if="!results.length" class="empty-state card">
      <div class="emoji">🔍</div>
      <h3>Aucun mentor trouvé</h3>
      <p>Essayez d’élargir vos critères ou de modifier votre recherche.</p>
      <button class="btn btn-outline mt-16" @click="clearFilters">Réinitialiser les filtres</button>
    </div>

    <div v-else class="mentor-list">
      <MentorCard v-for="m in results" :key="m.id" :mentor="m" />
    </div>

    <div class="discover-cta card">
      <Icon name="sparkles" :size="20" />
      <div>
        <strong>Pas sûr de votre choix ?</strong>
        <p class="text-faint">Consultez les profils et réservez un premier Quick Chat gratuit.</p>
      </div>
      <button class="btn btn-ghost btn-sm" @click="router.push('/how-it-works')">En savoir plus</button>
    </div>

    <SheetModal :open="openFilter" title="Filtrer les mentors" @close="openFilter = false">
      <p class="f-label">Stack / domaine</p>
      <div class="chip-row">
        <button
          v-for="s in allStacks"
          :key="s"
          class="chip"
          :class="{ 'chip-active': filters.stacks.includes(s) }"
          @click="toggleStackFilter(s)"
        >
          {{ s }}
        </button>
      </div>

      <label class="toggle-row">
        <span>
          <strong>Mentors en ligne</strong>
          <small>Afficher uniquement les mentors actuellement disponibles</small>
        </span>
        <input v-model="filters.onlineOnly" type="checkbox" class="toggle" />
      </label>

      <div class="row gap-12 mt-24">
        <button class="btn btn-outline grow" @click="clearFilters">Réinitialiser</button>
        <button class="btn btn-primary grow" @click="openFilter = false">Voir {{ results.length }} mentor(s)</button>
      </div>
    </SheetModal>
  </div>
</template>

<style scoped>
.find { padding-top: 18px; }
.result-count { font-size: 12.5px; margin: 12px 2px 14px; }
.icon-btn.active { border-color: var(--green); color: var(--green); background: var(--green-mist); }

.mentor-list { display: flex; flex-direction: column; gap: 14px; }

.discover-cta {
  margin-top: 20px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--green);
  font-size: 14px;
}
.discover-cta p { font-size: 12.5px; margin-top: 2px; }

.f-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
  margin-bottom: 10px;
}
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; }

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 22px;
  padding: 14px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}
.toggle-row span { display: flex; flex-direction: column; }
.toggle-row small { color: var(--ink-faint); font-size: 12px; }
.toggle { accent-color: var(--green); width: 22px; height: 22px; }
</style>
