# Manzi-mfa · Front-end MVP

> Le pont vers l'emploi dans l'IT grâce à un échange d'1h avec un senior.

Application web **front-end** (MVP) de la plateforme de mentorat & networking tech du collectif **Mongulu**. Aucun backend pour l'instant — les données sont mockées et persistées localement (localStorage).

## Stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/) (mode hash → fonctionne en statique sans config serveur)
- [Pinia](https://pinia.vuejs.org/) (stores + persistance localStorage)
- CSS natif (design system maison : fond crème, accents verts, cartes arrondies)

## Démarrage

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de production → dist/
npm run preview   # prévisualiser le build
```

## Parcours utilisateur

1. **Landing publique** — marketing (navbar, hero, comment ça marche, mentors à la une, communauté, footer). Aucune connexion requise pour naviguer.
2. **Connexion** — simulée (Google / LinkedIn / GitHub)
3. **Onboarding** — profil en 3 étapes (identité → stack → photo + bio)
4. **Dashboard** — sidebar + barre de recherche (responsive : drawer sur mobile)
   - **Home** — aperçu (stats, actions rapides, prochains Quick Chats)
   - **Find a Mentor** — recherche & filtres de mentors, profils, réservation Quick Chat
   - **Mes Mentorés** *(mentor)* — statuts (Actifs / En pause / Terminés), Message, Planifier, Relancer
   - **Appointments** — agenda & gestion des disponibilités
   - **Messages** — messagerie simulée
   - **Jobs** — job board communautaire, détail, publication d'offre
   - **Settings / Profil** — vue personnelle + déconnexion

## Structure

```
src/
├── components/    # UI réutilisable (icônes, cartes, nav, modales…)
├── data/          # données mock (mentors, offres, skills)
├── layouts/       # AppLayout (topbar + bottom nav)
├── router/        # routes + garde d'auth simulée
├── stores/        # Pinia : auth, profile, calendar, jobs, toast
├── styles/        # design system global (main.css)
└── views/         # écrans (landing, login, onboarding, découverte…)
```

## Notes MVP

- L'authentification est **simulée** (boutons sociaux sans OAuth réel).
- Réservations, profils et offres publiées sont persistés dans le **localStorage** du navigateur.
- L'intégration d'agenda (Calendly / Cal.com / Google) est **maquettée** ; le branchement réel se fera avec le backend.
- Les maquettes de référence sont dans [`images/`](./images).

---

© 2024 Mongulu Collective. Tous droits réservés.
