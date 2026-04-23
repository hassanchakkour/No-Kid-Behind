/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Disable Tailwind's preflight since MUI handles base styles
  corePlugins: {
    preflight: false,
  },
  important: '#root',
  theme: {
    extend: {},
  },
  plugins: [],
};
