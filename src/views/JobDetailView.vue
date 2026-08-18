<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useToastStore } from '../stores/toast'
import Icon from '../components/Icon.vue'

const route = useRoute()
const router = useRouter()
const jobs = useJobsStore()
const toast = useToastStore()

const job = computed(() => jobs.byId(route.params.id))
const saved = computed(() => job.value && jobs.isSaved(job.value.id))
const applied = ref(false)

const typeClass = {
  Stage: 'tag-info',
  Alternance: 'tag-amber',
  CDI: 'tag-green',
  CDD: 'tag-outline',
  Freelance: 'tag-danger'
}[job.value?.type] || 'tag-outline'

const apply = () => {
  applied.value = true
  toast.show('Candidature envoyée à ' + (job.value?.company || 'l’entreprise') + ' 🎉')
}

const share = () => {
  navigator.clipboard?.writeText(window.location.href).catch(() => {})
  toast.show('Lien copié dans le presse-papiers')
}
</script>

<template>
  <div v-if="job" class="jd">
    <section class="jd-head card">
      <span class="jd-logo">{{ job.logo }}</span>
      <div class="grow">
        <h1>{{ job.title }}</h1>
        <p class="jd-company">{{ job.company }}</p>
        <div class="row gap-8 mt-8 wrap">
          <span class="tag" :class="typeClass">{{ job.type }}</span>
          <span class="tag tag-outline"><Icon name="map-pin" :size="12" /> {{ job.location }}</span>
          <span class="tag tag-amber"><Icon name="check-circle" :size="12" /> {{ job.salary }}</span>
        </div>
      </div>
      <button class="icon-btn" :class="{ saved }" aria-label="Sauvegarder" @click="jobs.toggleSaved(job.id)">
        <Icon name="heart" :size="19" />
      </button>
    </section>

    <section class="card block">
      <h2>Description</h2>
      <p>{{ job.description }}</p>
    </section>

    <section class="card block">
      <h2>Missions</h2>
      <ul class="check-list">
        <li v-for="(m, i) in job.missions" :key="i">
          <Icon name="check" :size="15" class="text-green" /> {{ m }}
        </li>
      </ul>
    </section>

    <section class="card block">
      <h2>Profil recherché</h2>
      <ul class="check-list">
        <li v-for="(p, i) in job.profile" :key="i">
          <Icon name="check" :size="15" class="text-green" /> {{ p }}
        </li>
      </ul>
    </section>

    <section class="card block">
      <h2>Stack</h2>
      <div class="tags">
        <span v-for="s in job.stack" :key="s" class="tag">{{ s }}</span>
      </div>
    </section>

    <div class="jd-foot">
      <button class="btn btn-outline" @click="share"><Icon name="external" :size="18" /> Partager</button>
      <button class="btn btn-primary grow" @click="apply">
        <Icon :name="applied ? 'check' : 'send'" :size="18" />
        {{ applied ? 'Candidature envoyée' : 'Postuler' }}
      </button>
    </div>
    <p class="text-faint text-center contact-hint">
      Candidatures par e-mail : <strong>{{ job.contact }}</strong>
    </p>
  </div>
  <div v-else class="empty-state card">
    <div class="emoji">💼</div>
    <h3>Offre introuvable</h3>
    <button class="btn btn-outline mt-16" @click="router.push('/app/jobs')">Retour au job board</button>
  </div>
</template>

<style scoped>
.jd { padding-top: 18px; }
.jd-head { display: flex; gap: 14px; padding: 20px; align-items: flex-start; }
.jd-logo {
  width: 54px; height: 54px;
  border-radius: 16px;
  background: var(--green-soft);
  color: var(--green-deep);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.jd-head h1 { font-size: 19px; font-weight: 800; line-height: 1.25; }
.jd-company { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }
.jd-head .icon-btn.saved { color: var(--danger); border-color: var(--danger-soft); background: var(--danger-soft); }

.block { padding: 20px; margin-top: 14px; }
.block h2 { font-size: 16px; margin-bottom: 10px; }
.block p { font-size: 14px; color: var(--ink-soft); }
.check-list { list-style: none; display: flex; flex-direction: column; gap: 9px; }
.check-list li { display: flex; gap: 8px; font-size: 14px; color: var(--ink-soft); align-items: flex-start; }
.check-list li svg { margin-top: 3px; flex-shrink: 0; }
.tags { display: flex; flex-wrap: wrap; gap: 7px; }

.jd-foot { display: flex; gap: 12px; margin: 20px 0 6px; }
.contact-hint { font-size: 12px; }
</style>
