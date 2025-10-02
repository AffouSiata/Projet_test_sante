# Health App - Application de Santé Full-Stack

Application web de gestion de santé complète avec système de prise de rendez-vous, construite avec React 19 et NestJS.

## 🚀 Technologies

### Backend
- **NestJS** (TypeScript)
- **PostgreSQL** avec Prisma ORM
- **JWT & Passport.js** pour l'authentification
- **Zod & nestjs-zod** pour la validation
- **bcrypt** pour le hashage des mots de passe

### Frontend
- **React 19** avec Vite
- **React Router** pour le routing
- **Axios** pour les appels API
- **Zustand** pour la gestion d'état
- **Tailwind CSS** pour le styling

## 👥 Rôles Utilisateurs

### Patient
- Inscription autonome
- Prise de rendez-vous avec les médecins
- Gestion du profil personnel
- Consultation de l'historique des rendez-vous

### Médecin
- Compte créé par l'admin uniquement
- Consultation et gestion des rendez-vous
- Gestion du profil professionnel
- Ajout de notes sur les consultations

### Admin
- Gestion complète des médecins (CRUD)
- Vue d'ensemble des statistiques
- Accès à tous les rendez-vous

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v13 ou supérieur)
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd health-app
```

### 2. Configuration Backend

```bash
# Naviguer vers le backend
cd backend

# Installer les dépendances
npm install

# Configurer la base de données
cp .env.example .env
# Éditer .env avec vos informations de base de données

# Exemple de configuration .env:
DATABASE_URL="postgresql://user:password@localhost:5432/health_app?schema=public"
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d
PORT=3000

# Générer le client Prisma
npm run prisma:generate

# Créer les tables dans la base de données
npm run prisma:migrate

# (Optionnel) Peupler la base avec des données de test
npm run prisma:seed
```

### 3. Configuration Frontend

```bash
# Naviguer vers le frontend (depuis la racine)
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env (optionnel)
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

## 🏃 Démarrage

### Backend

```bash
cd backend

# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

Le backend sera accessible sur : http://localhost:3000/api

### Frontend

```bash
cd frontend

# Mode développement
npm run dev

# Build pour production
npm run build
npm run preview
```

Le frontend sera accessible sur : http://localhost:5173

## 📝 Comptes de Test

Après avoir exécuté le seed de la base de données :

- **Admin:** admin@health.com / Admin@123
- **Médecin:** dr.smith@health.com / Doctor@123
- **Patient:** patient@example.com / Patient@123

## 🔑 Fonctionnalités Principales

### Authentification
- Inscription des patients avec validation complète
- Connexion sécurisée avec JWT
- Guards de rôle pour protéger les routes

### Gestion des Profils
- **Patients:** Informations personnelles, historique médical
- **Médecins:** Informations professionnelles, spécialisation, tarifs
- **Admin:** Profil administrateur

### Système de Rendez-vous
- Détection automatique des collisions d'horaires
- Créneaux disponibles de 9h à 17h (30 minutes)
- Statuts: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
- Notes de consultation pour les médecins

### Dashboard Admin
- Statistiques globales (patients, médecins, rendez-vous)
- Gestion CRUD complète des médecins
- Vue d'ensemble des activités récentes

## 📁 Structure du Projet

```
health-app/
├── backend/
│   ├── src/
│   │   ├── admin/           # Module administration
│   │   ├── appointments/    # Module rendez-vous
│   │   ├── auth/           # Authentification et autorisation
│   │   ├── common/         # DTOs et utilitaires partagés
│   │   ├── prisma/         # Service Prisma
│   │   ├── users/          # Module utilisateurs
│   │   └── main.ts         # Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma de base de données
│   │   └── seed.ts         # Script de peuplement
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services API
│   │   ├── store/          # Gestion d'état Zustand
│   │   └── App.jsx         # Composant principal
│   └── package.json
│
└── README.md
```

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT avec expiration configurable
- Validation stricte des entrées avec Zod
- Guards de rôle pour protéger les endpoints
- CORS configuré pour le frontend

## 🧪 Tests

### Backend

```bash
cd backend

# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📊 Base de Données

### Modèles Principaux

- **User:** Informations de base pour tous les utilisateurs
- **Patient:** Profil étendu pour les patients
- **Doctor:** Profil étendu pour les médecins
- **Appointment:** Rendez-vous avec prévention des collisions

### Commandes Prisma Utiles

```bash
# Ouvrir Prisma Studio (interface graphique)
npm run prisma:studio

# Créer une nouvelle migration
npm run prisma:migrate

# Réinitialiser la base de données
npx prisma migrate reset
```

## 🚀 Déploiement

### Backend
1. Configurer les variables d'environnement de production
2. Builder l'application : `npm run build`
3. Démarrer avec : `npm run start:prod`

### Frontend
1. Builder l'application : `npm run build`
2. Servir le dossier `dist/` avec un serveur web (nginx, apache, etc.)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📜 Licence

Ce projet est sous licence MIT.

## 📮 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.