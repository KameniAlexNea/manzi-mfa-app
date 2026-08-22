<script setup>
import { useRouter } from 'vue-router'
import LogoMark from '../components/LogoMark.vue'
import Icon from '../components/Icon.vue'
import Avatar from '../components/Avatar.vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

// Page d'accueil : landing marketing publique (pas de page de connexion / choix de rôle).

const go = (path) => {
  if (path.startsWith('/app') && !auth.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: path } })
  } else {
    router.push(path)
  }
}

const start = (role, dest) => {
  auth.chooseRole(role)
  go(dest)
}

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Find a Mentor', to: '/app/mentors' },
  { label: 'Appointments', to: '/app/agenda' },
  { label: 'Messages', to: '/app/messages' },
  { label: 'Jobs', to: '/app/jobs' },
  { label: 'Resources', to: '/how-it-works' }
]

const howSteps = [
  {
    n: '1',
    title: 'Créez votre profil',
    desc: 'Inscrivez-vous en quelques secondes et précisez vos intérêts technologiques et vos objectifs de carrière.'
  },
  {
    n: '2',
    title: 'Choisissez votre mentor',
    desc: 'Explorez notre répertoire de mentors filtrés par expertise (DevOps, Data, Product, Engineering Manager).'
  },
  {
    n: '3',
    title: 'Book Quick Chat',
    desc: 'Réservez un créneau de 15 à 30 minutes directement dans l’agenda du mentor pour vos questions urgentes.'
  }
]

// Mentors à la une (data provisoire de la landing).
const featured = [
  { id: 'aicha', firstName: 'Aïcha', name: 'Aïcha Koné', title: 'Data Engineer', company: 'TechCorp', stack: ['Python', 'BigQuery'], online: true },
  { id: 'patrick', firstName: 'Patrick', name: 'Patrick Mbala', title: 'Senior DevOps', company: 'CloudScale', stack: ['Kubernetes', 'AWS'], online: false },
  { id: 'emmanuel', firstName: 'Emmanuel', name: 'Emmanuel Koffi', title: 'Frontend Lead', company: 'FinLink', stack: ['React', 'UI Design'], online: true },
  { id: 'sarah', firstName: 'Sarah', name: 'Sarah Nkosi', title: 'Engineering Manager', company: 'GlobalTech', stack: ['Leadership', 'Scale'], online: true }
]

const year = new Date().getFullYear()
</script>

<template>
  <div class="page landing">
    <!-- Navbar -->
    <header class="site-nav">
      <div class="container nav-inner">
        <LogoMark :size="36" />
        <nav class="nav-links desktop-only">
          <button v-for="l in navLinks" :key="l.label" class="nav-link" @click="go(l.to)">
            {{ l.label }}
          </button>
        </nav>
        <button v-if="!auth.isAuthenticated" class="btn btn-primary btn-sm" @click="go('/login')">
          Se connecter
        </button>
        <button v-else class="btn btn-primary btn-sm" @click="go('/app/home')">Mon espace</button>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-text">
          <span class="hero-badge"><Icon name="sparkles" :size="14" /> Mentorat tech · Communauté Mongulu</span>
          <h1>Trouvez le mentor tech qui vous aidera à avancer</h1>
          <p>
            Accélérez votre carrière grâce à des échanges de 15-30 minutes avec des professionnels
            chevronnés de la tech africaine et de sa diaspora.
          </p>
          <div class="hero-cta">
            <button class="btn btn-primary btn-lg" @click="start('mentee', '/app/mentors')">
              Trouver un mentor
            </button>
            <button class="btn btn-outline btn-lg" @click="start('mentor', '/app/home')">
              Devenir mentor
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat-pill">
              <Icon name="shield" :size="18" />
              <div><strong>Mentors Certifiés</strong><span>par le collectif</span></div>
            </div>
            <div class="stat-pill">
              <Icon name="users" :size="18" />
              <div><strong>+500 experts dispos</strong><span>partout dans le monde</span></div>
            </div>
          </div>
        </div>

        <!-- Illustration hero -->
        <div class="hero-art" aria-hidden="true">
          <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" class="hero-svg">
            <defs>
              <linearGradient id="herobg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#E5F1EA" />
                <stop offset="1" stop-color="#F7F3EA" />
              </linearGradient>
            </defs>
            <rect width="420" height="380" rx="36" fill="url(#herobg)" />
            <circle cx="70" cy="70" r="10" fill="#1E7B4B" opacity="0.25" />
            <circle cx="350" cy="60" r="14" fill="#1E7B4B" opacity="0.18" />
            <circle cx="60" cy="310" r="8" fill="#F2A93B" opacity="0.5" />
            <path d="M90 320c60-30 180-30 240 0" stroke="#1E7B4B" stroke-width="3" stroke-linecap="round" opacity="0.25" />
            <!-- Laptop -->
            <g>
              <rect x="90" y="110" width="240" height="160" rx="14" fill="#FFFFFF" stroke="#1E7B4B" stroke-width="2.5" />
              <rect x="90" y="110" width="240" height="28" rx="14" fill="#1E7B4B" />
              <circle cx="104" cy="124" r="4" fill="#fff" />
              <circle cx="118" cy="124" r="4" fill="#fff" opacity="0.6" />
              <circle cx="132" cy="124" r="4" fill="#fff" opacity="0.35" />
              <path d="M108 160h60" stroke="#1E7B4B" stroke-width="7" stroke-linecap="round" opacity="0.85" />
              <path d="M108 184h92" stroke="#C9DDD0" stroke-width="7" stroke-linecap="round" />
              <path d="M108 208h74" stroke="#C9DDD0" stroke-width="7" stroke-linecap="round" />
              <path d="M108 232h110" stroke="#E5E8DE" stroke-width="7" stroke-linecap="round" />
              <path d="M112 154h46" stroke="#F2A93B" stroke-width="6" stroke-linecap="round" opacity="0.9" />
            </g>
            <!-- video call bubble -->
            <g>
              <rect x="262" y="196" width="118" height="86" rx="16" fill="#FFFFFF" stroke="#E6E0D1" />
              <circle cx="292" cy="222" r="14" fill="#1E7B4B" opacity="0.9" />
              <circle cx="292" cy="222" r="4" fill="#fff" />
              <rect x="316" y="210" width="52" height="24" rx="12" fill="#C9DDD0" />
              <path d="M286 258h70" stroke="#1E7B4B" stroke-width="7" stroke-linecap="round" opacity="0.5" />
            </g>
            <!-- floating chips -->
            <g>
              <rect x="96" y="288" width="120" height="34" rx="17" fill="#1E7B4B" />
              <text x="112" y="311" font-family="Poppins, sans-serif" font-size="13" font-weight="600" fill="#fff">15-30 min</text>
              <rect x="240" y="60" width="130" height="36" rx="18" fill="#FFFFFF" stroke="#E6E0D1" />
              <text x="254" y="84" font-family="Poppins, sans-serif" font-size="12.5" font-weight="600" fill="#16603A">Quick Chat ✅</text>
            </g>
          </svg>
          <span class="hero-float f1"><Icon name="clock" :size="16" /> 15 min</span>
          <span class="hero-float f2"><Icon name="star" :size="16" /> 4.9</span>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="how">
      <div class="container">
        <div class="sec-head">
          <h2>Comment ça marche ?</h2>
          <p>Trois étapes simples pour booster votre parcours.</p>
        </div>
        <div class="how-grid">
          <div v-for="s in howSteps" :key="s.n" class="how-card card">
            <span class="how-n">{{ s.n }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured mentors -->
    <section class="featured">
      <div class="container">
        <div class="sec-head row">
          <div>
            <h2>Mentors à la une</h2>
            <p>Apprenez des meilleurs de l’écosystème.</p>
          </div>
          <button class="see-all" @click="go('/app/mentors')">
            Voir tous les mentors <Icon name="chevron-right" :size="17" />
          </button>
        </div>
        <div class="featured-grid">
          <article v-for="m in featured" :key="m.id" class="f-card card">
            <div class="f-avatar"><Avatar :name="m.name" :size="62" :online="m.online" /></div>
            <h3>{{ m.firstName }}</h3>
            <p class="f-role">{{ m.title }} @ {{ m.company }}</p>
            <div class="f-tags">
              <span v-for="s in m.stack" :key="s" class="tag">{{ s }}</span>
            </div>
            <button class="btn btn-ghost btn-sm btn-block" @click="go('/app/mentors')">
              Voir profil
            </button>
          </article>
        </div>
      </div>
    </section>

    <!-- Community -->
    <section class="community">
      <div class="container community-inner">
        <span class="comm-ico"><Icon name="users" :size="28" /></span>
        <h2>Une communauté engagée et gratuite</h2>
        <p class="comm-mission">
          Manzi-mfa est un service porté par le collectif Mongulu. Notre mission est de démocratiser
          l’accès au savoir technologique. Les sessions « Quick Chat » sont gratuites pour tous les
          membres de la communauté.
        </p>
        <div class="comm-stat">
          <strong>+2500</strong>
          <span>membres actifs</span>
        </div>
        <blockquote class="comm-quote">
          « Manzi-mfa a changé ma vision de la tech. Merci aux mentors ! »
          <footer>— Sekou, Junior Web Dev</footer>
        </blockquote>
      </div>
    </section>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <LogoMark :size="32" />
          <p>Tech Mentorship Collective</p>
        </div>
        <nav class="footer-links">
          <a href="#" @click.prevent>About Us</a>
          <a href="#" @click.prevent>Privacy Policy</a>
          <a href="#" @click.prevent>Terms of Service</a>
          <a href="#" @click.prevent>Contact</a>
        </nav>
      </div>
      <p class="footer-copy">© {{ year }} Mongulu Collective. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.landing { background: var(--cream); }

/* ---------- Navbar ---------- */
.site-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(247, 243, 234, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-soft);
}
.nav-inner {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-top: 14px;
  padding-bottom: 14px;
}
.nav-links {
  display: flex;
  gap: 4px;
  flex: 1;
  justify-content: center;
}
.nav-link {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-soft);
}
.nav-link:hover { color: var(--green); background: var(--green-mist); }

/* ---------- Hero ---------- */
.hero { padding: 56px 0 64px; }
.hero-inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--green-strong);
  background: var(--green-soft);
  border: 1px solid #cfe3d6;
  padding: 7px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
}
.hero h1 {
  font-size: clamp(30px, 4.6vw, 46px);
  font-weight: 800;
  letter-spacing: -0.02em;
  max-width: 540px;
}
.hero-text p {
  margin-top: 18px;
  font-size: 17px;
  color: var(--ink-soft);
  max-width: 500px;
}
.hero-cta { display: flex; gap: 14px; margin-top: 28px; flex-wrap: wrap; }
.hero-stats { display: flex; gap: 22px; margin-top: 34px; flex-wrap: wrap; }
.stat-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--green);
}
.stat-pill div { display: flex; flex-direction: column; }
.stat-pill strong { font-size: 15px; color: var(--ink); font-family: var(--font-display); }
.stat-pill span { font-size: 12px; color: var(--ink-faint); }

.hero-art { position: relative; }
.hero-svg { width: 100%; height: auto; }
.hero-float {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-md);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  color: var(--green-strong);
}
.hero-float.f1 { bottom: 24px; left: -6px; }
.hero-float.f2 { top: 18px; right: 6px; color: var(--amber); }

/* ---------- Sections ---------- */
.how, .featured { padding: 56px 0; }
.how { background: var(--cream-soft); }
.sec-head { text-align: center; margin-bottom: 34px; }
.sec-head h2 { font-size: 28px; font-weight: 800; }
.sec-head p { color: var(--ink-soft); margin-top: 8px; }
.sec-head.row { text-align: left; justify-content: space-between; align-items: flex-end; }
.see-all {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--green);
  font-weight: 700;
  font-size: 14.5px;
  padding: 8px 12px;
  border-radius: 999px;
}
.see-all:hover { background: var(--green-mist); }

.how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.how-card { padding: 28px 24px; }
.how-n {
  width: 44px; height: 44px;
  border-radius: 14px;
  background: var(--green);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 6px 14px rgba(30, 123, 75, 0.3);
}
.how-card h3 { font-size: 18px; }
.how-card p { font-size: 14px; color: var(--ink-soft); margin-top: 8px; }

.featured-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.f-card { padding: 24px 18px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.f-card h3 { font-size: 17px; }
.f-role { font-size: 13px; color: var(--ink-soft); }
.f-tags { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; margin: 4px 0 8px; }
.f-card .btn { margin-top: auto; }

/* ---------- Community ---------- */
.community { padding: 56px 0; background: linear-gradient(150deg, var(--green) 0%, var(--green-strong) 100%); }
.community-inner { text-align: center; max-width: 720px; color: #fff; }
.comm-ico {
  width: 64px; height: 64px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}
.community h2 { color: #fff; font-size: 28px; font-weight: 800; }
.comm-mission { margin: 14px auto 0; max-width: 620px; color: rgba(255, 255, 255, 0.88); font-size: 15.5px; }
.comm-stat { margin-top: 26px; }
.comm-stat strong { font-family: var(--font-display); font-size: 40px; font-weight: 800; display: block; }
.comm-stat span { color: rgba(255, 255, 255, 0.85); font-size: 14px; }
.comm-quote {
  margin: 30px auto 0;
  max-width: 560px;
  font-size: 16px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  padding-top: 26px;
}
.comm-quote footer { font-style: normal; font-size: 13.5px; color: rgba(255, 255, 255, 0.8); margin-top: 8px; font-weight: 600; }

/* ---------- Footer ---------- */
.site-footer {
  background: var(--ink);
  color: rgba(255, 255, 255, 0.75);
  padding: 34px 0 26px;
}
.footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.footer-brand :deep(.logo-text) { color: #fff; }
.footer-brand p { font-size: 12.5px; color: rgba(255, 255, 255, 0.6); margin-top: 6px; }
.footer-links { display: flex; gap: 22px; flex-wrap: wrap; }
.footer-links a { font-size: 13px; color: rgba(255, 255, 255, 0.7); }
.footer-links a:hover { color: #fff; }
.footer-copy { text-align: center; font-size: 12px; color: rgba(255, 255, 255, 0.5); margin-top: 22px; }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; }
  .hero-art { max-width: 440px; margin: 0 auto; }
  .how-grid { grid-template-columns: 1fr; }
  .featured-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .featured-grid { grid-template-columns: 1fr; }
  .hero { padding: 36px 0 44px; }
  .how, .featured, .community { padding: 40px 0; }
}
</style>
