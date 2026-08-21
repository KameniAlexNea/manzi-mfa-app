import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import HowItWorksView from '../views/HowItWorksView.vue'
import OnboardingView from '../views/OnboardingView.vue'
import AppLayout from '../layouts/AppLayout.vue'
import AppHomeView from '../views/AppHomeView.vue'
import MessagesView from '../views/MessagesView.vue'
import FindMentorView from '../views/FindMentorView.vue'
import MentorProfileView from '../views/MentorProfileView.vue'
import BookChatView from '../views/BookChatView.vue'
import SchedulingView from '../views/SchedulingView.vue'
import CalendarManagementView from '../views/CalendarManagementView.vue'
import ConnectAgendaView from '../views/ConnectAgendaView.vue'
import MyMentoreesView from '../views/MyMentoreesView.vue'
import JobBoardView from '../views/JobBoardView.vue'
import JobDetailView from '../views/JobDetailView.vue'
import PublishOfferView from '../views/PublishOfferView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Manzi-mfa' } },
  { path: '/login', name: 'login', component: LoginView, meta: { title: 'Connexion' } },
  { path: '/how-it-works', name: 'how-it-works', component: HowItWorksView, meta: { title: 'Comment ça marche' } },
  { path: '/onboarding', name: 'onboarding', component: OnboardingView, meta: { title: 'Créer mon profil' } },
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'home-dash' } },
      { path: 'home', name: 'home-dash', component: AppHomeView, meta: { title: 'Accueil' } },
      { path: 'messages', name: 'messages', component: MessagesView, meta: { title: 'Messages' } },
      { path: 'mentors', name: 'mentors', component: FindMentorView, meta: { title: 'Découvrir' } },
      { path: 'mentors/:id', name: 'mentor-profile', component: MentorProfileView, meta: { title: 'Profil mentor' } },
      { path: 'mentors/:id/book', name: 'book-chat', component: BookChatView, meta: { title: 'Réserver un Quick Chat' } },
      { path: 'mentors/:id/schedule', name: 'scheduling', component: SchedulingView, meta: { title: 'Choisir un créneau' } },
      { path: 'agenda', name: 'agenda', component: CalendarManagementView, meta: { title: 'Mon agenda' } },
      { path: 'agenda/connect', name: 'connect-agenda', component: ConnectAgendaView, meta: { title: 'Connecter mon agenda' } },
      { path: 'mentorees', name: 'mentorees', component: MyMentoreesView, meta: { title: 'Mes mentorés' } },
      { path: 'jobs', name: 'jobs', component: JobBoardView, meta: { title: 'Offres' } },
      { path: 'jobs/new', name: 'publish-offer', component: PublishOfferView, meta: { title: 'Publier une offre' } },
      { path: 'jobs/:id', name: 'job-detail', component: JobDetailView, meta: { title: 'Détail de l\'offre' } },
      { path: 'profile', name: 'profile', component: ProfileView, meta: { title: 'Mon profil' } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Simulated auth guard (front-end only for the MVP).
// 1) non connecté → page de connexion ; 2) connecté sans compte créé → onboarding.
router.beforeEach((to) => {
  const authed = localStorage.getItem('manzi_authed') === 'true'
  const onboarded = localStorage.getItem('manzi_onboarded') === 'true'
  if (to.meta.requiresAuth && !authed) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAuth && authed && !onboarded) {
    return { name: 'onboarding' }
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} · Manzi-mfa` : 'Manzi-mfa'
})

export default router
