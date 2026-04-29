module.exports = {
  preset: '@react-native/jest-preset',
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.setup.cjs'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo/.*|expo-.*|react-native-web)/)',
  ],
};
