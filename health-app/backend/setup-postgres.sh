#!/bin/bash

echo "🔧 Configuration de PostgreSQL pour Health App"
echo "============================================"

# Variables
DB_NAME="health_app"
DB_USER="postgres"

# Créer la base de données
echo "📦 Création de la base de données '$DB_NAME'..."
createdb $DB_NAME 2>/dev/null || echo "La base de données existe déjà"

# Afficher les informations de connexion
echo ""
echo "✅ Base de données configurée !"
echo ""
echo "📝 Mettez à jour votre fichier .env avec :"
echo "DATABASE_URL=\"postgresql://$USER@localhost:5432/$DB_NAME\""
echo ""
echo "Ou si vous avez un mot de passe PostgreSQL :"
echo "DATABASE_URL=\"postgresql://$DB_USER:VOTRE_MOT_DE_PASSE@localhost:5432/$DB_NAME\""