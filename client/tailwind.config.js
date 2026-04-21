/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f1c2a',
        paper: '#f6f3ed',
        glow: '#f7a51b',
        mint: '#2bb9a7',
        ember: '#ff6542'
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui'],
        body: ['Space Grotesk', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
