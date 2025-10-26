'use client'

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface SignaturePadRef {
  clear: () => void
  toDataURL: () => string
  isEmpty: () => boolean
}

interface SignaturePadProps {
  label?: string
  error?: string
  onSignatureChange?: (signature: string) => void
  onSave?: (signature: string) => void
  className?: string
}

/**
 * Composant de signature accessible avec canvas
 */
export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ label = 'Signature', error, onSignatureChange, onSave, className }, ref) => {
    const sigCanvas = useRef<SignatureCanvas>(null)

    useImperativeHandle(ref, () => ({
      clear: () => {
        sigCanvas.current?.clear()
        onSignatureChange?.('')
        onSave?.('')
      },
      toDataURL: () => {
        return sigCanvas.current?.toDataURL() || ''
      },
      isEmpty: () => {
        return sigCanvas.current?.isEmpty() || true
      },
    }))

    const handleClear = () => {
      sigCanvas.current?.clear()
      onSignatureChange?.('')
      onSave?.('')
    }

    const handleEnd = () => {
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        const dataURL = sigCanvas.current.toDataURL()
        onSignatureChange?.(dataURL)
        onSave?.(dataURL)
      }
    }

    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor="signature-canvas">{label}</Label>
        <div
          className={cn(
            'border-2 rounded-md bg-white',
            error ? 'border-destructive' : 'border-input'
          )}
        >
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              id: 'signature-canvas',
              className: 'w-full h-40',
              'aria-label': 'Zone de signature',
              role: 'img',
            }}
            onEnd={handleEnd}
          />
        </div>
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            aria-label="Effacer la signature"
          >
            Effacer
          </Button>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    )
  }
)

SignaturePad.displayName = 'SignaturePad'
