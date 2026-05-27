module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-reanimated MUST be last plugin in this array
      // Source: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/
      'react-native-reanimated/plugin',
    ],
  };
};
