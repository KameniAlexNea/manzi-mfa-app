<script setup>
import { ref } from 'vue'
import Avatar from '../components/Avatar.vue'
import Icon from '../components/Icon.vue'

const chats = ref([
  {
    id: 'c1',
    name: 'Amara Diallo',
    role: 'Développeuse Frontend Senior',
    preview: 'Avec plaisir ! Je peux revoir votre CV avant jeudi.',
    time: '10:24',
    unread: 2,
    online: true
  },
  {
    id: 'c2',
    name: 'Lucas Martin',
    role: 'Étudiant, Dev Frontend',
    preview: 'Merci pour le retour sur mon portfolio 🙏',
    time: 'Hier',
    unread: 1
  },
  {
    id: 'c3',
    name: 'Moussa Traoré',
    role: 'Architecte Solutions',
    preview: 'Parfait, on se retrouve lundi 16h.',
    time: 'Hier'
  },
  {
    id: 'c4',
    name: 'Sarah Nkosi',
    role: 'Engineering Manager',
    preview: 'Très bonne session aujourd’hui, à bientôt !',
    time: '12 août'
  },
  {
    id: 'c5',
    name: 'Thomas Dubois',
    role: 'Reconversion Data',
    preview: 'Je vous envoie ma nouvelle version du projet.',
    time: '11 août'
  }
])

const activeId = ref('c1')
const draft = ref('')
const sent = ref([])

const send = () => {
  if (!draft.value.trim()) return
  sent.value.push({ text: draft.value.trim(), time: 'Maintenant' })
  draft.value = ''
}

const active = (id) => chats.value.find((c) => c.id === id)
</script>

<template>
  <div class="msgs">
    <header class="msgs-head">
      <h1>Messages</h1>
      <p class="text-soft">Vos échanges avec mentors et mentorés.</p>
    </header>

    <div class="msgs-body">
      <!-- Liste des conversations -->
      <aside class="msgs-list card">
        <button
          v-for="c in chats"
          :key="c.id"
          class="conv"
          :class="{ on: activeId === c.id }"
          @click="activeId = c.id"
        >
          <Avatar :name="c.name" :size="42" :online="c.online" />
          <div class="conv-main">
            <div class="row gap-8">
              <strong>{{ c.name }}</strong>
              <span class="grow"></span>
              <span class="conv-time">{{ c.time }}</span>
            </div>
            <p class="conv-preview">{{ c.preview }}</p>
          </div>
          <span v-if="c.unread" class="conv-badge">{{ c.unread }}</span>
        </button>
      </aside>

      <!-- Fil de discussion -->
      <section class="msgs-thread card">
        <div class="thread-head">
          <Avatar :name="active(activeId).name" :size="40" :online="active(activeId).online" />
          <div>
            <strong>{{ active(activeId).name }}</strong>
            <p class="text-faint">{{ active(activeId).role }}</p>
          </div>
        </div>

        <div class="thread-body">
          <div class="bubble in">
            Bonjour, j’ai bien reçu votre demande. Quelles sont vos disponibilités cette semaine ?
          </div>
          <div v-for="(s, i) in sent" :key="i" class="bubble out">
            {{ s.text }}
            <span class="bubble-time">{{ s.time }}</span>
          </div>
          <div v-if="!sent.length" class="empty-soft">
            <p class="text-faint">Démarrez la conversation…</p>
          </div>
        </div>

        <form class="thread-input" @submit.prevent="send">
          <input v-model="draft" placeholder="Écrivez votre message…" />
          <button class="btn btn-primary" type="submit" :disabled="!draft.trim()">
            <Icon name="send" :size="16" />
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.msgs-head h1 { font-size: 24px; font-weight: 800; }
.msgs-head p { font-size: 14px; margin-top: 6px; }

.msgs-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
  margin-top: 20px;
  min-height: 520px;
}

.msgs-list { padding: 10px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: 70vh; }
.conv {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 10px;
  border-radius: 12px;
  text-align: left;
}
.conv:hover { background: var(--green-mist); }
.conv.on { background: var(--green-mist); }
.conv-main { flex: 1; min-width: 0; }
.conv strong { font-size: 13.5px; display: block; }
.conv-preview {
  font-size: 12px;
  color: var(--ink-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}
.conv-time { font-size: 11px; color: var(--ink-faint); }
.conv-badge {
  background: var(--green);
  color: #fff;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.msgs-thread { display: flex; flex-direction: column; min-height: 520px; }
.thread-head {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-soft);
  font-size: 14px;
}
.thread-head p { font-size: 12px; }

.thread-body {
  flex: 1;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 60vh;
}
.bubble {
  max-width: 75%;
  padding: 11px 14px;
  border-radius: 16px;
  font-size: 13.5px;
  line-height: 1.5;
}
.bubble.in { background: var(--green-mist); color: var(--ink); align-self: flex-start; border-bottom-left-radius: 5px; }
.bubble.out { background: var(--green); color: #fff; align-self: flex-end; border-bottom-right-radius: 5px; }
.bubble-time { display: block; font-size: 10.5px; opacity: 0.75; margin-top: 4px; }
.empty-soft { text-align: center; padding: 30px 0; }

.thread-input {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid var(--border-soft);
}
.thread-input input {
  flex: 1;
  border: 1.5px solid var(--border);
  border-radius: 999px;
  padding: 11px 16px;
  outline: none;
  background: var(--cream-soft);
}
.thread-input input:focus { border-color: var(--green); }

@media (max-width: 860px) {
  .msgs-body { grid-template-columns: 1fr; }
  .msgs-list { max-height: none; }
}
</style>
