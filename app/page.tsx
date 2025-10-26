'use client'

import { useState } from 'react'
import { AccountForm } from '@/components/account-form'
import { LandingPage } from '@/components/landing-page'

export default function Home() {
  const [showForm, setShowForm] = useState(false)

  const handleLogoClick = () => {
    setShowForm(false)
  }

  if (!showForm) {
    return <LandingPage onStart={() => setShowForm(true)} onLogoClick={handleLogoClick} />
  }

  return <AccountForm onBack={() => setShowForm(false)} onLogoClick={handleLogoClick} />
}
