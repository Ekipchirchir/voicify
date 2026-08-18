module.exports = {
  dependencies: {
    'react-native-callkeep': {
      platforms: {
        android: {
          // This tells the builder to treat it as a legacy component
          componentDescriptors: null,
          cmakeListsPath: null,
        },
      },
    },
  },
};
