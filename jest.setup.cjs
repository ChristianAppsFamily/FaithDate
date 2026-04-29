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
  SafeAreaProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  SafeAreaView: ({ children, style }) => React.createElement(View, { style }, children),
}));

jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: () => ({
    initialize: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('react-native-iap', () => ({
  fetchProducts: jest.fn(() =>
    Promise.resolve([
      {
        displayPrice: '$9.99',
        id: 'faithdate_remove_ads_lifetime',
        type: 'in-app',
      },
    ]),
  ),
  finishTransaction: jest.fn(() => Promise.resolve()),
  initConnection: jest.fn(() => Promise.resolve(true)),
  requestPurchase: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('expo-tracking-transparency', () => ({
  requestTrackingPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));
