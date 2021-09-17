module.exports = {
  darkMode: 'media', // or 'media' or 'class'
  important: true,
  mode: 'jit',
  plugins: [],
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
