import { renderHook } from '@testing-library/react'

// Test simple pour vérifier que Jest fonctionne
describe('Basic Test Suite', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })

  it('should handle numbers correctly', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle strings correctly', () => {
    expect('hello').toBe('hello')
  })

  it('should handle arrays correctly', () => {
    expect([1, 2, 3]).toEqual([1, 2, 3])
  })

  it('should handle objects correctly', () => {
    expect({ name: 'test' }).toEqual({ name: 'test' })
  })
})

// Test pour vérifier que renderHook fonctionne
describe('React Testing Library', () => {
  it('should render hook without errors', () => {
    const { result } = renderHook(() => {
      return { test: 'value' }
    })

    expect(result.current.test).toBe('value')
  })
})
