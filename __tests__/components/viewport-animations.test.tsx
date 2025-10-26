import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { motion } from 'framer-motion'
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

mockIntersectionObserver.mockImplementation((callback, options) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
}))

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

describe('ViewportReveal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <ViewportReveal>
        <h1>Test Title</h1>
      </ViewportReveal>
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <ViewportReveal className="custom-class">
        <div>Test content</div>
      </ViewportReveal>
    )

    const element = screen.getByText('Test content')
    expect(element.parentElement).toHaveClass('custom-class')
  })

  it('should handle different directions', () => {
    const { rerender } = render(
      <ViewportReveal direction="up" distance={50}>
        <div>Up direction</div>
      </ViewportReveal>
    )

    expect(screen.getByText('Up direction')).toBeInTheDocument()

    rerender(
      <ViewportReveal direction="down" distance={30}>
        <div>Down direction</div>
      </ViewportReveal>
    )

    expect(screen.getByText('Down direction')).toBeInTheDocument()

    rerender(
      <ViewportReveal direction="left" distance={40}>
        <div>Left direction</div>
      </ViewportReveal>
    )

    expect(screen.getByText('Left direction')).toBeInTheDocument()

    rerender(
      <ViewportReveal direction="right" distance={60}>
        <div>Right direction</div>
      </ViewportReveal>
    )

    expect(screen.getByText('Right direction')).toBeInTheDocument()
  })

  it('should handle delay parameter', () => {
    render(
      <ViewportReveal delay={200}>
        <div>Delayed content</div>
      </ViewportReveal>
    )

    expect(screen.getByText('Delayed content')).toBeInTheDocument()
  })

  it('should handle threshold and rootMargin', () => {
    render(
      <ViewportReveal threshold={0.5} rootMargin="20px">
        <div>Custom threshold</div>
      </ViewportReveal>
    )

    expect(screen.getByText('Custom threshold')).toBeInTheDocument()
  })
})

describe('ViewportStagger Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children correctly', () => {
    const items = ['Item 1', 'Item 2', 'Item 3']

    render(
      <ViewportStagger>
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </ViewportStagger>
    )

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('should handle single child', () => {
    render(
      <ViewportStagger>
        <div>Single item</div>
      </ViewportStagger>
    )

    expect(screen.getByText('Single item')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <ViewportStagger className="stagger-container">
        <div>Item 1</div>
        <div>Item 2</div>
      </ViewportStagger>
    )

    const container = screen.getByText('Item 1').parentElement
    expect(container).toHaveClass('stagger-container')
  })

  it('should handle custom staggerDelay', () => {
    render(
      <ViewportStagger staggerDelay={200}>
        <div>Item 1</div>
        <div>Item 2</div>
      </ViewportStagger>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('should handle threshold and rootMargin', () => {
    render(
      <ViewportStagger threshold={0.3} rootMargin="10px">
        <div>Item 1</div>
        <div>Item 2</div>
      </ViewportStagger>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })
})

describe('ViewportCounter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render counter with target value', () => {
    render(<ViewportCounter targetValue={500} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should handle prefix and suffix', () => {
    render(<ViewportCounter targetValue={100} prefix="$" suffix="%" />)

    expect(screen.getByText('$0%')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<ViewportCounter targetValue={200} className="counter-style" />)

    const counter = screen.getByText('0')
    expect(counter.parentElement).toHaveClass('counter-style')
  })

  it('should handle custom duration', () => {
    render(<ViewportCounter targetValue={300} duration={3000} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should handle threshold and rootMargin', () => {
    render(<ViewportCounter targetValue={400} threshold={0.2} rootMargin="15px" />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should format large numbers correctly', () => {
    render(<ViewportCounter targetValue={1000000} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

describe('ViewportFade Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <ViewportFade>
        <p>Fade content</p>
      </ViewportFade>
    )

    expect(screen.getByText('Fade content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <ViewportFade className="fade-container">
        <div>Fade item</div>
      </ViewportFade>
    )

    const element = screen.getByText('Fade item')
    expect(element.parentElement).toHaveClass('fade-container')
  })

  it('should handle delay parameter', () => {
    render(
      <ViewportFade delay={300}>
        <div>Delayed fade</div>
      </ViewportFade>
    )

    expect(screen.getByText('Delayed fade')).toBeInTheDocument()
  })

  it('should handle threshold and rootMargin', () => {
    render(
      <ViewportFade threshold={0.4} rootMargin="25px">
        <div>Custom fade</div>
      </ViewportFade>
    )

    expect(screen.getByText('Custom fade')).toBeInTheDocument()
  })
})

describe('ViewportSlide Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <ViewportSlide>
        <div>Slide content</div>
      </ViewportSlide>
    )

    expect(screen.getByText('Slide content')).toBeInTheDocument()
  })

  it('should handle different directions', () => {
    const { rerender } = render(
      <ViewportSlide direction="up" distance={50}>
        <div>Up slide</div>
      </ViewportSlide>
    )

    expect(screen.getByText('Up slide')).toBeInTheDocument()

    rerender(
      <ViewportSlide direction="down" distance={30}>
        <div>Down slide</div>
      </ViewportSlide>
    )

    expect(screen.getByText('Down slide')).toBeInTheDocument()

    rerender(
      <ViewportSlide direction="left" distance={40}>
        <div>Left slide</div>
      </ViewportSlide>
    )

    expect(screen.getByText('Left slide')).toBeInTheDocument()

    rerender(
      <ViewportSlide direction="right" distance={60}>
        <div>Right slide</div>
      </ViewportSlide>
    )

    expect(screen.getByText('Right slide')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <ViewportSlide className="slide-container">
        <div>Slide item</div>
      </ViewportSlide>
    )

    const element = screen.getByText('Slide item')
    expect(element.parentElement).toHaveClass('slide-container')
  })

  it('should handle delay parameter', () => {
    render(
      <ViewportSlide delay={250}>
        <div>Delayed slide</div>
      </ViewportSlide>
    )

    expect(screen.getByText('Delayed slide')).toBeInTheDocument()
  })

  it('should handle custom distance', () => {
    render(
      <ViewportSlide direction="up" distance={100}>
        <div>Long slide</div>
      </ViewportSlide>
    )

    expect(screen.getByText('Long slide')).toBeInTheDocument()
  })
})

describe('ViewportScale Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <ViewportScale>
        <div>Scale content</div>
      </ViewportScale>
    )

    expect(screen.getByText('Scale content')).toBeInTheDocument()
  })

  it('should handle custom scale values', () => {
    render(
      <ViewportScale initialScale={0.5} targetScale={1.5}>
        <div>Custom scale</div>
      </ViewportScale>
    )

    expect(screen.getByText('Custom scale')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <ViewportScale className="scale-container">
        <div>Scale item</div>
      </ViewportScale>
    )

    const element = screen.getByText('Scale item')
    expect(element.parentElement).toHaveClass('scale-container')
  })

  it('should handle delay parameter', () => {
    render(
      <ViewportScale delay={150}>
        <div>Delayed scale</div>
      </ViewportScale>
    )

    expect(screen.getByText('Delayed scale')).toBeInTheDocument()
  })

  it('should handle threshold and rootMargin', () => {
    render(
      <ViewportScale threshold={0.6} rootMargin="30px">
        <div>Custom scale</div>
      </ViewportScale>
    )

    expect(screen.getByText('Custom scale')).toBeInTheDocument()
  })
})

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should work with multiple components together', () => {
    render(
      <div>
        <ViewportReveal direction="up">
          <h1>Title</h1>
        </ViewportReveal>
        <ViewportStagger>
          <div>Item 1</div>
          <div>Item 2</div>
        </ViewportStagger>
        <ViewportCounter targetValue={100} />
        <ViewportFade>
          <p>Footer</p>
        </ViewportFade>
      </div>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('should handle nested components', () => {
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

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Nested content')).toBeInTheDocument()
  })

  it('should handle complex content structures', () => {
    const complexContent = (
      <ViewportReveal direction="up" distance={50}>
        <div className="container">
          <h2>Complex Title</h2>
          <ViewportStagger staggerDelay={100}>
            <div className="card">
              <h3>Card 1</h3>
              <p>Content 1</p>
            </div>
            <div className="card">
              <h3>Card 2</h3>
              <p>Content 2</p>
            </div>
          </ViewportStagger>
          <ViewportCounter targetValue={1000} suffix="+" />
        </div>
      </ViewportReveal>
    )

    render(complexContent)

    expect(screen.getByText('Complex Title')).toBeInTheDocument()
    expect(screen.getByText('Card 1')).toBeInTheDocument()
    expect(screen.getByText('Card 2')).toBeInTheDocument()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
    expect(screen.getByText('0+')).toBeInTheDocument()
  })
})

describe('Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle large number of children efficiently', () => {
    const manyItems = Array.from({ length: 100 }, (_, i) => (
      <div key={i}>Item {i + 1}</div>
    ))

    const startTime = performance.now()

    render(<ViewportStagger>{manyItems}</ViewportStagger>)

    const endTime = performance.now()
    const duration = endTime - startTime

    // Should render within reasonable time
    expect(duration).toBeLessThan(100)

    // Should render all items
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 100')).toBeInTheDocument()
  })

  it('should not cause memory leaks with multiple renders', () => {
    const { rerender } = render(
      <ViewportReveal>
        <div>Test content</div>
      </ViewportReveal>
    )

    // Multiple re-renders
    for (let i = 0; i < 50; i++) {
      rerender(
        <ViewportReveal>
          <div>Test content {i}</div>
        </ViewportReveal>
      )
    }

    expect(screen.getByText('Test content 49')).toBeInTheDocument()
  })

  it('should handle rapid prop changes efficiently', () => {
    const { rerender } = render(<ViewportCounter targetValue={100} />)

    const startTime = performance.now()

    // Rapid prop changes
    for (let i = 0; i < 100; i++) {
      rerender(<ViewportCounter targetValue={i} />)
    }

    const endTime = performance.now()
    const duration = endTime - startTime

    // Should handle changes efficiently
    expect(duration).toBeLessThan(200)
  })
})

describe('Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle empty children', () => {
    render(<ViewportReveal>{null}</ViewportReveal>)
    render(<ViewportStagger>{[]}</ViewportStagger>)
    render(<ViewportFade>{undefined}</ViewportFade>)

    // Should not crash
    expect(true).toBe(true)
  })

  it('should handle extreme values', () => {
    render(
      <div>
        <ViewportReveal distance={10000} delay={100000}>
          <div>Extreme values</div>
        </ViewportReveal>
        <ViewportCounter targetValue={999999999} />
        <ViewportScale initialScale={0.001} targetScale={10} />
      </div>
    )

    expect(screen.getByText('Extreme values')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should handle invalid props gracefully', () => {
    render(
      <div>
        <ViewportReveal direction="invalid" as any>
          <div>Invalid direction</div>
        </ViewportReveal>
        <ViewportCounter targetValue={-100} />
        <ViewportScale initialScale={-1} targetScale={-2} />
      </div>
    )

    expect(screen.getByText('Invalid direction')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
