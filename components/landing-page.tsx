'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  RevealOnScroll,
  StaggerOnScroll,
  FadeOnScroll,
} from '@/components/ui/simple-viewport-animations'
import {
  ArrowRight,
  Star,
  Users,
  Award,
  Store,
  ChevronDown,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'

interface LandingPageProps {
  onStart: () => void
  onLogoClick?: () => void
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left group hover:text-blue-600 transition-colors duration-300"
        style={{
          outline: 'none',
          boxShadow: 'none',
          backgroundColor: 'transparent',
        }}
        onFocus={(e) => {
          const target = e.target as HTMLElement
          target.style.outline = 'none'
          target.style.boxShadow = 'none'
        }}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement
          target.style.outline = 'none'
          target.style.boxShadow = 'none'
          target.style.backgroundColor = 'transparent'
        }}
      >
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 pr-8 transition-colors duration-300">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 group-hover:text-blue-600 transition-colors duration-300" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-8 pb-8 text-gray-600 font-light leading-relaxed">{answer}</div>
      </motion.div>
    </div>
  )
}

export function LandingPage({ onStart, onLogoClick }: LandingPageProps) {
  const testimonials = [
    {
      name: 'Marie Dubois',
      company: 'SARL TechnoSolutions',
      content:
        'XEILOM a transformé notre infrastructure réseau. Service impeccable et équipe très professionnelle.',
      rating: 5,
    },
    {
      name: 'Jean Martin',
      company: 'Groupe Industriel Pro',
      content:
        'Intervention rapide et solution adaptée à nos besoins. Je recommande vivement leurs services.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={onLogoClick}
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <Image
                src="/xeilom-logo.png"
                alt="Xeilom - Distributeur et fabricant courant faible"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </button>
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 px-4 py-2 rounded-lg transition-all duration-300"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = 'https://www.xeilom.fr'
                  link.target = '_blank'
                  link.rel = 'noopener noreferrer'
                  link.click()
                }}
              >
                <Store className="h-4 w-4" />
                Notre boutique
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <section className="pt-20 md:pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Label discret en haut */}
            <motion.div
              className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-blue-50 rounded-full mb-12 md:mb-14"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-sm font-medium text-blue-900">
                Distributeur et fabricant courant faible{' '}
              </span>
            </motion.div>

            {/* Titre principal sur une seule ligne */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Votre partenaire <span className="text-blue-600">courant faible</span>
            </motion.h1>

            {/* Description centrée */}
            <motion.p
              className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Une équipe dédiée, des conditions de paiement flexibles et une tarification
              avantageuse pour accompagner vos projets professionnels.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              className="flex items-center justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button onClick={onStart} size="lg">
                Créer mon compte pro
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Cards - 3 cartes horizontales */}
        <section id="features" className="pb-32 pt-0">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: 'Équipe dédiée',
                description:
                  'Un interlocuteur unique qui connaît vos besoins et vous accompagne à chaque étape.',
              },
              {
                icon: Clock,
                title: 'Paiement 30 jours',
                description:
                  'Conditions de paiement flexibles pour faciliter la gestion de votre trésorerie.',
              },
              {
                icon: TrendingUp,
                title: 'Tarifs préférentiels',
                description:
                  'Bénéficiez de prix compétitifs grâce à notre réseau et notre expertise.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="h-full p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-md flex flex-col"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight flex-shrink-0">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-24">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl font-light text-gray-900 mb-6 tracking-tight"
              >
                Créez votre compte en quelques minutes
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-600 font-light"
              >
                Un processus simple en 3 étapes
              </motion.p>
            </div>

            <div className="relative">
              <motion.div
                className="hidden md:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent z-0 origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0 }}
              />

              <div className="grid md:grid-cols-3 gap-16 relative z-10">
                {[
                  {
                    step: '1',
                    title: 'Informations',
                    description: 'Renseignez vos coordonnées',
                    color: 'blue',
                  },
                  {
                    step: '2',
                    title: 'Documents',
                    description: 'Ajoutez vos pièces justificatives',
                    color: 'emerald',
                  },
                  {
                    step: '3',
                    title: 'Validation',
                    description: 'Compte actif sous 48h',
                    color: 'orange',
                  },
                ].map((item, index) => {
                  const colorMap = {
                    blue: {
                      border: 'border-blue-500',
                      text: 'text-blue-600',
                      hover: 'group-hover:border-blue-600',
                    },
                    emerald: {
                      border: 'border-emerald-500',
                      text: 'text-emerald-600',
                      hover: 'group-hover:border-emerald-600',
                    },
                    orange: {
                      border: 'border-orange-500',
                      text: 'text-orange-600',
                      hover: 'group-hover:border-orange-600',
                    },
                  }
                  const colors = colorMap[item.color as 'blue' | 'emerald' | 'orange']

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.4,
                        delay: 0 + index * 0.1,
                      }}
                      className="flex flex-col items-center text-center group"
                    >
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.15 + index * 0.1,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        className={`w-32 h-32 rounded-full bg-white border-2 ${colors.border} flex items-center justify-center mb-8 ${colors.hover} transition-all duration-300 shadow-sm hover:shadow-md`}
                      >
                        <span className={`text-5xl font-light ${colors.text}`}>
                          {item.step}
                        </span>
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.3, delay: 0.25 + index * 0.1 }}
                        className={`text-2xl font-medium ${colors.text} mb-4 tracking-tight`}
                      >
                        {item.title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="text-base text-gray-600 font-light max-w-xs"
                      >
                        {item.description}
                      </motion.p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="my-32 py-24 bg-gray-50 rounded-3xl">
          <div className="max-w-5xl mx-auto px-12">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl font-light text-gray-900 mb-6 tracking-tight"
              >
                Ce que disent nos clients
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-600 font-light"
              >
                Découvrez les retours de nos clients professionnels
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-700 mb-8 font-light leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">{testimonial.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl font-light text-gray-900 mb-6 tracking-tight"
              >
                Questions fréquentes
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-600 font-light"
              >
                Tout ce que vous devez savoir sur votre compte professionnel
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            >
              <FAQItem
                question="Combien de temps faut-il pour créer un compte professionnel ?"
                answer="Votre compte sera actif sous 48h après validation de vos documents. Vous recevrez un email de confirmation une fois votre compte validé."
              />
              <FAQItem
                question="Quels documents sont nécessaires ?"
                answer="Vous devez fournir votre KBIS, un justificatif d'identité du dirigeant, et un justificatif de domicile. Tous les documents doivent être récents (moins de 3 mois)."
              />
              <FAQItem
                question="Le compte professionnel est-il payant ?"
                answer="Non, la création de compte est entièrement gratuite. Vous bénéficiez simplement de tarifs préférentiels, d'une équipe dédiée et de conditions de paiement avantageuses."
              />
              <FAQItem
                question="Puis-je commander immédiatement après la création du compte ?"
                answer="Oui, dès l'activation de votre compte, vous pouvez passer commande et bénéficier immédiatement de nos tarifs professionnels et des conditions de paiement à 30 jours."
              />
              <FAQItem
                question="Que se passe-t-il si ma demande est refusée ?"
                answer="Si votre dossier est incomplet, notre équipe vous contactera par email pour vous aider à compléter les informations manquantes. Dans la plupart des cas, il suffit d'ajouter un document manquant."
              />
              <FAQItem
                question="Y a-t-il un minimum de commande requis ?"
                answer="Non, aucune commande minimum n'est requise. Vous pouvez commander des produits individuellement selon vos besoins, tout en bénéficiant des tarifs professionnels."
              />
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-32">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl font-light text-gray-900 mb-8 tracking-tight"
            >
              Prêt à commencer ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl text-gray-600 mb-12 font-light leading-relaxed"
            >
              Créez votre compte en quelques minutes
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button onClick={onStart} size="lg">
                Créer mon compte professionnel
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-3 font-light">
              Une question ? Notre équipe est là
            </p>
            <a
              href="mailto:info.xeilom@xeilom.fr"
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors no-underline"
            >
              info.xeilom@xeilom.fr
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
