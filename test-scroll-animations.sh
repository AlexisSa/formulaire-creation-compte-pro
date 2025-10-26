#!/bin/bash

# Script de test complet pour les animations au scroll
# Exécute tous les types de tests : unitaires, intégration, accessibilité et performance

echo "🧪 Démarrage des tests pour les animations au scroll..."
echo "=================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Fonction pour afficher les sections
print_section() {
    echo -e "\n${BLUE}📋 $1${NC}"
    echo "----------------------------------------"
}

# Vérifier que Jest est installé
if ! command -v jest &> /dev/null; then
    echo -e "${RED}❌ Jest n'est pas installé. Veuillez installer Jest d'abord.${NC}"
    exit 1
fi

# Vérifier que les dépendances de test sont installées
if ! npm list @testing-library/react &> /dev/null; then
    echo -e "${YELLOW}⚠️  Installation des dépendances de test...${NC}"
    npm install --save-dev @testing-library/react @testing-library/jest-dom jest-axe
fi

# 1. Tests unitaires pour les hooks
print_section "Tests unitaires - Hooks d'animation au scroll"
jest __tests__/hooks/useViewportAnimations.test.ts --verbose --coverage
UNIT_HOOKS_RESULT=$?
print_result $UNIT_HOOKS_RESULT "Tests unitaires des hooks"

# 2. Tests d'intégration pour les composants
print_section "Tests d'intégration - Composants Viewport"
jest __tests__/components/viewport-animations.test.tsx --verbose --coverage
INTEGRATION_RESULT=$?
print_result $INTEGRATION_RESULT "Tests d'intégration des composants"

# 3. Tests d'accessibilité
print_section "Tests d'accessibilité - Conformité WCAG 2.1"
jest __tests__/accessibility/viewport-animations.test.tsx --config=jest.accessibility.config.js --verbose
ACCESSIBILITY_RESULT=$?
print_result $ACCESSIBILITY_RESULT "Tests d'accessibilité"

# 4. Tests de performance
print_section "Tests de performance - Optimisations et métriques"
jest __tests__/performance/viewport-animations.test.tsx --config=jest.performance.config.js --verbose
PERFORMANCE_RESULT=$?
print_result $PERFORMANCE_RESULT "Tests de performance"

# 5. Tests de régression
print_section "Tests de régression - Stabilité"
jest __tests__/hooks/useViewportAnimations.test.ts __tests__/components/viewport-animations.test.tsx --verbose --passWithNoTests
REGRESSION_RESULT=$?
print_result $REGRESSION_RESULT "Tests de régression"

# Résumé des résultats
echo -e "\n${BLUE}📊 Résumé des tests${NC}"
echo "=================================================="

TOTAL_TESTS=5
PASSED_TESTS=0

if [ $UNIT_HOOKS_RESULT -eq 0 ]; then
    ((PASSED_TESTS++))
fi

if [ $INTEGRATION_RESULT -eq 0 ]; then
    ((PASSED_TESTS++))
fi

if [ $ACCESSIBILITY_RESULT -eq 0 ]; then
    ((PASSED_TESTS++))
fi

if [ $PERFORMANCE_RESULT -eq 0 ]; then
    ((PASSED_TESTS++))
fi

if [ $REGRESSION_RESULT -eq 0 ]; then
    ((PASSED_TESTS++))
fi

echo -e "${BLUE}Tests unitaires (hooks):${NC} $([ $UNIT_HOOKS_RESULT -eq 0 ] && echo -e "${GREEN}✅ PASSÉ${NC}" || echo -e "${RED}❌ ÉCHOUÉ${NC}")"
echo -e "${BLUE}Tests d'intégration (composants):${NC} $([ $INTEGRATION_RESULT -eq 0 ] && echo -e "${GREEN}✅ PASSÉ${NC}" || echo -e "${RED}❌ ÉCHOUÉ${NC}")"
echo -e "${BLUE}Tests d'accessibilité:${NC} $([ $ACCESSIBILITY_RESULT -eq 0 ] && echo -e "${GREEN}✅ PASSÉ${NC}" || echo -e "${RED}❌ ÉCHOUÉ${NC}")"
echo -e "${BLUE}Tests de performance:${NC} $([ $PERFORMANCE_RESULT -eq 0 ] && echo -e "${GREEN}✅ PASSÉ${NC}" || echo -e "${RED}❌ ÉCHOUÉ${NC}")"
echo -e "${BLUE}Tests de régression:${NC} $([ $REGRESSION_RESULT -eq 0 ] && echo -e "${GREEN}✅ PASSÉ${NC}" || echo -e "${RED}❌ ÉCHOUÉ${NC}")"

echo -e "\n${BLUE}Score global:${NC} $PASSED_TESTS/$TOTAL_TESTS"

# Déterminer le statut final
if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "\n${GREEN}🎉 Tous les tests sont passés avec succès !${NC}"
    echo -e "${GREEN}✨ Les animations au scroll sont prêtes pour la production.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Certains tests ont échoué. Veuillez les corriger avant de continuer.${NC}"
    exit 1
fi
