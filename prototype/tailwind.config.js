/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#A98155',
        'gold-light': '#D49E64',
        brown: '#8B6337',
        ink: '#3A3935',
        'ink-deep': '#1E1D19',
        paper: '#EEEDEC',
        mute: '#C6C6C6',
        'mute-2': '#979797',
        'mute-3': '#7B7B7A',
        success: '#01928D',
        error: '#F94E56',
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.14em',
      },
    },
  },
  plugins: [],
}
