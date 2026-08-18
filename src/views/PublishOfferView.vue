<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { JOB_TYPES } from '../data/skills'
import { useToastStore } from '../stores/toast'
import Icon from '../components/Icon.vue'

const router = useRouter()
const jobs = useJobsStore()
const toast = useToastStore()

const form = reactive({
  title: '',
  company: '',
  type: 'Stage',
  location: '',
  salary: '',
  stackText: '',
  description: '',
  contact: '',
  remote: false
})

const errors = ref({})
const published = ref(false)

const stackArray = () =>
  form.stackText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

const submit = () => {
  const e = {}
  if (!form.title.trim()) e.title = 'Titre requis'
  if (!form.company.trim()) e.company = 'Entreprise requise'
  if (!form.location.trim()) e.location = 'Localisation requise'
  if (form.description.trim().length < 30) e.description = 'Description trop courte (30 caractères min.)'
  if (!form.contact.trim()) e.contact = 'Contact requis'
  errors.value = e
  if (Object.keys(e).length) return

  const job = jobs.publish({
    title: form.title.trim(),
    company: form.company.trim(),
    type: form.type,
    location: form.location.trim(),
    salary: form.salary.trim() || 'À négocier',
    stack: stackArray(),
    description: form.description.trim(),
    contact: form.contact.trim(),
    remote: form.remote
  })
  published.value = true
  toast.show('Offre publiée 🎉')
  setTimeout(() => router.push(`/app/jobs/${job.id}`), 500)
}
</script>

<template>
  <div class="po">
    <div v-if="published" class="ok-screen card">
      <Icon name="check-circle" :size="56" class="green" />
      <h1>Offre publiée !</h1>
      <p class="text-soft">Votre offre a été ajoutée au job board communautaire.</p>
    </div>

    <form v-else class="po-form" @submit.prevent="submit">
      <div class="field">
        <label for="title">Titre de l’offre *</label>
        <input id="title" v-model="form.title" class="input" placeholder="Ex : Développeur·se Frontend (Vue.js)" />
        <span v-if="errors.title" class="err">{{ errors.title }}</span>
      </div>

      <div class="input-group">
        <div class="field">
          <label for="company">Entreprise *</label>
          <input id="company" v-model="form.company" class="input" placeholder="Ex : TechCorp" />
          <span v-if="errors.company" class="err">{{ errors.company }}</span>
        </div>
        <div class="field">
          <label for="type">Type de contrat</label>
          <select id="type" v-model="form.type" class="select">
            <option v-for="t in JOB_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <div class="field">
          <label for="location">Localisation *</label>
          <input id="location" v-model="form.location" class="input" placeholder="Ex : Paris · Remote" />
          <span v-if="errors.location" class="err">{{ errors.location }}</span>
        </div>
        <div class="field">
          <label for="salary">Rémunération</label>
          <input id="salary" v-model="form.salary" class="input" placeholder="Ex : 36 K€ / an" />
        </div>
      </div>

      <div class="field">
        <label for="stack">Stack technique <span class="hint">(séparée par des virgules)</span></label>
        <input id="stack" v-model="form.stackText" class="input" placeholder="Ex : Vue.js, TypeScript, SCSS" />
      </div>

      <div class="field">
        <label for="desc">Description *</label>
        <textarea id="desc" v-model="form.description" class="textarea" placeholder="Présentez le poste, l’équipe, les missions…"></textarea>
        <span v-if="errors.description" class="err">{{ errors.description }}</span>
      </div>

      <div class="field">
        <label for="contact">Contact de candidature * <span class="hint">(e-mail)</span></label>
        <input id="contact" v-model="form.contact" type="email" class="input" placeholder="recrutement@entreprise.com" />
        <span v-if="errors.contact" class="err">{{ errors.contact }}</span>
      </div>

      <label class="toggle-row">
        <span>
          <strong>Télétravail</strong>
          <small>Cette offre est ouverte au travail à distance</small>
        </span>
        <input v-model="form.remote" type="checkbox" class="toggle" />
      </label>

      <div class="row gap-12 mt-24">
        <button type="button" class="btn btn-outline" @click="router.push('/app/jobs')">Annuler</button>
        <button type="submit" class="btn btn-primary grow">Publier l’offre <Icon name="send" :size="17" /></button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.po { padding-top: 18px; }
.po-form { display: flex; flex-direction: column; }
.err { color: var(--danger); font-size: 12.5px; }

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}
.toggle-row span { display: flex; flex-direction: column; }
.toggle-row small { color: var(--ink-faint); font-size: 12px; }
.toggle { accent-color: var(--green); width: 22px; height: 22px; }

.ok-screen { text-align: center; padding: 44px 24px; }
.ok-screen .green { color: var(--green); }
.ok-screen h1 { margin: 14px 0 6px; }
</style>
