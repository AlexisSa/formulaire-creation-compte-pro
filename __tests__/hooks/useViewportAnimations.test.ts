import { renderHook, act } from '@testing-library/react'
import {
  useViewportAnimation,
  useViewportStagger,
  useViewportCounter,
  useViewportReveal,
  useViewportScale,
} from '@/hooks/useViewportAnimations'

// Mock IntersectionObserver
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

let intersectionCallback: (entries: any[]) => void

const mockIntersectionObserver = jest.fn().mockImplementation((callback, options) => {
  intersectionCallback = callback
  return {
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }
})

// Mock requestAnimationFrame
const mockRequestAnimationFrame = jest.fn()
const mockCancelAnimationFrame = jest.fn()

// Mock setTimeout/clearTimeout
const mockSetTimeout = jest.fn()
const mockClearTimeout = jest.fn()

// Setup global mocks
global.IntersectionObserver = mockIntersectionObserver
global.requestAnimationFrame = mockRequestAnimationFrame
global.cancelAnimationFrame = mockCancelAnimationFrame
global.setTimeout = mockSetTimeout
global.clearTimeout = mockClearTimeout

describe('useViewportAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation((cb) => setTimeout(cb, 16))
    mockSetTimeout.mockImplementation((cb) => setTimeout(cb, 0))
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useViewportAnimation())

    expect(result.current.ref).toBeDefined()
    expect(result.current.isInView).toBe(false)
    expect(result.current.hasAnimated).toBe(false)
  })

  it('should accept custom options', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
      triggerOnce: false,
      delay: 100,
    }

    const { result } = renderHook(() => useViewportAnimation(options))

    expect(result.current.ref).toBeDefined()
    expect(result.current.isInView).toBe(false)
    expect(result.current.hasAnimated).toBe(false)
  })

  it('should create IntersectionObserver with correct options', () => {
    const options = {
      threshold: 0.3,
      rootMargin: '20px',
    }

    renderHook(() => useViewportAnimation(options))

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.3,
      rootMargin: '20px',
    })
  })

  it('should handle intersection callback correctly', () => {
    const { result } = renderHook(() => useViewportAnimation())

    // Simulate element entering viewport
    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)
    expect(result.current.hasAnimated).toBe(true)
  })

  it('should handle delay correctly', () => {
    const { result } = renderHook(() => useViewportAnimation({ delay: 100 }))

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 100)
  })

  it('should cleanup observer on unmount', () => {
    const { unmount } = renderHook(() => useViewportAnimation())

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })
})

describe('useViewportStagger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSetTimeout.mockImplementation((cb) => setTimeout(cb, 0))
  })

  it('should initialize with empty visibleItems', () => {
    const { result } = renderHook(() => useViewportStagger(3))

    expect(result.current.ref).toBeDefined()
    expect(result.current.isInView).toBe(false)
    expect(result.current.visibleItems).toEqual([])
  })

  it('should trigger stagger animation when in view', () => {
    const { result } = renderHook(() => useViewportStagger(3, 50))

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)
    expect(mockSetTimeout).toHaveBeenCalledTimes(3)
  })

  it('should respect staggerDelay', () => {
    const { result } = renderHook(() => useViewportStagger(2, 100))

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 0)
    expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 100)
  })

  it('should not trigger animation if already visible', () => {
    const { result } = renderHook(() => useViewportStagger(3))

    // First intersection
    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    const firstCallCount = mockSetTimeout.mock.calls.length

    // Second intersection
    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(mockSetTimeout.mock.calls.length).toBe(firstCallCount)
  })
})

describe('useViewportCounter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation((cb) => setTimeout(cb, 16))
    mockSetTimeout.mockImplementation((cb) => setTimeout(cb, 0))
  })

  it('should initialize with count 0', () => {
    const { result } = renderHook(() => useViewportCounter(100))

    expect(result.current.ref).toBeDefined()
    expect(result.current.isInView).toBe(false)
    expect(result.current.count).toBe(0)
    expect(result.current.isAnimating).toBe(false)
  })

  it('should animate counter when in view', () => {
    const { result } = renderHook(() => useViewportCounter(100, 1000))

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)
    expect(result.current.isAnimating).toBe(true)
    expect(mockRequestAnimationFrame).toHaveBeenCalled()
  })

  it('should not animate if already animating', () => {
    const { result } = renderHook(() => useViewportCounter(100))

    // First intersection
    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    const firstCallCount = mockRequestAnimationFrame.mock.calls.length

    // Second intersection
    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(mockRequestAnimationFrame.mock.calls.length).toBe(firstCallCount)
  })

  it('should respect duration parameter', () => {
    const { result } = renderHook(() => useViewportCounter(100, 2000))

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(result.current.isAnimating).toBe(true)
  })
})

describe('useViewportReveal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with correct transform values for up direction', () => {
    const { result } = renderHook(() => useViewportReveal('up', 50))

    expect(result.current.ref).toBeDefined()
    expect(result.current.isInView).toBe(false)
    expect(result.current.initialTransform).toEqual({ y: 50, x: 0 })
    expect(result.current.animateTransform).toEqual({ x: 0, y: 0 })
  })

  it('should initialize with correct transform values for down direction', () => {
    const { result } = renderHook(() => useViewportReveal('down', 30))

    expect(result.current.initialTransform).toEqual({ y: -30, x: 0 })
    expect(result.current.animateTransform).toEqual({ x: 0, y: 0 })
  })

  it('should initialize with correct transform values for left direction', () => {
    const { result } = renderHook(() => useViewportReveal('left', 40))

    expect(result.current.initialTransform).toEqual({ y: 0, x: 40 })
    expect(result.current.animateTransform).toEqual({ x: 0, y: 0 })
  })

  it('should initialize with correct transform values for right direction', () => {
    const { result } = renderHook(() => useViewportReveal('right', 60))

    expect(result.current.initialTransform).toEqual({ y: 0, x: -60 })
    expect(result.current.animateTransform).toEqual({ x: 0, y: 0 })
  })

  it('should handle intersection correctly', () => {
    const { result } = renderHook(() => useViewportReveal('up', 50))

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)
  })
})

describe('useViewportScale', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with correct scale values', () => {
    const { result } = renderHook(() => useViewportScale(0.5, 1.2))

    expect(result.current.ref).toBeDefined()
    expect(result.current.isInView).toBe(false)
    expect(result.current.initialScale).toBe(0.5)
    expect(result.current.animateScale).toBe(1.2)
  })

  it('should use default scale values', () => {
    const { result } = renderHook(() => useViewportScale())

    expect(result.current.initialScale).toBe(0.8)
    expect(result.current.animateScale).toBe(1)
  })

  it('should handle intersection correctly', () => {
    const { result } = renderHook(() => useViewportScale(0.8, 1))

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    expect(result.current.isInView).toBe(true)
  })
})

describe('Performance Tests', () => {
  it('should not cause memory leaks', () => {
    const { unmount } = renderHook(() => useViewportAnimation())

    // Simulate multiple mount/unmount cycles
    for (let i = 0; i < 100; i++) {
      const { unmount: tempUnmount } = renderHook(() => useViewportAnimation())
      tempUnmount()
    }

    unmount()

    // Verify cleanup functions were called
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(101)
  })

  it('should handle rapid intersection changes efficiently', () => {
    const { result } = renderHook(() => useViewportAnimation())

    const startTime = performance.now()

    // Simulate rapid intersection changes
    for (let i = 0; i < 1000; i++) {
      act(() => {
        intersectionCallback([{ isIntersecting: i % 2 === 0 }])
      })
    }

    const endTime = performance.now()
    const duration = endTime - startTime

    // Should complete within reasonable time (less than 100ms)
    expect(duration).toBeLessThan(100)
  })

  it('should handle large number of elements efficiently', () => {
    const { result } = renderHook(() => useViewportStagger(1000, 1))

    expect(result.current.ref).toBeDefined()
    expect(result.current.visibleItems).toEqual([])

    // Should not cause performance issues
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
  })
})

describe('Edge Cases', () => {
  it('should handle zero threshold', () => {
    const { result } = renderHook(() => useViewportAnimation({ threshold: 0 }))

    expect(result.current.ref).toBeDefined()
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0 })
    )
  })

  it('should handle negative delay', () => {
    const { result } = renderHook(() => useViewportAnimation({ delay: -100 }))

    expect(result.current.ref).toBeDefined()
    // Should still work with negative delay
  })

  it('should handle very large delay', () => {
    const { result } = renderHook(() => useViewportAnimation({ delay: 100000 }))

    expect(result.current.ref).toBeDefined()
  })

  it('should handle zero item count in stagger', () => {
    const { result } = renderHook(() => useViewportStagger(0))

    expect(result.current.ref).toBeDefined()
    expect(result.current.visibleItems).toEqual([])
  })

  it('should handle zero target value in counter', () => {
    const { result } = renderHook(() => useViewportCounter(0))

    expect(result.current.ref).toBeDefined()
    expect(result.current.count).toBe(0)
  })

  it('should handle zero distance in reveal', () => {
    const { result } = renderHook(() => useViewportReveal('up', 0))

    expect(result.current.initialTransform).toEqual({ y: 0, x: 0 })
  })

  it('should handle zero scale values', () => {
    const { result } = renderHook(() => useViewportScale(0, 0))

    expect(result.current.initialScale).toBe(0)
    expect(result.current.animateScale).toBe(0)
  })
})
