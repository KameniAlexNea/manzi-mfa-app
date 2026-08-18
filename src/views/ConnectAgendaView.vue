<script setup>
import { useRouter } from 'vue-router'
import { useCalendarStore } from '../stores/calendar'
import { useToastStore } from '../stores/toast'
import Icon from '../components/Icon.vue'

const router = useRouter()
const calendar = useCalendarStore()
const toast = useToastStore()

const providers = [
  {
    id: 'calendly',
    name: 'Calendly',
    desc: 'L’outil de prise de rendez-vous le plus utilisé. Vos créneaux se synchronisent en temps réel.',
    tag: 'Recommandé'
  },
  {
    id: 'calcom',
    name: 'Cal.com',
    desc: 'Alternative open-source et personnalisable à souhait.',
    tag: 'Open source'
  },
  {
    id: 'google',
    name: 'Google Calendar',
    desc: 'Synchronisez directement votre agenda Google existant.',
    tag: 'Gratuit'
  }
]

const connect = (p) => {
  calendar.connectAgenda(p.id)
  toast.show(`Agenda ${p.name} connecté ✅`)
  router.push('/app/agenda')
}
</script>

<template>
  <div class="ca">
    <div v-if="calendar.agendaConnected" class="connected card">
      <Icon name="check-circle" :size="40" class="green" />
      <h2>Agenda connecté</h2>
      <p class="text-soft">
        Votre agenda <strong>{{ calendar.agendaProvider }}</strong> est synchronisé. Vos disponibilités
        sont automatiquement mises à jour.
      </p>
      <button class="btn btn-outline" @click="calendar.disconnectAgenda(); toast.show('Agenda déconnecté')">
        Déconnecter
      </button>
    </div>

    <template v-else>
      <div class="ca-hero card">
        <span class="ca-icon"><Icon name="calendar" :size="30" /></span>
        <h1>Connectez votre agenda</h1>
        <p>
          Évitez les allers-retours et les créneaux fantômes. Vos disponibilités sont synchronisées
          automatiquement avec votre outil de réservation.
        </p>
      </div>

      <div class="prov">
        <button v-for="p in providers" :key="p.id" class="prov-card card" @click="connect(p)">
          <span class="prov-logo">{{ p.id.slice(0, 2).toUpperCase() }}</span>
          <div class="grow">
            <strong>{{ p.name }}</strong>
            <p class="text-faint">{{ p.desc }}</p>
          </div>
          <span class="tag" :class="p.tag === 'Recommandé' ? 'tag-green' : 'tag-outline'">{{ p.tag }}</span>
          <Icon name="chevron-right" :size="18" class="text-soft" />
        </button>
      </div>

      <p class="note text-faint text-center">
        🔒 Vos données restent privées. Manzi-mfa ne partage jamais votre agenda.
      </p>
    </template>
  </div>
</template>

<style scoped>
.ca { padding-top: 18px; }
.ca-hero {
  text-align: center;
  padding: 30px 22px;
  background: linear-gradient(160deg, var(--green) 0%, var(--green-strong) 100%);
  color: #fff;
  border: none;
}
.ca-hero h1 { color: #fff; font-size: 22px; margin-top: 12px; }
.ca-hero p { color: rgba(255, 255, 255, 0.85); font-size: 14px; max-width: 420px; margin: 10px auto 0; }
.ca-icon {
  width: 60px; height: 60px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.prov { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.prov-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.prov-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.prov-logo {
  width: 46px; height: 46px;
  border-radius: 14px;
  background: var(--green-soft);
  color: var(--green-strong);
  font-family: var(--font-display);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.prov-card p { font-size: 12.5px; margin-top: 2px; }
.note { font-size: 12.5px; margin-top: 20px; }

.connected { text-align: center; padding: 34px 24px; }
.connected .green { color: var(--green); }
.connected h2 { margin: 12px 0 8px; font-size: 20px; }
.connected p { font-size: 14px; max-width: 360px; margin: 0 auto 20px; }
</style>
