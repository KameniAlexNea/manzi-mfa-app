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

## Parcours utilisateur (mentoré)

1. **Landing (Étape 1)** — choix du rôle : *Je cherche un mentor* / *Je souhaite devenir mentor*
2. **Connexion** — simulée (Google / LinkedIn / GitHub)
3. **Onboarding** — profil en 3 étapes (identité → stack → photo + bio)
4. **Découvrir** — recherche & filtres de mentors
5. **Profil mentor** — bio, stack, disponibilités
6. **Réserver un Quick Chat** — sujet + durée → calendrier → créneau → confirmation
7. **Agenda** — réservations à venir (+ gestion des disponibilités côté mentor)
8. **Offres** — job board communautaire, détail, publication d'offre
9. **Profil** — vue personnelle + déconnexion

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
