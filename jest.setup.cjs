const React = require('react');
const { Text, View } = require('react-native');

global.clearImmediate = global.clearImmediate || clearTimeout;
global.setImmediate = global.setImmediate || ((callback, ...args) => setTimeout(callback, 0, ...args));

function MockIcon({ name }) {
  return React.createElement(Text, null, name || 'icon');
}

jest.mock('@expo/vector-icons', () => ({
  Feather: MockIcon,
  FontAwesome5: MockIcon,
  Ionicons: MockIcon,
  MaterialCommunityIcons: MockIcon,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, style }) => React.createElement(View, { style }, children),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, style }) => React.createElement(View, { style }, children),
}));
