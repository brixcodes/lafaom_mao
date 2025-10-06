#!/bin/bash

# Script de déploiement pour Netlify
echo "🚀 Début du déploiement..."

# Nettoyer le cache
echo "🧹 Nettoyage du cache..."
rm -rf node_modules/.vite
rm -rf dist

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci

# Build avec nettoyage
echo "🔨 Build de l'application..."
npm run build

# Vérifier que les fichiers sont bien générés
echo "✅ Vérification des fichiers générés..."
if [ -d "dist" ]; then
    echo "📁 Dossier dist créé avec succès"
    ls -la dist/
    
    # Vérifier les assets
    if [ -d "dist/assets" ]; then
        echo "📁 Dossier assets créé avec succès"
        ls -la dist/assets/ | head -10
    else
        echo "❌ Dossier assets manquant"
        exit 1
    fi
else
    echo "❌ Dossier dist manquant"
    exit 1
fi

echo "🎉 Déploiement terminé avec succès!"
