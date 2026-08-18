<script setup>
import { useRouter } from 'vue-router'
import LogoMark from '../components/LogoMark.vue'
import Icon from '../components/Icon.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()

const steps = [
  {
    icon: 'user',
    title: '1 · Créez votre profil',
    desc: 'Indiquez votre métier, votre stack technique et vos objectifs. Deux minutes suffisent.'
  },
  {
    icon: 'search',
    title: '2 · Trouvez le bon mentor',
    desc: 'Explorez les profils de mentors expérimentés, filtrez par stack et par disponibilité.'
  },
  {
    icon: 'calendar',
    title: '3 · Réservez un Quick Chat',
    desc: 'Un échange de 15 à 30 minutes pour un conseil, une review de CV ou une préparation d’entretien.'
  },
  {
    icon: 'briefcase',
    title: '4 · Accédez au job board',
    desc: 'Postulez aux offres partagées par le collectif et les entreprises partenaires.'
  }
]

const perks = [
  { icon: 'clock', title: '15 minutes par mois', desc: 'Un engagement minimal pour les mentors, un vrai accélérateur pour les mentorés.' },
  { icon: 'shield', title: 'Mentors vérifiés', desc: 'Chaque mentor est issu du réseau Mongulu ou validé par le collectif.' },
  { icon: 'thumb', title: 'Communauté bienveillante', desc: 'Une entraide réelle, sans jugement, portée par des professionnels engagés.' }
]
</script>

<template>
  <div class="page">
    <header class="hiw-head container">
      <LogoMark :size="38" />
      <button class="btn btn-outline btn-sm" @click="router.push('/')">Retour à l’accueil</button>
    </header>

    <main class="container hiw-main">
      <span class="step-pill">Le programme</span>
      <h1 class="hiw-title">Comment ça marche ?</h1>
      <p class="hiw-sub">
        Manzi-mfa met en relation les talents tech juniors avec des mentors expérimentés du collectif
        Mongulu, pour un échange d’1h qui change une carrière.
      </p>

      <div class="steps-list">
        <div v-for="s in steps" :key="s.title" class="hiw-step card">
          <span class="hiw-icon"><Icon :name="s.icon" :size="24" /></span>
          <div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>

      <div class="perks">
        <div v-for="p in perks" :key="p.title" class="perk card">
          <Icon :name="p.icon" :size="22" class="perk-ico" />
          <h4>{{ p.title }}</h4>
          <p>{{ p.desc }}</p>
        </div>
      </div>

      <div class="cta card">
        <h2>Prêt·e à commencer votre parcours ?</h2>
        <p>Rejoignez la communauté de mentorat tech de Mongulu Collective.</p>
        <div class="row gap-12 wrap" style="justify-content: center">
          <button class="btn btn-primary" @click="router.push('/')">Je cherche un mentor</button>
          <button class="btn btn-outline" @click="router.push('/')">Devenir mentor</button>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.hiw-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
}
.hiw-main {
  max-width: 720px;
  text-align: center;
  padding-top: 30px;
  padding-bottom: 50px;
}
.step-pill {
  display: inline-flex;
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
  margin-bottom: 18px;
}
.hiw-title { font-size: 32px; font-weight: 800; }
.hiw-sub { margin: 12px auto 30px; max-width: 560px; color: var(--ink-soft); font-size: 15.5px; }

.steps-list { display: flex; flex-direction: column; gap: 14px; text-align: left; }
.hiw-step { display: flex; gap: 16px; padding: 20px; align-items: flex-start; }
.hiw-icon {
  width: 48px; height: 48px;
  border-radius: 14px;
  background: var(--green-soft);
  color: var(--green);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.hiw-step h3 { font-size: 16.5px; }
.hiw-step p { font-size: 14px; color: var(--ink-soft); margin-top: 3px; }

.perks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-top: 26px;
}
.perk { padding: 20px 16px; text-align: left; }
.perk-ico { color: var(--green); }
.perk h4 { margin-top: 10px; font-size: 15px; }
.perk p { font-size: 13px; color: var(--ink-soft); margin-top: 5px; }

.cta {
  margin-top: 30px;
  padding: 32px 24px;
  text-align: center;
  background: linear-gradient(160deg, var(--green) 0%, var(--green-strong) 100%);
  border: none;
  color: #fff;
}
.cta h2 { color: #fff; font-size: 22px; }
.cta p { color: rgba(255, 255, 255, 0.85); margin: 8px 0 20px; }
.cta .btn-primary { background: #fff; color: var(--green-strong); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18); }
.cta .btn-outline { background: transparent; border-color: rgba(255, 255, 255, 0.6); color: #fff; }
</style>
