/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1B3A2F',
          deep: '#132820',
          soft: '#2A4F40',
        },
        sage: {
          DEFAULT: '#B8C9B8',
          light: '#D4E0D4',
          mist: '#E8EFE8',
        },
        cream: {
          DEFAULT: '#FAFAF7',
          warm: '#F5F2EB',
        },
        clay: {
          DEFAULT: '#C4785A',
          soft: '#E8C4B4',
          mist: '#F3E6DE',
        },
        lime: {
          DEFAULT: '#C8E86A',
          bright: '#D4F07A',
        },
        ink: {
          DEFAULT: '#1A1F1C',
          muted: '#5C6B63',
          faint: '#8A968E',
        },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans Variable"', 'DM Sans', 'system-ui', 'sans-serif'],
        ethiopic: ['"Noto Sans Ethiopic"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
    },
  },
  plugins: [],
}
