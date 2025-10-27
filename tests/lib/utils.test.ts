import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('fusionne plusieurs classes CSS', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('gère les classes conditionnelles', () => {
      const result = cn('base', true && 'truthy', false && 'falsy')
      expect(result).toBe('base truthy')
    })

    it('gère les classes Tailwind conflictuelles', () => {
      const result = cn('px-2', 'px-4')
      expect(result).toBe('px-4')
    })

    it('accepte les tableaux et objets', () => {
      const result = cn(['class1', 'class2'], { active: true, disabled: false })
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('active')
      expect(result).not.toContain('disabled')
    })
  })
})

