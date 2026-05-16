/* eslint-env jest */

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    getItem: jest.fn(key => Promise.resolve(store.has(key) ? store.get(key) : null)),
    setItem: jest.fn((key, value) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    removeItem: jest.fn(key => {
      store.delete(key);
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      store.clear();
      return Promise.resolve();
    }),
  };
});

jest.mock('react-native-share', () => ({
  open: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-fs', () => ({
  CachesDirectoryPath: '/tmp',
  writeFile: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn(() => Promise.resolve('/tmp/qrcanvas.png')),
}));

jest.mock('react-native-qrcode-svg', () => {
  const React = require('react');
  const {View} = require('react-native');
  return function MockQRCode(props) {
    return React.createElement(View, {...props, testID: 'qr-code'});
  };
});
