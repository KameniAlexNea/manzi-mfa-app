<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import LogoMark from '../components/LogoMark.vue'
import Icon from '../components/Icon.vue'
import StepIndicator from '../components/StepIndicator.vue'
import { useAuthStore } from '../stores/auth'
import { useProfileStore } from '../stores/profile'
import { SKILLS, EXPERIENCE_LEVELS } from '../data/skills'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const auth = useAuthStore()
const profile = useProfileStore()
const toast = useToastStore()

const step = computed(() => profile.step)
const fileInput = ref(null)

const errors = ref({})

const validateStep = (n) => {
  const e = {}
  if (n === 1) {
    if (!profile.profile.firstName.trim()) e.firstName = 'Prénom requis'
    if (!profile.profile.lastName.trim()) e.lastName = 'Nom requis'
    if (!profile.profile.title.trim()) e.title = 'Métier / titre requis'
    if (!profile.profile.years) e.years = 'Sélectionnez votre expérience'
  }
  if (n === 2) {
    if (!profile.profile.stack.length) e.stack = 'Sélectionnez au moins une compétence'
  }
  if (n === 3) {
    if (profile.profile.bio.trim().length < 20) e.bio = 'Ajoutez une courte présentation (20 caractères min.)'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

const next = () => {
  if (!validateStep(step.value)) return
  if (step.value < 3) profile.setStep(step.value + 1)
  else finish()
}

const back = () => {
  if (step.value > 1) profile.setStep(step.value - 1)
  else router.push('/')
}

const finish = () => {
  if (!validateStep(3)) return
  toast.show('Profil créé avec succès 🎉')
  setTimeout(() => router.push('/app/mentors'), 400)
}

const pickPhoto = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 4 * 1024 * 1024) {
    toast.show('Image trop lourde (4 Mo max)', 'error')
    return
  }
  const reader = new FileReader()
  reader.onload = () => profile.update({ photo: reader.result })
  reader.readAsDataURL(file)
}

const removePhoto = () => profile.update({ photo: null })
</script>

<template>
  <div class="page ob-page">
    <header class="ob-head container">
      <LogoMark :size="38" />
      <button v-if="auth.isAuthenticated" class="btn btn-ghost btn-sm" @click="router.push('/app/mentors')">
        Passer
      </button>
    </header>

    <main class="container ob-main">
      <StepIndicator :steps="3" :current="step" />

      <!-- ÉTAPE 1 : identité -->
      <section v-if="step === 1" class="ob-card card">
        <h1 class="ob-title">Créez votre profil</h1>
        <p class="ob-sub">Ces informations nous aident à vous mettre en relation avec les bonnes personnes.</p>

        <div class="input-group">
          <div class="field">
            <label for="firstName">Prénom</label>
            <input id="firstName" v-model="profile.profile.firstName" class="input" placeholder="Ex : Awa" />
            <span v-if="errors.firstName" class="err">{{ errors.firstName }}</span>
          </div>
          <div class="field">
            <label for="lastName">Nom</label>
            <input id="lastName" v-model="profile.profile.lastName" class="input" placeholder="Ex : Ndiaye" />
            <span v-if="errors.lastName" class="err">{{ errors.lastName }}</span>
          </div>
        </div>

        <div class="field">
          <label for="title">Métier / Titre actuel</label>
          <input id="title" v-model="profile.profile.title" class="input" placeholder="Ex : Développeuse en reconversion" />
          <span v-if="errors.title" class="err">{{ errors.title }}</span>
        </div>

        <div class="input-group">
          <div class="field">
            <label for="years">Années d’expérience</label>
            <select id="years" v-model="profile.profile.years" class="select">
              <option value="" disabled>Sélectionner…</option>
              <option v-for="n in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="n" :value="String(n)">
                {{ n === 0 ? 'Moins d’un an' : `${n} an${n > 1 ? 's' : ''}` }}
              </option>
            </select>
            <span v-if="errors.years" class="err">{{ errors.years }}</span>
          </div>
          <div class="field">
            <label for="school">École / Entreprise</label>
            <input id="school" v-model="profile.profile.school" class="input" placeholder="Ex : Le Wagon" />
          </div>
        </div>

        <div class="ob-actions">
          <button class="btn btn-outline" @click="back">
            <Icon name="chevron-left" :size="18" /> Retour
          </button>
          <button class="btn btn-primary grow" @click="next">
            Continuer <Icon name="chevron-right" :size="18" />
          </button>
        </div>
      </section>

      <!-- ÉTAPE 2 : stack technique -->
      <section v-else-if="step === 2" class="ob-card card">
        <h1 class="ob-title">Votre stack technique</h1>
        <p class="ob-sub">Sélectionnez les technologies et domaines que vous pratiquez ou souhaitez développer.</p>

        <div class="skill-grid">
          <button
            v-for="skill in SKILLS"
            :key="skill"
            class="skill-pill"
            :class="{ on: profile.profile.stack.includes(skill) }"
            @click="profile.toggleSkill(skill)"
          >
            <Icon :name="profile.profile.stack.includes(skill) ? 'check' : 'plus'" :size="14" />
            {{ skill }}
          </button>
        </div>
        <p v-if="errors.stack" class="err">{{ errors.stack }}</p>
        <p class="counter text-faint">{{ profile.profile.stack.length }} sélectionné(s)</p>

        <div class="field mt-24">
          <label for="linkedin">LinkedIn <span class="hint">(optionnel)</span></label>
          <input id="linkedin" v-model="profile.profile.linkedin" class="input" placeholder="linkedin.com/in/…" />
        </div>

        <div class="ob-actions">
          <button class="btn btn-outline" @click="back">
            <Icon name="chevron-left" :size="18" /> Retour
          </button>
          <button class="btn btn-primary grow" @click="next">
            Continuer <Icon name="chevron-right" :size="18" />
          </button>
        </div>
      </section>

      <!-- ÉTAPE 3 : photo + bio -->
      <section v-else class="ob-card card">
        <h1 class="ob-title">Finalisez votre profil</h1>
        <p class="ob-sub">Ajoutez une photo et présentez-vous à la communauté.</p>

        <div class="photo-row">
          <div class="photo-preview" @click="fileInput && fileInput.click()">
            <img v-if="profile.profile.photo" :src="profile.profile.photo" alt="Photo de profil" />
            <template v-else>
              <Icon name="upload" :size="26" />
              <span>Ajouter une photo</span>
            </template>
          </div>
          <div class="photo-actions">
            <button class="btn btn-outline btn-sm" @click="fileInput && fileInput.click()">
              <Icon name="upload" :size="15" /> Choisir
            </button>
            <button v-if="profile.profile.photo" class="btn btn-danger-ghost btn-sm" @click="removePhoto">
              <Icon name="x" :size="15" /> Retirer
            </button>
            <input ref="fileInput" type="file" accept="image/*" hidden @change="pickPhoto" />
          </div>
        </div>

        <div class="field">
          <label for="level">Niveau actuel</label>
          <select id="level" v-model="profile.profile.level" class="select">
            <option v-for="l in EXPERIENCE_LEVELS" :key="l" :value="l">{{ l }}</option>
          </select>
        </div>

        <div class="field">
          <label for="bio">Présentez-vous</label>
          <textarea
            id="bio"
            v-model="profile.profile.bio"
            class="textarea"
            placeholder="Parlez de votre parcours, vos objectifs, ce que vous cherchez sur Manzi-mfa…"
          ></textarea>
          <span v-if="errors.bio" class="err">{{ errors.bio }}</span>
        </div>

        <div class="ob-actions">
          <button class="btn btn-outline" @click="back">
            <Icon name="chevron-left" :size="18" /> Retour
          </button>
          <button class="btn btn-primary grow" @click="next">
            Valider mon profil <Icon name="check" :size="18" />
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.ob-page { background: var(--cream); }
.ob-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  padding-bottom: 4px;
}
.ob-main { max-width: 640px; padding-bottom: 50px; }

.ob-card {
  padding: 28px 26px;
  margin-top: 22px;
}
.ob-title { font-size: 23px; font-weight: 800; }
.ob-sub { font-size: 14px; color: var(--ink-soft); margin: 8px 0 24px; }

.err { color: var(--danger); font-size: 12.5px; font-weight: 500; }

.skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding: 2px;
}
.skill-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 13px;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: var(--cream-soft);
  color: var(--ink-soft);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.12s ease;
}
.skill-pill:hover { border-color: var(--green); }
.skill-pill.on {
  background: var(--green);
  border-color: var(--green);
  color: #fff;
}
.counter { margin-top: 12px; font-size: 12.5px; }

.photo-row { display: flex; align-items: center; gap: 18px; margin-bottom: 22px; }
.photo-preview {
  width: 92px; height: 92px;
  border-radius: 50%;
  border: 2px dashed var(--border);
  background: var(--green-mist);
  color: var(--green-strong);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
}
.photo-preview img { width: 100%; height: 100%; object-fit: cover; }
.photo-actions { display: flex; flex-direction: column; gap: 8px; }

.ob-actions {
  display: flex;
  gap: 12px;
  margin-top: 26px;
}
</style>
