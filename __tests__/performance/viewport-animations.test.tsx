import React from 'react'
import { render, act } from '@testing-library/react'
import { performance } from 'perf_hooks'
import {
  ViewportReveal,
  ViewportStagger,
  ViewportCounter,
  ViewportFade,
  ViewportSlide,
  ViewportScale,
} from '@/components/ui/simple-viewport-animations'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

let intersectionCallback: (entries: any[]) => void

mockIntersectionObserver.mockImplementation((callback, options) => {
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

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('Performance Tests - Rendering Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation((cb) => setTimeout(cb, 16))
    mockSetTimeout.mockImplementation((cb) => setTimeout(cb, 0))
  })

  it('should render ViewportReveal within performance budget', () => {
    const startTime = performance.now()

    render(
      <ViewportReveal>
        <div>Performance test content</div>
      </ViewportReveal>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render within 10ms
    expect(renderTime).toBeLessThan(10)
  })

  it('should render ViewportStagger efficiently with many children', () => {
    const manyItems = Array.from({ length: 1000 }, (_, i) => (
      <div key={i}>Item {i + 1}</div>
    ))

    const startTime = performance.now()

    render(<ViewportStagger>{manyItems}</ViewportStagger>)

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render 1000 items within 50ms
    expect(renderTime).toBeLessThan(50)
  })

  it('should render ViewportCounter efficiently', () => {
    const startTime = performance.now()

    render(<ViewportCounter targetValue={1000000} />)

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render within 5ms
    expect(renderTime).toBeLessThan(5)
  })

  it('should handle multiple components efficiently', () => {
    const startTime = performance.now()

    render(
      <div>
        <ViewportReveal>
          <div>Reveal 1</div>
        </ViewportReveal>
        <ViewportStagger>
          <div>Stagger 1</div>
          <div>Stagger 2</div>
        </ViewportStagger>
        <ViewportCounter targetValue={100} />
        <ViewportFade>
          <div>Fade 1</div>
        </ViewportFade>
        <ViewportSlide>
          <div>Slide 1</div>
        </ViewportSlide>
        <ViewportScale>
          <div>Scale 1</div>
        </ViewportScale>
      </div>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render all components within 20ms
    expect(renderTime).toBeLessThan(20)
  })

  it('should handle nested components efficiently', () => {
    const startTime = performance.now()

    render(
      <ViewportReveal>
        <ViewportStagger>
          <ViewportCounter targetValue={50} />
          <ViewportFade>
            <div>Nested content</div>
          </ViewportFade>
        </ViewportStagger>
      </ViewportReveal>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render nested components within 15ms
    expect(renderTime).toBeLessThan(15)
  })
})

describe('Performance Tests - Animation Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation((cb) => setTimeout(cb, 16))
    mockSetTimeout.mockImplementation((cb) => setTimeout(cb, 0))
  })

  it('should handle intersection changes efficiently', () => {
    const { rerender } = render(
      <ViewportReveal>
        <div>Test content</div>
      </ViewportReveal>
    )

    const startTime = performance.now()

    // Simulate rapid intersection changes
    for (let i = 0; i < 100; i++) {
      act(() => {
        intersectionCallback([{ isIntersecting: i % 2 === 0 }])
      })
    }

    const endTime = performance.now()
    const processingTime = endTime - startTime

    // Should process 100 intersection changes within 50ms
    expect(processingTime).toBeLessThan(50)
  })

  it('should handle stagger animations efficiently', () => {
    const manyItems = Array.from({ length: 100 }, (_, i) => (
      <div key={i}>Stagger item {i + 1}</div>
    ))

    render(<ViewportStagger staggerDelay={1}>{manyItems}</ViewportStagger>)

    const startTime = performance.now()

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    const endTime = performance.now()
    const animationTime = endTime - startTime

    // Should handle 100 stagger animations within 100ms
    expect(animationTime).toBeLessThan(100)
  })

  it('should handle counter animations efficiently', () => {
    render(<ViewportCounter targetValue={10000} duration={1000} />)

    const startTime = performance.now()

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    const endTime = performance.now()
    const animationTime = endTime - startTime

    // Should start counter animation within 10ms
    expect(animationTime).toBeLessThan(10)
  })

  it('should handle multiple simultaneous animations', () => {
    render(
      <div>
        <ViewportReveal>
          <div>Reveal animation</div>
        </ViewportReveal>
        <ViewportStagger>
          <div>Stagger 1</div>
          <div>Stagger 2</div>
          <div>Stagger 3</div>
        </ViewportStagger>
        <ViewportCounter targetValue={500} />
        <ViewportFade>
          <div>Fade animation</div>
        </ViewportFade>
      </div>
    )

    const startTime = performance.now()

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    const endTime = performance.now()
    const animationTime = endTime - startTime

    // Should handle multiple animations within 20ms
    expect(animationTime).toBeLessThan(20)
  })
})

describe('Performance Tests - Memory Management', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation((cb) => setTimeout(cb, 16))
    mockSetTimeout.mockImplementation((cb) => setTimeout(cb, 0))
  })

  it('should not cause memory leaks with multiple mounts/unmounts', () => {
    const initialObserverCount = mockIntersectionObserver.mock.calls.length

    // Mount and unmount multiple times
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(
        <ViewportReveal>
          <div>Memory test {i}</div>
        </ViewportReveal>
      )
      unmount()
    }

    const finalObserverCount = mockIntersectionObserver.mock.calls.length

    // Should create observers for each mount
    expect(finalObserverCount).toBe(initialObserverCount + 100)
  })

  it('should cleanup timers properly', () => {
    const { unmount } = render(
      <ViewportReveal delay={100}>
        <div>Timer test</div>
      </ViewportReveal>
    )

    const initialTimeoutCount = mockSetTimeout.mock.calls.length

    unmount()

    // Should cleanup timers on unmount
    expect(mockClearTimeout).toHaveBeenCalled()
  })

  it('should handle rapid prop changes without memory issues', () => {
    const { rerender } = render(<ViewportCounter targetValue={100} />)

    const startTime = performance.now()

    // Rapid prop changes
    for (let i = 0; i < 1000; i++) {
      rerender(<ViewportCounter targetValue={i} />)
    }

    const endTime = performance.now()
    const processingTime = endTime - startTime

    // Should handle rapid changes within 200ms
    expect(processingTime).toBeLessThan(200)
  })

  it('should handle large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      content: `Item ${i + 1}`,
    }))

    const startTime = performance.now()

    render(
      <ViewportStagger>
        {largeDataset.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
      </ViewportStagger>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render 10,000 items within 200ms
    expect(renderTime).toBeLessThan(200)
  })
})

describe('Performance Tests - Intersection Observer Efficiency', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create minimal number of observers', () => {
    render(
      <div>
        <ViewportReveal>
          <div>Observer 1</div>
        </ViewportReveal>
        <ViewportReveal>
          <div>Observer 2</div>
        </ViewportReveal>
        <ViewportStagger>
          <div>Observer 3</div>
        </ViewportStagger>
      </div>
    )

    // Should create exactly 3 observers
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(3)
  })

  it('should reuse observers when possible', () => {
    const { rerender } = render(
      <ViewportReveal threshold={0.1}>
        <div>Reusable observer</div>
      </ViewportReveal>
    )

    const initialCallCount = mockIntersectionObserver.mock.calls.length

    rerender(
      <ViewportReveal threshold={0.1}>
        <div>Same observer</div>
      </ViewportReveal>
    )

    // Should not create additional observers for same configuration
    expect(mockIntersectionObserver.mock.calls.length).toBe(initialCallCount)
  })

  it('should handle observer cleanup efficiently', () => {
    const { unmount } = render(
      <ViewportReveal>
        <div>Cleanup test</div>
      </ViewportReveal>
    )

    unmount()

    // Should call disconnect on unmount
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})

describe('Performance Tests - Animation Frame Efficiency', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation((cb) => setTimeout(cb, 16))
    mockSetTimeout.mockImplementation((cb) => setTimeout(cb, 0))
  })

  it('should use requestAnimationFrame efficiently', () => {
    render(<ViewportCounter targetValue={1000} duration={1000} />)

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    // Should use requestAnimationFrame for smooth animation
    expect(mockRequestAnimationFrame).toHaveBeenCalled()
  })

  it('should cancel animation frames when needed', () => {
    const { unmount } = render(<ViewportCounter targetValue={1000} duration={1000} />)

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    unmount()

    // Should cancel animation frames on unmount
    expect(mockCancelAnimationFrame).toHaveBeenCalled()
  })

  it('should handle animation frame cleanup', () => {
    const { rerender } = render(<ViewportCounter targetValue={100} />)

    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })

    const initialCancelCount = mockCancelAnimationFrame.mock.calls.length

    rerender(<ViewportCounter targetValue={200} />)

    // Should cancel previous animation frames
    expect(mockCancelAnimationFrame.mock.calls.length).toBeGreaterThan(initialCancelCount)
  })
})

describe('Performance Tests - Real-world Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation((cb) => setTimeout(cb, 16))
    mockSetTimeout.mockImplementation((cb) => setTimeout(cb, 0))
  })

  it('should handle landing page scenario efficiently', () => {
    const startTime = performance.now()

    render(
      <div>
        {/* Hero section */}
        <ViewportReveal direction="up">
          <h1>Hero Title</h1>
          <p>Hero description</p>
        </ViewportReveal>

        {/* Stats section */}
        <ViewportStagger>
          <ViewportCounter targetValue={500} suffix="+" />
          <ViewportCounter targetValue={15} suffix=" ans" />
          <ViewportCounter targetValue={24} suffix="/7" />
          <ViewportCounter targetValue={100} suffix="%" />
        </ViewportStagger>

        {/* Features section */}
        <ViewportReveal direction="up">
          <h2>Features</h2>
          <ViewportStagger>
            <div>Feature 1</div>
            <div>Feature 2</div>
            <div>Feature 3</div>
            <div>Feature 4</div>
          </ViewportStagger>
        </ViewportReveal>

        {/* Testimonials */}
        <ViewportReveal direction="up">
          <h2>Testimonials</h2>
          <ViewportStagger>
            <div>Testimonial 1</div>
            <div>Testimonial 2</div>
          </ViewportStagger>
        </ViewportReveal>

        {/* CTA */}
        <ViewportFade>
          <div>Call to action</div>
        </ViewportFade>
      </div>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render complete landing page within 50ms
    expect(renderTime).toBeLessThan(50)
  })

  it('should handle dashboard scenario efficiently', () => {
    const dashboardData = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      title: `Dashboard Item ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
    }))

    const startTime = performance.now()

    render(
      <div>
        <ViewportReveal direction="up">
          <h1>Dashboard</h1>
        </ViewportReveal>

        <ViewportStagger>
          {dashboardData.map((item) => (
            <div key={item.id}>
              <h3>{item.title}</h3>
              <ViewportCounter targetValue={item.value} />
            </div>
          ))}
        </ViewportStagger>
      </div>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render dashboard with 50 items within 100ms
    expect(renderTime).toBeLessThan(100)
  })

  it('should handle e-commerce scenario efficiently', () => {
    const products = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      name: `Product ${i + 1}`,
      price: Math.floor(Math.random() * 1000),
      rating: Math.floor(Math.random() * 5) + 1,
    }))

    const startTime = performance.now()

    render(
      <div>
        <ViewportReveal direction="up">
          <h1>Products</h1>
        </ViewportReveal>

        <ViewportStagger>
          {products.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <ViewportCounter targetValue={product.price} prefix="$" />
              <div>Rating: {product.rating}/5</div>
            </div>
          ))}
        </ViewportStagger>
      </div>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render 200 products within 150ms
    expect(renderTime).toBeLessThan(150)
  })
})

describe('Performance Tests - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequestAnimationFrame.mockImplementation((cb) => setTimeout(cb, 16))
    mockSetTimeout.mockImplementation((cb) => setTimeout(cb, 0))
  })

  it('should handle extreme values efficiently', () => {
    const startTime = performance.now()

    render(
      <div>
        <ViewportReveal distance={10000} delay={100000}>
          <div>Extreme reveal</div>
        </ViewportReveal>
        <ViewportCounter targetValue={999999999} duration={10000} />
        <ViewportScale initialScale={0.001} targetScale={10} />
        <ViewportStagger staggerDelay={1000}>
          {Array.from({ length: 1000 }, (_, i) => (
            <div key={i}>Extreme stagger {i}</div>
          ))}
        </ViewportStagger>
      </div>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should handle extreme values within 200ms
    expect(renderTime).toBeLessThan(200)
  })

  it('should handle rapid intersection changes', () => {
    render(
      <ViewportReveal>
        <div>Rapid changes</div>
      </ViewportReveal>
    )

    const startTime = performance.now()

    // Simulate rapid intersection changes
    for (let i = 0; i < 1000; i++) {
      act(() => {
        intersectionCallback([{ isIntersecting: i % 2 === 0 }])
      })
    }

    const endTime = performance.now()
    const processingTime = endTime - startTime

    // Should handle 1000 rapid changes within 100ms
    expect(processingTime).toBeLessThan(100)
  })

  it('should handle concurrent animations', () => {
    const startTime = performance.now()

    render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <ViewportReveal key={i}>
            <div>Concurrent animation {i}</div>
          </ViewportReveal>
        ))}
      </div>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render 100 concurrent animations within 100ms
    expect(renderTime).toBeLessThan(100)
  })
})
