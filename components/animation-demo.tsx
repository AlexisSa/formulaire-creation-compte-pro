'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  StepTransition,
  SlideTransition,
  PulseAnimation,
} from '@/components/ui/step-transition'
import {
  AdvancedProgress,
  CircularProgress,
  SkeletonLoader,
} from '@/components/ui/advanced-progress'
import { Toast, ToastContainer, InteractionFeedback } from '@/components/ui/feedback'
import {
  useAnimation,
  useProgressAnimation,
  useStaggerAnimation,
  useParticleAnimation,
} from '@/hooks/useAnimations'
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react'

/**
 * Composant de démonstration des animations et feedback visuels
 */
export function AnimationDemo() {
  const [currentDemo, setCurrentDemo] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>(
    'success'
  )
  const [isVisible, setIsVisible] = useState(false)
  const [feedback, setFeedback] = useState<'success' | 'error' | 'loading' | undefined>()
  const [progress, setProgress] = useState(0)

  // Hooks d'animation
  const { isAnimating, triggerAnimation } = useAnimation({ duration: 1000 })
  const { progress: animatedProgress, animateTo } = useProgressAnimation(0)
  const { visibleItems, triggerStagger } = useStaggerAnimation(5, 200)
  const { particles, createParticles, clearParticles } = useParticleAnimation()

  const demos = [
    {
      id: 1,
      title: "Transitions d'étapes",
      description: 'Animations fluides entre les étapes',
    },
    {
      id: 2,
      title: 'Progression avancée',
      description: 'Indicateurs de progression sophistiqués',
    },
    { id: 3, title: 'Feedback visuel', description: 'Notifications et interactions' },
    { id: 4, title: 'Animations personnalisées', description: 'Hooks et effets avancés' },
  ]

  const progressSteps = [
    {
      id: 1,
      title: 'Étape 1',
      description: 'Initialisation',
      status: 'completed' as const,
    },
    { id: 2, title: 'Étape 2', description: 'En cours', status: 'current' as const },
    { id: 3, title: 'Étape 3', description: 'À venir', status: 'upcoming' as const },
    { id: 4, title: 'Étape 4', description: 'Finalisation', status: 'upcoming' as const },
  ]

  const handleDemoChange = (direction: 'forward' | 'backward') => {
    if (direction === 'forward' && currentDemo < demos.length) {
      setCurrentDemo(currentDemo + 1)
    } else if (direction === 'backward' && currentDemo > 1) {
      setCurrentDemo(currentDemo - 1)
    }
  }

  const showToastDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 5000)
  }

  const handleFeedbackDemo = (type: 'success' | 'error' | 'loading') => {
    setFeedback(type)
    setTimeout(() => setFeedback(undefined), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Démonstration des Animations UX/UI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les nouvelles animations fluides et les indicateurs de progression
            améliorés
          </p>
        </motion.div>

        {/* Navigation des démos */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center gap-4 mb-6">
            {demos.map((demo) => (
              <Button
                key={demo.id}
                variant={currentDemo === demo.id ? 'default' : 'outline'}
                onClick={() => setCurrentDemo(demo.id)}
                className="transition-all duration-300"
              >
                {demo.title}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Contenu des démos */}
        <StepTransition stepKey={currentDemo} direction="forward" className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {demos[currentDemo - 1].title}
              </CardTitle>
              <p className="text-center text-gray-600">
                {demos[currentDemo - 1].description}
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {/* Demo 1: Transitions d'étapes */}
              {currentDemo === 1 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Transitions fluides</h3>
                    <SlideTransition
                      isVisible={isVisible}
                      direction="up"
                      className="mb-6"
                    >
                      <div className="bg-blue-50 rounded-lg p-6">
                        <p className="text-blue-800">
                          Ce contenu apparaît avec une animation de glissement fluide
                        </p>
                      </div>
                    </SlideTransition>
                    <Button onClick={() => setIsVisible(!isVisible)}>
                      {isVisible ? 'Masquer' : 'Afficher'} le contenu
                    </Button>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Animation de pulsation</h3>
                    <PulseAnimation intensity="medium">
                      <div className="bg-green-50 rounded-lg p-6 inline-block">
                        <p className="text-green-800 font-medium">
                          ✨ Élément avec animation de respiration
                        </p>
                      </div>
                    </PulseAnimation>
                  </div>
                </div>
              )}

              {/* Demo 2: Progression avancée */}
              {currentDemo === 2 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-center">
                      Progression avancée
                    </h3>
                    <AdvancedProgress
                      steps={progressSteps}
                      currentStep={2}
                      className="mb-8"
                    />
                  </div>

                  <div className="flex justify-center gap-8">
                    <div className="text-center">
                      <h4 className="font-semibold mb-4">Progression circulaire</h4>
                      <CircularProgress
                        progress={animatedProgress}
                        size={120}
                        className="mb-4"
                      />
                      <Button
                        onClick={() => animateTo(Math.random() * 100, 1000)}
                        size="sm"
                      >
                        Animer
                      </Button>
                    </div>

                    <div className="text-center">
                      <h4 className="font-semibold mb-4">Skeleton loader</h4>
                      <SkeletonLoader lines={3} className="w-48" />
                    </div>
                  </div>
                </div>
              )}

              {/* Demo 3: Feedback visuel */}
              {currentDemo === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-6">Notifications Toast</h3>
                    <div className="flex justify-center gap-4 mb-8">
                      <Button onClick={() => showToastDemo('success')} variant="outline">
                        Succès
                      </Button>
                      <Button onClick={() => showToastDemo('error')} variant="outline">
                        Erreur
                      </Button>
                      <Button onClick={() => showToastDemo('warning')} variant="outline">
                        Avertissement
                      </Button>
                      <Button onClick={() => showToastDemo('info')} variant="outline">
                        Information
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-6">
                      Feedback d&apos;interaction
                    </h3>
                    <div className="flex justify-center gap-4">
                      <InteractionFeedback feedback={feedback}>
                        <Button onClick={() => handleFeedbackDemo('success')}>
                          Succès
                        </Button>
                      </InteractionFeedback>
                      <InteractionFeedback feedback={feedback}>
                        <Button
                          onClick={() => handleFeedbackDemo('error')}
                          variant="destructive"
                        >
                          Erreur
                        </Button>
                      </InteractionFeedback>
                      <InteractionFeedback feedback={feedback}>
                        <Button
                          onClick={() => handleFeedbackDemo('loading')}
                          variant="outline"
                        >
                          Chargement
                        </Button>
                      </InteractionFeedback>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo 4: Animations personnalisées */}
              {currentDemo === 4 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-6">Hooks d&apos;animation</h3>
                    <div className="flex justify-center gap-4 mb-8">
                      <Button
                        onClick={triggerAnimation}
                        disabled={isAnimating}
                        className="transition-all duration-300"
                      >
                        {isAnimating ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        Animation
                      </Button>
                      <Button onClick={triggerStagger} variant="outline">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Stagger
                      </Button>
                      <Button
                        onClick={() => createParticles(10, 200, 200)}
                        variant="outline"
                      >
                        Particules
                      </Button>
                      <Button onClick={clearParticles} variant="outline">
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      Éléments avec animation stagger
                    </h3>
                    <div className="flex justify-center gap-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: visibleItems.includes(index) ? 1 : 0,
                            scale: visibleItems.includes(index) ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
                        >
                          {index + 1}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Particules */}
                  <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                    {particles.map((particle) => (
                      <motion.div
                        key={particle.id}
                        className="absolute w-2 h-2 bg-blue-500 rounded-full"
                        style={{
                          left: particle.x,
                          top: particle.y,
                          opacity: particle.life,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </StepTransition>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => handleDemoChange('backward')}
            disabled={currentDemo === 1}
            variant="outline"
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            {currentDemo} / {demos.length}
          </span>
          <Button
            onClick={() => handleDemoChange('forward')}
            disabled={currentDemo === demos.length}
            variant="outline"
          >
            Suivant
          </Button>
        </div>

        {/* Toast Container */}
        <ToastContainer>
          {showToast && (
            <Toast
              type={toastType}
              title={`Notification ${toastType}`}
              message={`Ceci est un exemple de notification ${toastType}`}
              onClose={() => setShowToast(false)}
            />
          )}
        </ToastContainer>
      </div>
    </div>
  )
}
