<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { JOB_TYPES } from '../data/skills'
import JobCard from '../components/JobCard.vue'
import Icon from '../components/Icon.vue'

const router = useRouter()
const jobs = useJobsStore()

const query = ref('')
const type = ref('Tous')

const types = ['Tous', ...JOB_TYPES]

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return jobs.jobs.filter((j) => {
    if (type.value !== 'Tous' && j.type !== type.value) return false
    if (q) {
      const hay = `${j.title} ${j.company} ${j.stack.join(' ')}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
})
</script>

<template>
  <div class="jb">
    <div class="jb-hero">
      <div>
        <h1>Job Board</h1>
        <p class="text-soft">Offres partagées par le collectif et les entreprises partenaires.</p>
      </div>
      <button class="btn btn-primary btn-sm" @click="router.push('/app/jobs/new')">
        <Icon name="plus" :size="15" /> Publier
      </button>
    </div>

    <div class="search-bar mt-16">
      <Icon name="search" :size="19" class="text-soft" />
      <input v-model="query" type="search" placeholder="Titre, entreprise, stack…" />
    </div>

    <div class="chips mt-16">
      <button
        v-for="t in types"
        :key="t"
        class="chip"
        :class="{ 'chip-active': type === t }"
        @click="type = t"
      >
        {{ t }}
      </button>
    </div>

    <div v-if="!results.length" class="empty-state card">
      <div class="emoji">💼</div>
      <h3>Aucune offre</h3>
      <p>Il n’y a pas encore d’offre correspondant à ces critères.</p>
    </div>

    <div v-else class="jb-list mt-16">
      <JobCard v-for="j in results" :key="j.id" :job="j" />
    </div>

    <div class="publish-cta card">
      <Icon name="briefcase" :size="22" class="text-green" />
      <div class="grow">
        <strong>Une offre à partager ?</strong>
        <p class="text-faint">Entreprises partenaires et membres du collectif, publiez vos opportunités.</p>
      </div>
      <button class="btn btn-ghost btn-sm" @click="router.push('/app/jobs/new')">Publier</button>
    </div>
  </div>
</template>

<style scoped>
.jb { padding-top: 18px; }
.jb-hero { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.jb-hero h1 { font-size: 22px; font-weight: 800; }
.jb-hero p { font-size: 13px; }
.chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.chips::-webkit-scrollbar { display: none; }
.chip { flex-shrink: 0; }

.jb-list { display: flex; flex-direction: column; gap: 12px; }

.publish-cta {
  margin-top: 20px;
  padding: 15px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}
.publish-cta p { font-size: 12.5px; margin-top: 2px; }
</style>
