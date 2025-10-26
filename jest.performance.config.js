import { configure } from '@testing-library/react'

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
})

// Mock IntersectionObserver globally
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock requestAnimationFrame with realistic timing
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 16) // 60 FPS
}

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}

// Mock performance API with high precision
Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => {
      const [seconds, nanoseconds] = process.hrtime()
      return seconds * 1000 + nanoseconds / 1000000
    }),
  },
})

// Mock setTimeout/clearTimeout for performance testing
const originalSetTimeout = global.setTimeout
const originalClearTimeout = global.clearTimeout

global.setTimeout = jest.fn((callback: Function, delay: number) => {
  return originalSetTimeout(callback, Math.min(delay, 0)) // Execute immediately for tests
})

global.clearTimeout = jest.fn((id: number) => {
  return originalClearTimeout(id)
})
