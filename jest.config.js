module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^firebase/firebase$': '<rootDir>/src/firebase/firebase.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@splidejs/react-splide/css$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(\\@splidejs/react-splide)/)',
  ],
};
