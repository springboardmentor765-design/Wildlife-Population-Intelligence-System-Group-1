/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep forest canopy — sidebar, headers, dark surfaces
        canopy: {
          950: '#0B1A12',
          900: '#10261C',
          800: '#163425',
          700: '#1D4531',
        },
        // Living green — primary actions, active states
        moss: {
          50: '#EEF6F1',
          100: '#D6EADF',
          200: '#A9D5BF',
          300: '#79BC9C',
          400: '#4E9E7A',
          500: '#2C7A5B',
          600: '#22624A',
          700: '#1A4C39',
        },
        // Earth tones — secondary data series, warnings, texture
        bark: { 400: '#A88763', 500: '#8A6742', 600: '#6B4E32' },
        clay: { 300: '#D9A473', 400: '#C4854C', 500: '#B4763A' },
        // Paper / field-notebook surfaces
        sand: { 50: '#FBFAF7', 100: '#F3EFE7', 200: '#E7E1D5', 300: '#D5CCBC' },
        ink: { 500: '#5B6560', 700: '#333B36', 900: '#1A1D1A' },
        // Official IUCN Red List category colours
        iucn: {
          lc: '#60C659',
          nt: '#CCE226',
          vu: '#F9E814',
          en: '#FC7F3F',
          cr: '#D81E05',
          ex: '#000000',
        },
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 38, 28, 0.04), 0 4px 16px rgba(16, 38, 28, 0.06)',
        lift: '0 8px 28px rgba(16, 38, 28, 0.12)',
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem' },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};
