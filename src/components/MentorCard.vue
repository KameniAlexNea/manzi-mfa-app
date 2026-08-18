<script setup>
import { useRouter } from 'vue-router'
import Avatar from './Avatar.vue'
import Icon from './Icon.vue'

const props = defineProps({
  mentor: { type: Object, required: true }
})

const router = useRouter()

const go = () => router.push(`/app/mentors/${props.mentor.id}`)
</script>

<template>
  <article class="m-card card" role="button" tabindex="0" @click="go" @keydown.enter="go">
    <div class="m-top">
      <Avatar :name="mentor.name" :size="54" :online="mentor.online" />
      <div class="m-id">
        <h3 class="m-name">{{ mentor.name }}</h3>
        <p class="m-title">{{ mentor.title }}</p>
      </div>
      <span v-if="mentor.verified" class="tag tag-green verified" title="Mentor vérifié">
        <Icon name="check" :size="12" /> Vérifié
      </span>
    </div>

    <p class="m-meta">
      <span><Icon name="briefcase" :size="14" /> {{ mentor.company }}</span>
      <span><Icon name="clock" :size="14" /> {{ mentor.years }} ans d’exp.</span>
      <span><Icon name="map-pin" :size="14" /> {{ mentor.location }}</span>
    </p>

    <div class="tags">
      <span v-for="s in mentor.stack.slice(0, 3)" :key="s" class="tag">{{ s }}</span>
      <span v-if="mentor.stack.length > 3" class="tag tag-outline">+{{ mentor.stack.length - 3 }}</span>
    </div>

    <div class="m-foot">
      <span class="rating">
        <Icon name="star" :size="15" />
        <strong>{{ mentor.rating }}</strong>
        <span class="text-faint">({{ mentor.reviews }})</span>
      </span>
      <span class="avail">
        <Icon name="calendar" :size="14" /> Dispo {{ mentor.nextSlot }}
      </span>
      <button class="btn btn-ghost btn-sm" @click.stop="go">Voir</button>
    </div>
  </article>
</template>

<style scoped>
.m-card {
  padding: 18px;
  cursor: pointer;
  transition: transform 0.14s ease, box-shadow 0.14s ease;
}
.m-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.m-top { display: flex; align-items: flex-start; gap: 12px; }
.m-id { flex: 1; min-width: 0; }
.m-name { font-size: 16px; font-weight: 700; }
.m-title { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }
.verified { flex-shrink: 0; margin-top: 2px; }
.m-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  font-size: 12.5px;
  color: var(--ink-soft);
}
.m-meta span { display: inline-flex; align-items: center; gap: 5px; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.m-foot {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border-soft);
}
.rating { display: inline-flex; align-items: center; gap: 3px; color: var(--amber); font-size: 13px; }
.avail { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--green-strong); font-weight: 600; flex: 1; }
</style>
