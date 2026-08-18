<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogoMark from '../components/LogoMark.vue'
import Icon from '../components/Icon.vue'
import AppFooter from '../components/AppFooter.vue'
import { useAuthStore } from '../stores/auth'
import { useProfileStore } from '../stores/profile'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const profile = useProfileStore()
const busy = ref(null)

const providers = [
  { id: 'google', label: 'Continuer avec Google', icon: 'google' },
  { id: 'linkedin', label: 'Continuer avec LinkedIn', icon: 'linkedin' },
  { id: 'github', label: 'Continuer avec GitHub', icon: 'github' }
]

const login = async (provider) => {
  busy.value = provider
  await auth.login(provider)
  busy.value = null
  const redirect = route.query.redirect || '/app/mentors'
  router.push(String(redirect))
}
</script>

<template>
  <div class="page">
    <header class="login-head container">
      <button class="icon-btn" aria-label="Retour" @click="router.push('/')">
        <Icon name="arrow-left" :size="20" />
      </button>
    </header>

    <main class="container login-main">
      <LogoMark :size="52" />
      <h1 class="login-title">Bienvenue sur Manzi-mfa</h1>
      <p class="login-sub">
        Connectez-vous pour rejoindre la communauté de mentorat tech de Mongulu Collective.
      </p>

      <div class="providers">
        <button
          v-for="p in providers"
          :key="p.id"
          class="btn-social"
          :disabled="busy !== null"
          @click="login(p.id)"
        >
          <Icon :name="p.icon" :size="20" />
          <span v-if="busy === p.id">Connexion…</span>
          <span v-else>{{ p.label }}</span>
        </button>
      </div>

      <div class="divider">ou</div>

      <button class="btn btn-outline btn-block" @click="router.push('/onboarding')">
        <Icon name="user" :size="18" />
        Créer mon profil
      </button>

      <p class="legal">
        En continuant, vous acceptez nos <a href="#" @click.prevent>Conditions d’utilisation</a> et notre
        <a href="#" @click.prevent>Politique de confidentialité</a>.
      </p>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.login-head { padding-top: 20px; }
.login-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 30px;
  padding-bottom: 40px;
  max-width: 460px;
}
.login-title { margin-top: 22px; font-size: 26px; font-weight: 800; }
.login-sub { margin-top: 10px; font-size: 15px; color: var(--ink-soft); }

.providers {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 30px;
}
.providers .btn-social { font-size: 14.5px; }

.divider { width: 100%; margin: 26px 0; }

.btn-block { margin-top: 2px; }

.legal {
  margin-top: 24px;
  font-size: 12px;
  color: var(--ink-faint);
  line-height: 1.6;
}
</style>
