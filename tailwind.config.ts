import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Radix UI Colors
        'blue-1': 'hsl(var(--blue-1))',
        'blue-2': 'hsl(var(--blue-2))',
        'blue-3': 'hsl(var(--blue-3))',
        'blue-4': 'hsl(var(--blue-4))',
        'blue-5': 'hsl(var(--blue-5))',
        'blue-6': 'hsl(var(--blue-6))',
        'blue-7': 'hsl(var(--blue-7))',
        'blue-8': 'hsl(var(--blue-8))',
        'blue-9': 'hsl(var(--blue-9))',
        'blue-10': 'hsl(var(--blue-10))',
        'blue-11': 'hsl(var(--blue-11))',
        'blue-12': 'hsl(var(--blue-12))',
        'gray-1': 'hsl(var(--gray-1))',
        'gray-2': 'hsl(var(--gray-2))',
        'gray-3': 'hsl(var(--gray-3))',
        'gray-4': 'hsl(var(--gray-4))',
        'gray-5': 'hsl(var(--gray-5))',
        'gray-6': 'hsl(var(--gray-6))',
        'gray-7': 'hsl(var(--gray-7))',
        'gray-8': 'hsl(var(--gray-8))',
        'gray-9': 'hsl(var(--gray-9))',
        'gray-10': 'hsl(var(--gray-10))',
        'gray-11': 'hsl(var(--gray-11))',
        'gray-12': 'hsl(var(--gray-12))',
        'green-1': 'hsl(var(--green-1))',
        'green-2': 'hsl(var(--green-2))',
        'green-3': 'hsl(var(--green-3))',
        'green-4': 'hsl(var(--green-4))',
        'green-5': 'hsl(var(--green-5))',
        'green-6': 'hsl(var(--green-6))',
        'green-7': 'hsl(var(--green-7))',
        'green-8': 'hsl(var(--green-8))',
        'green-9': 'hsl(var(--green-9))',
        'green-10': 'hsl(var(--green-10))',
        'green-11': 'hsl(var(--green-11))',
        'green-12': 'hsl(var(--green-12))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}

export default config
