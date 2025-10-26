import { accountFormSchema } from '@/lib/validation'

describe('validation', () => {
  describe('accountFormSchema', () => {
    const validData = {
      companyName: 'Test Company',
      siret: '12345678901234',
      email: 'test@example.com',
      phone: '0123456789',
      address: '123 Test Street',
      postalCode: '75001',
      city: 'Paris',
      legalDocument: new File(['test'], 'test.pdf', { type: 'application/pdf' }),
      signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    }

    it('valide des données correctes', () => {
      const result = accountFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    describe('companyName', () => {
      it('refuse un nom trop court', () => {
        const data = { ...validData, companyName: 'A' }
        const result = accountFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('refuse un nom trop long', () => {
        const data = { ...validData, companyName: 'A'.repeat(101) }
        const result = accountFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('siret', () => {
      it('refuse un SIRET invalide', () => {
        const data = { ...validData, siret: '123' }
        const result = accountFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('refuse un SIRET avec des lettres', () => {
        const data = { ...validData, siret: '1234567890123A' }
        const result = accountFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('email', () => {
      it('refuse un email invalide', () => {
        const data = { ...validData, email: 'invalid-email' }
        const result = accountFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('phone', () => {
      it('accepte différents formats de téléphone français', () => {
        const formats = [
          '0123456789',
          '01 23 45 67 89',
          '01.23.45.67.89',
          '01-23-45-67-89',
        ]

        formats.forEach((phone) => {
          const data = { ...validData, phone }
          const result = accountFormSchema.safeParse(data)
          expect(result.success).toBe(true)
        })
      })

      it('refuse un numéro invalide', () => {
        const data = { ...validData, phone: '123' }
        const result = accountFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('postalCode', () => {
      it('refuse un code postal invalide', () => {
        const data = { ...validData, postalCode: '123' }
        const result = accountFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('signature', () => {
      it('refuse une signature vide', () => {
        const data = { ...validData, signature: '' }
        const result = accountFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('refuse une signature qui n\'est pas une image', () => {
        const data = { ...validData, signature: 'invalid-signature' }
        const result = accountFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })
  })
})

