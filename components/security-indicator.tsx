'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Lock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SecurityStatus {
  csrf: boolean
  encryption: boolean
  rateLimit: boolean
  validation: boolean
  overall: boolean
}

interface SecurityIndicatorProps {
  className?: string
  showDetails?: boolean
  compact?: boolean
}

/**
 * Composant d'indicateur de sécurité pour l'interface utilisateur
 */
export function SecurityIndicator({
  className,
  showDetails = false,
  compact = false,
}: SecurityIndicatorProps) {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    csrf: false,
    encryption: false,
    rateLimit: false,
    validation: false,
    overall: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  /**
   * Vérifie le statut de sécurité
   */
  const checkSecurityStatus = async () => {
    try {
      setIsLoading(true)

      // Vérifier le token CSRF
      const csrfResponse = await fetch('/api/csrf/validate', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const csrfValid = csrfResponse.ok

      // Vérifier la configuration de sécurité
      const configResponse = await fetch('/api/security/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const configData = configResponse.ok ? await configResponse.json() : null

      setSecurityStatus({
        csrf: csrfValid,
        encryption: configData?.encryption || false,
        rateLimit: configData?.rateLimit || false,
        validation: configData?.validation || false,
        overall: csrfValid && configData?.overall,
      })

      setLastChecked(new Date())
    } catch (error) {
      console.error('Erreur lors de la vérification de sécurité:', error)
      setSecurityStatus({
        csrf: false,
        encryption: false,
        rateLimit: false,
        validation: false,
        overall: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSecurityStatus()

    // Vérifier périodiquement (toutes les 5 minutes)
    const interval = setInterval(checkSecurityStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  /**
   * Composant d'icône de statut
   */
  const StatusIcon = ({ status }: { status: boolean }) => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }

    if (status) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }

    return <AlertTriangle className="h-4 w-4 text-red-500" />
  }

  /**
   * Composant compact
   */
  if (compact) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Shield className="h-4 w-4 text-blue-600" />
        <StatusIcon status={securityStatus.overall} />
        <span className="text-sm text-gray-600">
          {securityStatus.overall ? 'Sécurisé' : 'Non sécurisé'}
        </span>
      </div>
    )
  }

  /**
   * Composant détaillé
   */
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-900">Statut de sécurité</h3>
        </div>
        <StatusIcon status={securityStatus.overall} />
      </div>

      {showDetails && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Protection CSRF</span>
            </div>
            <StatusIcon status={securityStatus.csrf} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Chiffrement des données</span>
            </div>
            <StatusIcon status={securityStatus.encryption} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Limitation de taux</span>
            </div>
            <StatusIcon status={securityStatus.rateLimit} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Validation des données</span>
            </div>
            <StatusIcon status={securityStatus.validation} />
          </div>
        </div>
      )}

      {lastChecked && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Dernière vérification: {lastChecked.toLocaleTimeString()}
          </p>
        </div>
      )}

      {!securityStatus.overall && !isLoading && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">Problème de sécurité détecté</span>
          </div>
          <button
            onClick={checkSecurityStatus}
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            Vérifier à nouveau
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Composant de badge de sécurité
 */
export function SecurityBadge({
  status,
  className,
}: {
  status: 'secure' | 'warning' | 'error'
  className?: string
}) {
  const variants = {
    secure: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
    },
    error: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
    },
  }

  const variant = variants[status]
  const Icon = variant.icon

  return (
    <div
      className={cn(
        'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
        variant.bg,
        variant.border,
        variant.text,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>
        {status === 'secure' && 'Sécurisé'}
        {status === 'warning' && 'Attention'}
        {status === 'error' && 'Erreur'}
      </span>
    </div>
  )
}

/**
 * Composant de notification de sécurité
 */
export function SecurityNotification({
  type,
  message,
  onDismiss,
}: {
  type: 'info' | 'warning' | 'error'
  message: string
  onDismiss?: () => void
}) {
  const variants = {
    info: {
      icon: Shield,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
    },
    error: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
  }

  const variant = variants[type]
  const Icon = variant.icon

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-4 rounded-lg border',
        variant.bg,
        variant.border
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5', variant.color)} />
      <div className="flex-1">
        <p className={cn('text-sm font-medium', variant.color)}>{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn('text-sm font-medium hover:underline', variant.color)}
        >
          Fermer
        </button>
      )}
    </div>
  )
}
