<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MENTORS } from '../data/mentors'
import { BOOKING_TOPICS } from '../data/skills'
import Avatar from '../components/Avatar.vue'
import Icon from '../components/Icon.vue'

const route = useRoute()
const router = useRouter()

const mentor = computed(() => MENTORS.find((m) => m.id === route.params.id) || MENTORS[0])

const topic = ref('')
const duration = ref(15)
const note = ref('')
const error = ref('')

const durations = [15, 30]

const next = () => {
  if (!topic.value) {
    error.value = 'Choisissez le sujet de votre échange.'
    return
  }
  router.push({
    path: `/app/mentors/${mentor.value.id}/schedule`,
    query: { topic: topic.value, duration: String(duration.value), note: note.value }
  })
}
</script>

<template>
  <div class="book">
    <div class="target card">
      <Avatar :name="mentor.name" :size="46" />
      <div>
        <strong>{{ mentor.name }}</strong>
        <p class="text-faint">{{ mentor.title }}</p>
      </div>
      <span class="grow"></span>
      <span class="tag tag-green"><Icon name="clock" :size="13" /> Quick Chat</span>
    </div>

    <section class="card block">
      <h2>Quel est le sujet de votre échange ?</h2>
      <div class="topic-list">
        <button
          v-for="t in BOOKING_TOPICS"
          :key="t.id"
          class="topic"
          :class="{ on: topic === t.id }"
          @click="topic = t.id; error = ''"
        >
          <span class="topic-radio">
            <Icon v-if="topic === t.id" name="check" :size="13" />
          </span>
          <span>
            <strong>{{ t.label }}</strong>
            <small>{{ t.desc }}</small>
          </span>
        </button>
      </div>
    </section>

    <section class="card block">
      <h2>Durée souhaitée</h2>
      <div class="dur-row">
        <button
          v-for="d in durations"
          :key="d"
          class="dur"
          :class="{ on: duration === d }"
          @click="duration = d"
        >
          <strong>{{ d }} min</strong>
          <small>{{ d === 15 ? 'Conseil express' : 'Échange approfondi' }}</small>
        </button>
      </div>
    </section>

    <section class="card block">
      <label for="note">Message (optionnel)</label>
      <textarea
        id="note"
        v-model="note"
        class="textarea"
        placeholder="Un contexte pour aider votre mentor à préparer l’échange…"
      ></textarea>
    </section>

    <p v-if="error" class="err">{{ error }}</p>

    <button class="btn btn-primary btn-lg btn-block mt-16" @click="next">
      Choisir un créneau <Icon name="chevron-right" :size="18" />
    </button>
  </div>
</template>

<style scoped>
.book { padding-top: 18px; }
.target {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  font-size: 14.5px;
}
.target p { font-size: 12.5px; }

.block { padding: 20px; margin-top: 14px; }
.block h2 { font-size: 15.5px; margin-bottom: 14px; }

.topic-list { display: flex; flex-direction: column; gap: 10px; }
.topic {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  padding: 13px 14px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border);
  background: var(--cream-soft);
  transition: all 0.12s ease;
}
.topic:hover { border-color: var(--green); }
.topic.on { border-color: var(--green); background: var(--green-mist); }
.topic strong { font-size: 14px; display: block; }
.topic small { font-size: 12.5px; color: var(--ink-soft); }
.topic-radio {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--card);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-top: 1px;
  flex-shrink: 0;
}
.topic.on .topic-radio { background: var(--green); border-color: var(--green); }

.dur-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.dur {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border);
  background: var(--cream-soft);
}
.dur.on { border-color: var(--green); background: var(--green-mist); }
.dur strong { font-size: 15px; }
.dur small { font-size: 11.5px; color: var(--ink-soft); }

.block label { font-size: 13.5px; font-weight: 600; color: var(--ink-soft); display: block; margin-bottom: 8px; }
.err { color: var(--danger); font-size: 13px; margin-top: 12px; font-weight: 500; }
</style>
