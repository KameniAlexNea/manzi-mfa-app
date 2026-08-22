<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MENTORS } from '../data/mentors'
import Avatar from '../components/Avatar.vue'
import Icon from '../components/Icon.vue'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const mentor = computed(() => MENTORS.find((m) => m.id === route.params.id) || MENTORS[0])

const fav = ref(localStorage.getItem(`fav_${mentor.value.id}`) === '1')
const toggleFav = () => {
  fav.value = !fav.value
  localStorage.setItem(`fav_${mentor.value.id}`, fav.value ? '1' : '0')
  toast.show(fav.value ? 'Ajouté à vos favoris' : 'Retiré des favoris')
}

const details = computed(() => [
  { icon: 'briefcase', label: `${mentor.value.years} ans d’expérience` },
  { icon: 'book', label: mentor.value.school },
  { icon: 'globe', label: mentor.value.languages.join(' · ') },
  { icon: 'link', label: mentor.value.linkedin }
])
</script>

<template>
  <div class="mp">
    <section class="hero card">
      <Avatar :name="mentor.name" :size="84" :online="mentor.online" />
      <div class="hero-info">
        <div class="row gap-8">
          <h1 class="hero-name">{{ mentor.name }}</h1>
          <span v-if="mentor.verified" class="tag tag-green"><Icon name="check" :size="12" /> Vérifié</span>
        </div>
        <p class="hero-title">{{ mentor.title }}</p>
        <p class="hero-loc"><Icon name="map-pin" :size="14" /> {{ mentor.location }}</p>
        <div class="row gap-8 hero-rating">
          <span class="rating-stars"><Icon name="star" :size="16" /> {{ mentor.rating }}</span>
          <span class="text-faint">{{ mentor.reviews }} avis</span>
          <span v-if="mentor.online" class="tag tag-green">● En ligne</span>
        </div>
      </div>
      <button class="icon-btn" :class="{ fav: fav }" aria-label="Favori" @click="toggleFav">
        <Icon :name="fav ? 'heart' : 'heart'" :size="20" />
      </button>
    </section>

    <section class="about card">
      <h2>À propos</h2>
      <p>{{ mentor.about }}</p>
      <div class="tags mt-16">
        <span v-for="s in mentor.stack" :key="s" class="tag">{{ s }}</span>
      </div>
    </section>

    <section class="details card">
      <div v-for="d in details" :key="d.label" class="detail-row">
        <Icon :name="d.icon" :size="18" class="text-soft" />
        <span>{{ d.label }}</span>
      </div>
    </section>

    <section class="avail card">
      <div class="row">
        <h2>Disponibilités</h2>
        <span class="grow"></span>
        <span class="tag tag-amber">Prochaine dispo : {{ mentor.nextSlot }}</span>
      </div>
      <div class="slot-row">
        <span v-for="(s, i) in mentor.availability" :key="i" class="slot">
          {{ s.day }} {{ s.start }} – {{ s.end }}
        </span>
      </div>
    </section>

    <div class="actions">
      <button class="btn btn-outline" @click="router.push(`/app/mentors/${mentor.id}/schedule`)">
        <Icon name="calendar" :size="18" /> Agenda
      </button>
      <button class="btn btn-primary grow" @click="router.push(`/app/mentors/${mentor.id}/book`)">
        <Icon name="clock" :size="18" /> Réserver un Quick Chat
      </button>
    </div>
  </div>
</template>

<style scoped>
.mp { padding-top: 18px; }
.hero {
  padding: 22px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
}
.hero-info { flex: 1; min-width: 0; }
.hero-name { font-size: 21px; font-weight: 800; }
.hero-title { font-size: 14px; color: var(--ink-soft); margin-top: 2px; }
.hero-loc { display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px; color: var(--ink-soft); margin-top: 6px; }
.hero-rating { margin-top: 10px; font-size: 13px; }
.hero .icon-btn { position: absolute; top: 20px; right: 20px; }
.hero .icon-btn.fav { color: var(--danger); border-color: var(--danger-soft); background: var(--danger-soft); }

section { margin-top: 14px; padding: 20px; }
section h2 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.about p { font-size: 14px; color: var(--ink-soft); }

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  padding: 9px 0;
  border-bottom: 1px solid var(--border-soft);
}
.detail-row:last-child { border-bottom: none; }

.slot-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.slot {
  background: var(--green-mist);
  border: 1px solid #cfe3d6;
  color: var(--green-strong);
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
}

.actions { display: flex; gap: 12px; margin: 22px 0 8px; }
</style>
