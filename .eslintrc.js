module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    'no-undef': 'off',
  },
};