// Offres d'emploi mock — Job Board communautaire
export const JOBS = [
  {
    id: 'job-1',
    title: 'Développeur·se Frontend (Vue.js)',
    company: 'TechCorp',
    logo: 'TC',
    type: 'Stage',
    location: 'Paris · Remote',
    salary: '900 € / mois',
    stack: ['Vue.js', 'TypeScript', 'SCSS'],
    postedAt: 'Il y a 2 jours',
    description:
      'Rejoignez l’équipe produit de TechCorp pour contribuer au développement de notre plateforme SaaS de gestion d’équipe. Vous travaillerez en binôme avec un développeur senior et participerez aux revues de code.',
    missions: [
      'Développer des interfaces réactives et accessibles en Vue.js',
      'Participer aux sprints et aux ateliers de conception produit',
      'Écrire et maintenir les tests unitaires des composants',
      'Collaborer avec le designer sur l’application de la charte graphique'
    ],
    profile: [
      'Vous préparez un diplôme Bac+3/+5 ou êtes en bootcamp (Le Wagon, O’Clock…)',
      'Vous maîtrisez les bases de JavaScript et avez déjà un petit projet Vue ou React',
      'Curiosité, rigueur et envie d’apprendre',
      'Aisance en français, l’anglais est un plus'
    ],
    contact: 'recrutement@techcorp.io',
    remote: true,
    featured: true
  },
  {
    id: 'job-2',
    title: 'Développeur·se Backend Node.js',
    company: 'BankTech',
    logo: 'BT',
    type: 'Alternance',
    location: 'Lyon · Hybride',
    salary: '1 200 € / mois',
    stack: ['Node.js', 'NestJS', 'PostgreSQL'],
    postedAt: 'Il y a 5 jours',
    description:
      'BankTech recherche un·e alternant·e backend pour rejoindre l’équipe API. Vous contribuerez à la conception de services REST robustes et sécurisés au cœur de notre plateforme financière.',
    missions: [
      'Concevoir et maintenir des APIs REST avec NestJS',
      'Modéliser et optimiser des requêtes PostgreSQL',
      'Rédiger des tests d’intégration',
      'Participer aux rituels agiles de l’équipe'
    ],
    profile: [
      'Formation en alternance (Bac+3 à Bac+5) en informatique',
      'Bonnes bases en JavaScript/TypeScript',
      'Sensibilité à la sécurité et à la qualité de code',
      'Esprit d’équipe et communication claire'
    ],
    contact: 'talents@banktech.io',
    remote: true,
    featured: true
  },
  {
    id: 'job-3',
    title: 'Data Analyst Junior',
    company: 'DataLabs',
    logo: 'DL',
    type: 'CDI',
    location: 'Bordeaux · Remote',
    salary: '36 K€ / an',
    stack: ['SQL', 'Python', 'Looker Studio'],
    postedAt: 'Il y a 1 semaine',
    description:
      'DataLabs accompagne les PME dans leur transformation data. Nous cherchons un·e Data Analyst junior curieux·se pour transformer les données en tableaux de bord actionnables.',
    missions: [
      'Créer des dashboards et rapports pour les clients',
      'Nettoyer et structurer des jeux de données SQL',
      'Automatiser des traitements avec Python',
      'Présenter les insights à des interlocuteurs non techniques'
    ],
    profile: [
      'Première expérience ou projet portfolio solide en data',
      'SQL courant et bonnes bases en Python',
      'Sens de la communication et du détail',
      'Formation data (école, bootcamp, certification) appréciée'
    ],
    contact: 'jobs@datalabs.fr',
    remote: true,
    featured: false
  },
  {
    id: 'job-4',
    title: 'Développeur·se Mobile Flutter',
    company: 'Mobitribe',
    logo: 'MT',
    type: 'CDD (6 mois)',
    location: 'Remote',
    salary: '3 200 € / mois',
    stack: ['Flutter', 'Dart', 'Firebase'],
    postedAt: 'Il y a 3 jours',
    description:
      'Mobitribe développe des apps mobiles pour des marques africaines et européennes. Nous cherchons un·e développeur·se Flutter pour un CDD de 6 mois avec fort potentiel de renouvellement.',
    missions: [
      'Développer de nouvelles fonctionnalités cross-platform en Flutter',
      'Intégrer des API et services Firebase',
      'Participer aux revues de code et au design system',
      'Publier et suivre les mises à jour sur les stores'
    ],
    profile: [
      'Expérience sur au moins un projet Flutter publié',
      'Bonnes bases en Dart et programmation orientée objet',
      'Autonomie et goût pour l’UI',
      'Anglais technique correct'
    ],
    contact: 'team@mobitribe.app',
    remote: true,
    featured: false
  },
  {
    id: 'job-5',
    title: 'Développeur·se Fullstack PHP/Symfony',
    company: 'Agence Cœl',
    logo: 'AC',
    type: 'CDI',
    location: 'Douala · Hybride',
    salary: 'À négocier',
    stack: ['PHP', 'Symfony', 'MySQL', 'Vue.js'],
    postedAt: 'Il y a 4 jours',
    description:
      'Agence web spécialisée dans les projets gouvernementaux et corporate, Cœl recherche un·e développeur·se fullstack confirmé·e pour renforcer son équipe produit.',
    missions: [
      'Développer des applications web en Symfony',
      'Intervenir sur les interfaces avec Vue.js',
      'Garantir la qualité et la maintenabilité du code',
      'Encadrer un·e développeur·se junior'
    ],
    profile: [
      '2+ ans d’expérience sur Symfony et MySQL',
      'Notions de Vue.js ou autre framework front',
      'Bonne culture DevOps (Docker, CI/CD) appréciée',
      'Sens du service client'
    ],
    contact: 'jobs@agence-coel.cm',
    remote: false,
    featured: false
  },
  {
    id: 'job-6',
    title: 'QA / Testeur·se Logiciel',
    company: 'FinPay',
    logo: 'FP',
    type: 'Stage',
    location: 'Abidjan · Remote',
    salary: 'Gratification + télétravail',
    stack: ['Test', 'Cypress', 'Agile'],
    postedAt: 'Il y a 2 semaines',
    description:
      'FinPay souhaite renforcer la qualité de ses applications de paiement. Nous offrons un stage QA pour apprendre les fondamentaux des tests manuels et automatisés avec un vrai encadrement.',
    missions: [
      'Écrire et exécuter des scénarios de test manuels',
      'Découvrir l’automatisation avec Cypress',
      'Documenter les anomalies et suivre leur résolution',
      'Collaborer avec les équipes dev et produit'
    ],
    profile: [
      'Curiosité pour la qualité logicielle',
      'Rigueur et sens du détail',
      'Notions de base en développement appréciées',
      'Bonne communication'
    ],
    contact: 'recrute@finpay.cm',
    remote: true,
    featured: false
  }
]
