<script setup>
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'

const props = defineProps({
  job: { type: Object, required: true }
})

const router = useRouter()
const go = () => router.push(`/app/jobs/${props.job.id}`)

const typeClass = {
  Stage: 'tag-info',
  Alternance: 'tag-amber',
  CDI: 'tag-green',
  CDD: 'tag-outline',
  Freelance: 'tag-danger'
}[props.job.type] || 'tag-outline'
</script>

<template>
  <article class="j-card card" role="button" tabindex="0" @click="go" @keydown.enter="go">
    <div class="j-top">
      <span class="j-logo">{{ job.logo }}</span>
      <div class="grow">
        <h3 class="j-title">{{ job.title }}</h3>
        <p class="j-company">{{ job.company }} · {{ job.location }}</p>
      </div>
      <span v-if="job.featured" class="tag tag-amber">★ Recommandée</span>
    </div>
    <div class="j-meta">
      <span class="tag" :class="typeClass">{{ job.type }}</span>
      <span class="j-salary"><Icon name="check-circle" :size="14" /> {{ job.salary }}</span>
      <span class="j-date text-faint">{{ job.postedAt }}</span>
    </div>
  </article>
</template>

<style scoped>
.j-card {
  padding: 17px;
  cursor: pointer;
  transition: transform 0.14s ease, box-shadow 0.14s ease;
}
.j-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.j-top { display: flex; align-items: flex-start; gap: 12px; }
.j-logo {
  width: 44px; height: 44px;
  border-radius: 13px;
  background: var(--green-soft);
  color: var(--green-deep);
  font-family: var(--font-display);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.j-title { font-size: 15.5px; font-weight: 700; line-height: 1.25; }
.j-company { font-size: 12.5px; color: var(--ink-soft); margin-top: 2px; }
.j-meta { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.j-salary { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--green-strong); font-weight: 600; }
.j-date { font-size: 12px; margin-left: auto; }
</style>
