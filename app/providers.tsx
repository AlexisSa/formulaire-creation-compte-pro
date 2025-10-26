'use client'

import { ToastProvider } from '@/contexts/ToastContext'
import { ToastList } from '@/components/ui/feedback'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastList />
    </ToastProvider>
  )
}
