<script setup>
import { useRouter } from 'vue-router'
import LogoMark from '../components/LogoMark.vue'
import Icon from '../components/Icon.vue'
import AppFooter from '../components/AppFooter.vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const start = (role) => {
  auth.chooseRole(role)
  if (auth.isAuthenticated) router.push('/onboarding')
  else router.push({ name: 'login', query: { redirect: '/onboarding' } })
}
</script>

<template>
  <div class="page landing">
    <header class="landing-head container">
      <LogoMark />
      <button class="btn btn-outline btn-sm" @click="router.push('/login')">Se connecter</button>
    </header>

    <main class="container landing-main">
      <div class="steps-badge">
        <span class="step-pill">Étape 1</span>
      </div>

      <h1 class="landing-title">
        Comment souhaitez-vous utiliser<br />
        <span class="accent">Manzi-mfa</span>&nbsp;?
      </h1>
      <p class="landing-sub">
        Choisissez votre rôle au sein de notre communauté de mentorat tech pour commencer votre parcours.
      </p>

      <div class="role-cards">
        <button class="role-card" @click="start('mentee')">
          <span class="role-icon">
            <Icon name="user-search" :size="30" />
          </span>
          <h2>Je cherche un mentor</h2>
          <p>
            Accélérez votre carrière, recevez des conseils personnalisés et développez vos compétences
            tech avec un expert.
          </p>
          <span class="role-cta">
            Commencer comme apprenti
            <Icon name="chevron-right" :size="18" />
          </span>
        </button>

        <button class="role-card" @click="start('mentor')">
          <span class="role-icon">
            <Icon name="users" :size="30" />
          </span>
          <h2>Je souhaite devenir mentor</h2>
          <p>
            Partagez votre expertise, inspirez la prochaine génération de talents et donnez un sens
            nouveau à votre parcours.
          </p>
          <span class="role-cta">
            Commencer comme mentor
            <Icon name="chevron-right" :size="18" />
          </span>
        </button>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.landing-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 22px;
  padding-bottom: 8px;
}

.landing-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 26px;
  padding-bottom: 40px;
}

.steps-badge { margin-bottom: 18px; }
.step-pill {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--green-strong);
  background: var(--green-soft);
  border: 1px solid #cfe3d6;
  padding: 6px 14px;
  border-radius: 999px;
}

.landing-title {
  font-size: clamp(26px, 4.4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.landing-title .accent { color: var(--green); }

.landing-sub {
  max-width: 560px;
  margin-top: 14px;
  font-size: 16px;
  color: var(--ink-soft);
}

.role-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 860px;
  margin-top: 36px;
}

.role-card {
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 30px 26px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.role-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--green);
}
.role-card:active { transform: translateY(0); }

.role-icon {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  background: var(--green-soft);
  color: var(--green);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.role-card h2 { font-size: 20px; font-weight: 700; }
.role-card p { font-size: 14px; color: var(--ink-soft); flex: 1; }

.role-cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  color: var(--green);
  margin-top: 8px;
}
</style>
