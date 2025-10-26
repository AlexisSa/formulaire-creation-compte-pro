#!/bin/bash
# Script pour démarrer proprement le serveur de dev

echo "🧹 Nettoyage du cache Next.js..."
rm -rf .next

echo "🚀 Démarrage du serveur..."
npm run dev

