module.exports = {
  purge: [],
  theme: {
    extend: {},
  },
  variants: {
    borderColor: [ 'hover', 'focus', 'active' ],
    transitionTimingFunction: [ 'hover' ],
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
  ],
}
