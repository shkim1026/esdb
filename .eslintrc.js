module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    // Optional: customize rules
    'no-undef': 'off', // Temporarily suppresses the "process is not defined" warning
  },
};