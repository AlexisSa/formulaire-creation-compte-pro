import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import {
  ViewportReveal,
  ViewportStagger,
  ViewportCounter,
  ViewportFade,
  ViewportSlide,
  ViewportScale,
} from '@/components/ui/simple-viewport-animations'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

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

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock prefers-reduced-motion
const mockMatchMedia = jest.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

describe('Accessibility Tests - ViewportReveal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: 'prefers-reduced-motion: no-preference',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ViewportReveal>
        <h2>Accessible Title</h2>
        <p>This content should be accessible</p>
      </ViewportReveal>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should respect prefers-reduced-motion', async () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: 'prefers-reduced-motion: reduce',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })

    const { container } = render(
      <ViewportReveal>
        <div>Reduced motion content</div>
      </ViewportReveal>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should maintain semantic structure', async () => {
    const { container } = render(
      <ViewportReveal>
        <main>
          <h1>Main Title</h1>
          <section>
            <h2>Section Title</h2>
            <p>Section content</p>
          </section>
        </main>
      </ViewportReveal>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify semantic elements are preserved
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('should handle focus management', async () => {
    const { container } = render(
      <ViewportReveal>
        <form>
          <label htmlFor="input1">Label 1</label>
          <input id="input1" type="text" />
          <button type="submit">Submit</button>
        </form>
      </ViewportReveal>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify form elements are accessible
    expect(screen.getByLabelText('Label 1')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should handle ARIA attributes correctly', async () => {
    const { container } = render(
      <ViewportReveal>
        <div role="region" aria-labelledby="region-title">
          <h2 id="region-title">Region Title</h2>
          <p>Region content</p>
        </div>
      </ViewportReveal>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify ARIA attributes are preserved
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-labelledby', 'region-title')
  })
})

describe('Accessibility Tests - ViewportStagger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: 'prefers-reduced-motion: no-preference',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ViewportStagger>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </ViewportStagger>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should handle list semantics correctly', async () => {
    const { container } = render(
      <ViewportStagger>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
        </ul>
      </ViewportStagger>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify list structure is preserved
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('should handle navigation elements', async () => {
    const { container } = render(
      <ViewportStagger>
        <nav aria-label="Main navigation">
          <a href="/home">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </ViewportStagger>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify navigation is accessible
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    expect(screen.getAllByRole('link')).toHaveLength(3)
  })

  it('should handle interactive elements', async () => {
    const { container } = render(
      <ViewportStagger>
        <button>Button 1</button>
        <button>Button 2</button>
        <input type="checkbox" id="check1" />
        <label htmlFor="check1">Checkbox 1</label>
      </ViewportStagger>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify interactive elements are accessible
    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByLabelText('Checkbox 1')).toBeInTheDocument()
  })
})

describe('Accessibility Tests - ViewportCounter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: 'prefers-reduced-motion: no-preference',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<ViewportCounter targetValue={100} />)

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should be accessible to screen readers', async () => {
    const { container } = render(<ViewportCounter targetValue={500} suffix="+" />)

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Counter should be readable by screen readers
    const counter = screen.getByText('0+')
    expect(counter).toBeInTheDocument()
  })

  it('should handle live regions correctly', async () => {
    const { container } = render(
      <div>
        <ViewportCounter targetValue={1000} />
        <div aria-live="polite" aria-atomic="true">
          Counter updates will be announced here
        </div>
      </div>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify live region is properly configured
    const liveRegion = screen.getByRole('status')
    expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
  })

  it('should handle large numbers accessibly', async () => {
    const { container } = render(<ViewportCounter targetValue={1000000} />)

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Large numbers should be formatted for accessibility
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

describe('Accessibility Tests - ViewportFade', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: 'prefers-reduced-motion: no-preference',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ViewportFade>
        <div>Fade content</div>
      </ViewportFade>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should handle text content accessibly', async () => {
    const { container } = render(
      <ViewportFade>
        <p>
          This is a paragraph with <strong>important text</strong> and{' '}
          <em>emphasized content</em>.
        </p>
      </ViewportFade>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify text formatting is preserved
    expect(screen.getByText('important text')).toBeInTheDocument()
    expect(screen.getByText('emphasized content')).toBeInTheDocument()
  })

  it('should handle images with alt text', async () => {
    const { container } = render(
      <ViewportFade>
        <img src="test.jpg" alt="Test image description" />
      </ViewportFade>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify image accessibility
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Test image description')
  })
})

describe('Accessibility Tests - ViewportSlide', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: 'prefers-reduced-motion: no-preference',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ViewportSlide>
        <div>Slide content</div>
      </ViewportSlide>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should handle different directions accessibly', async () => {
    const directions = ['up', 'down', 'left', 'right'] as const

    for (const direction of directions) {
      const { container } = render(
        <ViewportSlide direction={direction}>
          <div>Slide {direction}</div>
        </ViewportSlide>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    }
  })

  it('should handle form elements correctly', async () => {
    const { container } = render(
      <ViewportSlide>
        <form>
          <fieldset>
            <legend>Form Legend</legend>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required />
            <label htmlFor="message">Message</label>
            <textarea id="message" required></textarea>
          </fieldset>
        </form>
      </ViewportSlide>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify form accessibility
    expect(screen.getByRole('group')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
  })
})

describe('Accessibility Tests - ViewportScale', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: 'prefers-reduced-motion: no-preference',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ViewportScale>
        <div>Scale content</div>
      </ViewportScale>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should handle custom scale values accessibly', async () => {
    const { container } = render(
      <ViewportScale initialScale={0.5} targetScale={1.5}>
        <div>Custom scale content</div>
      </ViewportScale>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should handle complex content structures', async () => {
    const { container } = render(
      <ViewportScale>
        <article>
          <header>
            <h1>Article Title</h1>
            <time dateTime="2024-01-01">January 1, 2024</time>
          </header>
          <main>
            <p>Article content goes here.</p>
            <aside>
              <h2>Related Information</h2>
              <p>Additional context.</p>
            </aside>
          </main>
          <footer>
            <p>Article footer</p>
          </footer>
        </article>
      </ViewportScale>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify article structure is preserved
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('complementary')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})

describe('Accessibility Tests - Reduced Motion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should respect prefers-reduced-motion for all components', async () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: 'prefers-reduced-motion: reduce',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })

    const { container } = render(
      <div>
        <ViewportReveal>
          <div>Reveal content</div>
        </ViewportReveal>
        <ViewportStagger>
          <div>Stagger item 1</div>
          <div>Stagger item 2</div>
        </ViewportStagger>
        <ViewportCounter targetValue={100} />
        <ViewportFade>
          <div>Fade content</div>
        </ViewportFade>
        <ViewportSlide>
          <div>Slide content</div>
        </ViewportSlide>
        <ViewportScale>
          <div>Scale content</div>
        </ViewportScale>
      </div>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should handle mixed motion preferences', async () => {
    // Test with reduced motion preference
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: 'prefers-reduced-motion: reduce',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })

    const { container } = render(
      <ViewportReveal>
        <div>Content with reduced motion</div>
      </ViewportReveal>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('Accessibility Tests - Complex Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: 'prefers-reduced-motion: no-preference',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })
  })

  it('should handle nested components accessibly', async () => {
    const { container } = render(
      <ViewportReveal>
        <section aria-labelledby="section-title">
          <h2 id="section-title">Section Title</h2>
          <ViewportStagger>
            <article>
              <h3>Article 1</h3>
              <p>Article content 1</p>
            </article>
            <article>
              <h3>Article 2</h3>
              <p>Article content 2</p>
            </article>
          </ViewportStagger>
          <ViewportCounter targetValue={50} suffix=" items" />
        </section>
      </ViewportReveal>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify nested structure is accessible
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText('0 items')).toBeInTheDocument()
  })

  it('should handle interactive content accessibly', async () => {
    const { container } = render(
      <ViewportFade>
        <div role="tablist" aria-label="Content tabs">
          <button role="tab" aria-selected="true" aria-controls="panel1" id="tab1">
            Tab 1
          </button>
          <button role="tab" aria-selected="false" aria-controls="panel2" id="tab2">
            Tab 2
          </button>
        </div>
        <div role="tabpanel" id="panel1" aria-labelledby="tab1">
          <p>Tab 1 content</p>
        </div>
        <div role="tabpanel" id="panel2" aria-labelledby="tab2" hidden>
          <p>Tab 2 content</p>
        </div>
      </ViewportFade>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify tab interface is accessible
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(2)
    expect(screen.getAllByRole('tabpanel')).toHaveLength(2)
  })

  it('should handle data tables accessibly', async () => {
    const { container } = render(
      <ViewportSlide>
        <table>
          <caption>Sales Data</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Sales</th>
              <th scope="col">Growth</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">January</th>
              <td>$10,000</td>
              <td>+5%</td>
            </tr>
            <tr>
              <th scope="row">February</th>
              <td>$12,000</td>
              <td>+20%</td>
            </tr>
          </tbody>
        </table>
      </ViewportSlide>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()

    // Verify table accessibility
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Month' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'January' })).toBeInTheDocument()
  })
})

describe('Accessibility Tests - Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: 'prefers-reduced-motion: no-preference',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })
  })

  it('should maintain accessibility with large content', async () => {
    const largeContent = Array.from({ length: 100 }, (_, i) => (
      <div key={i}>
        <h3>Item {i + 1}</h3>
        <p>Content for item {i + 1}</p>
      </div>
    ))

    const { container } = render(<ViewportStagger>{largeContent}</ViewportStagger>)

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should handle rapid re-renders accessibly', async () => {
    const { container, rerender } = render(
      <ViewportReveal>
        <div>Initial content</div>
      </ViewportReveal>
    )

    // Rapid re-renders
    for (let i = 0; i < 10; i++) {
      rerender(
        <ViewportReveal>
          <div>Content {i}</div>
        </ViewportReveal>
      )
    }

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
