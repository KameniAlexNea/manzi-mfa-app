<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCalendarStore } from '../stores/calendar'
import { useToastStore } from '../stores/toast'
import Avatar from '../components/Avatar.vue'
import Icon from '../components/Icon.vue'
import SheetModal from '../components/SheetModal.vue'

const router = useRouter()
const calendar = useCalendarStore()
const toast = useToastStore()

const filter = ref('Tous')
const selected = ref(null)
const reply = ref('')

const FILTERS = ['Tous', 'Actifs', 'En pause', 'Terminés']

const statusMeta = {
  active: { label: 'Actif', cls: 'tag-green' },
  paused: { label: 'En pause', cls: 'tag-amber' },
  done: { label: 'Terminé', cls: 'tag-outline' }
}

const statusOf = (m) => statusMeta[m.status] || { label: '', cls: 'tag-outline' }

const filtered = computed(() => {
  if (filter.value === 'Tous') return calendar.mentorees
  const map = { Actifs: 'active', 'En pause': 'paused', Terminés: 'done' }
  return calendar.mentorees.filter((m) => m.status === map[filter.value])
})

const counts = computed(() => ({
  Tous: calendar.mentorees.length,
  Actifs: calendar.mentorees.filter((m) => m.status === 'active').length,
  'En pause': calendar.mentorees.filter((m) => m.status === 'paused').length,
  Terminés: calendar.mentorees.filter((m) => m.status === 'done').length
}))

const openMessage = (m) => {
  selected.value = m
  reply.value = ''
}

const sendReply = () => {
  if (!reply.value.trim()) return
  const target = calendar.mentorees.find((m) => m.id === selected.value.id)
  if (target) target.messages += 1
  toast.show('Message envoyé 💬')
  selected.value = null
}

const planify = (m) => {
  toast.show(`Nouvelle session planifiée avec ${m.name} ✅`)
  router.push('/app/agenda')
}

const relaunch = (m) => {
  calendar.setMentoreeStatus(m.id, 'active')
  toast.show(`${m.name} est de nouveau actif 🎉`)
}
</script>

<template>
  <div class="mm">
    <div class="mm-top">
      <header class="mm-head">
        <h1>Mes Mentorés</h1>
        <p class="text-soft">
          Gérez les relations avec votre communauté, suivez leurs progrès et planifiez vos prochaines sessions.
        </p>
      </header>

      <!-- Filtres par statut (à droite du titre) -->
      <div class="mm-filters">
        <button
          v-for="f in FILTERS"
          :key="f"
          class="chip"
          :class="{ 'chip-active': filter === f }"
          @click="filter = f"
        >
          {{ f }} <span class="cnt">{{ counts[f] }}</span>
        </button>
      </div>
    </div>

    <div class="mm-list">
      <article v-for="m in filtered" :key="m.id" class="mm-card card">
        <div class="mm-top">
          <Avatar :name="m.name" :size="50" />
          <div class="grow">
            <div class="row gap-8">
              <h3>{{ m.name }}</h3>
              <span class="tag" :class="statusOf(m).cls">{{ statusOf(m).label }}</span>
            </div>
            <p class="text-soft role">{{ m.role }}</p>
          </div>
        </div>

        <div class="mm-last">
          <Icon name="calendar" :size="14" />
          Dernière session : {{ m.lastSession }}
        </div>

        <div class="mm-foot">
          <span class="grow"></span>
          <!-- Actif : Message + Planifier -->
          <template v-if="m.status === 'active'">
            <button class="btn btn-ghost btn-sm" @click="openMessage(m)">
              <Icon name="message" :size="14" /> Message
              <span v-if="m.messages" class="badge">{{ m.messages }}</span>
            </button>
            <button class="btn btn-primary btn-sm" @click="planify(m)">
              <Icon name="calendar" :size="14" /> Planifier
            </button>
          </template>
          <!-- En pause : Relancer -->
          <button v-else-if="m.status === 'paused'" class="btn btn-primary btn-sm" @click="relaunch(m)">
            <Icon name="refresh" :size="14" /> Relancer
          </button>
          <!-- Terminé : Reprendre -->
          <button v-else class="btn btn-outline btn-sm" @click="relaunch(m)">
            <Icon name="refresh" :size="14" /> Reprendre
          </button>
        </div>
      </article>

      <div v-if="!filtered.length" class="empty-state card">
        <div class="emoji">👥</div>
        <h3>Aucun mentoré dans cette catégorie</h3>
      </div>
    </div>

    <SheetModal :open="!!selected" :title="`Message à ${selected?.name || ''}`" @close="selected = null">
      <textarea v-model="reply" class="textarea" placeholder="Écrivez votre message…"></textarea>
      <button class="btn btn-primary btn-block mt-16" @click="sendReply">
        <Icon name="send" :size="16" /> Envoyer
      </button>
    </SheetModal>
  </div>
</template>

<style scoped>
.mm-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.mm-head h1 { font-size: 24px; font-weight: 800; }
.mm-head p { font-size: 14px; margin-top: 6px; max-width: 560px; }

.mm-filters { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 6px; }
.cnt {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  padding: 1px 7px;
  font-size: 11.5px;
}
.chip-active .cnt { background: rgba(255, 255, 255, 0.25); }

.mm-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 24px;
}
.mm-card { padding: 18px; }
.mm-top { display: flex; align-items: flex-start; gap: 12px; }
.mm-top h3 { font-size: 15.5px; }
.role { font-size: 13px; margin-top: 3px; }

.mm-last {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 13px;
  padding: 9px 13px;
  background: var(--green-mist);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--green-strong);
}

.mm-foot { display: flex; align-items: center; gap: 8px; margin-top: 14px; }
.badge {
  background: var(--green);
  color: #fff;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  min-width: 17px;
  height: 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
</style>
