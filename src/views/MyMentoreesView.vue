<script setup>
import { ref } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { useToastStore } from '../stores/toast'
import Avatar from '../components/Avatar.vue'
import Icon from '../components/Icon.vue'
import SheetModal from '../components/SheetModal.vue'

const calendar = useCalendarStore()
const toast = useToastStore()

const selected = ref(null)
const reply = ref('')

const statusMeta = {
  confirmed: { label: 'Session planifiée', cls: 'tag-green' },
  pending: { label: 'En attente', cls: 'tag-amber' }
}

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
</script>

<template>
  <div class="mm">
    <div class="mm-head card">
      <span class="mm-icon"><Icon name="users" :size="26" /></span>
      <div>
        <h1>Mes mentorés</h1>
        <p class="text-soft">{{ calendar.mentorees.length }} personne(s) accompagnée(s) ce mois-ci</p>
      </div>
    </div>

    <div class="mm-list">
      <article v-for="m in calendar.mentorees" :key="m.id" class="mm-card card">
        <div class="mm-top">
          <Avatar :name="m.name" :size="48" />
          <div class="grow">
            <h3>{{ m.name }}</h3>
            <p class="text-faint">{{ m.title }}</p>
          </div>
          <span class="tag" :class="statusMeta[m.status].cls">{{ statusMeta[m.status].label }}</span>
        </div>

        <div class="goal">
          <Icon name="sparkles" :size="15" class="text-green" />
          <span>{{ m.goal }}</span>
        </div>

        <div class="mm-foot">
          <span class="next">
            <Icon name="calendar" :size="14" />
            {{ m.nextSession }}
          </span>
          <span class="grow"></span>
          <button class="btn btn-ghost btn-sm" @click="toast.show('Fonctionnalité bientôt disponible')">
            <Icon name="refresh" :size="14" /> Reporter
          </button>
          <button class="btn btn-outline btn-sm" @click="openMessage(m)">
            <Icon name="message" :size="14" /> Message
            <span v-if="m.messages" class="badge">{{ m.messages }}</span>
          </button>
        </div>
      </article>
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
.mm { padding-top: 18px; }
.mm-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  margin-bottom: 16px;
}
.mm-head h1 { font-size: 20px; }
.mm-head p { font-size: 12.5px; }
.mm-icon {
  width: 52px; height: 52px;
  border-radius: 16px;
  background: var(--green-soft);
  color: var(--green);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mm-list { display: flex; flex-direction: column; gap: 12px; }
.mm-card { padding: 16px; }
.mm-top { display: flex; align-items: flex-start; gap: 12px; }
.mm-top h3 { font-size: 15px; }
.mm-top p { font-size: 12.5px; }

.goal {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  padding: 10px 12px;
  background: var(--green-mist);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--green-strong);
}

.mm-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.next { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--ink-soft); }
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
