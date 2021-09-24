const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'media', // or 'media' or 'class'
  important: true,
  mode: 'jit',
  plugins: [],
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.trueGray,
        },
      },
      screens: {
        landscape: { raw: '(orientation: landscape)' },
        portrait: { raw: '(orientation: portrait)' },
      },
    },
  },
  variants: {
    extend: {},
  },
};
