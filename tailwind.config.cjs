/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './en/*.html',
    './fr/*.html',
    './js/**/*.js',
    './generate-ssg.mjs'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        32: 'repeat(32, minmax(0, 1fr))'
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-16': 'span 16 / span 16',
        'span-32': 'span 32 / span 32'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    }
  },
  plugins: []
};
