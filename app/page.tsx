'use client'

import { useState, useEffect } from 'react'
import { AccountForm } from '@/components/account-form'
import { LandingPage } from '@/components/landing-page'

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogoClick = () => {
    setShowForm(false)
  }

  if (!isMounted) {
    return null
  }

  if (!showForm) {
    return <LandingPage onStart={() => setShowForm(true)} onLogoClick={handleLogoClick} />
  }

  return <AccountForm onBack={() => setShowForm(false)} onLogoClick={handleLogoClick} />
}
