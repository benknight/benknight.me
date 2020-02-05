module.exports = {
  important: true,
  theme: {
    extend: {}
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'dark'],
    borderColor: ['responsive', 'hover', 'focus', 'dark'],
    textColor: ['responsive', 'hover', 'focus', 'dark'],
  },
  plugins: [
    // docs: https://github.com/javifm86/tailwindcss-prefers-dark-mode
    // variants generated:
    // dark
    // dark:hover
    // dark:focus
    // dark:active
    // dark:disabled
    // dark:odd
    // dark:even
    // dark:group-hover
    // dark:focus-within
    require('tailwindcss-prefers-dark-mode')(),
  ],
};
