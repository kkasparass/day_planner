import "react-native-gesture-handler/jestSetup";

jest.mock("react-native-worklets", () =>
  require("react-native-worklets/src/mock")
);

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(),
}));

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(() =>
    Promise.resolve({ canceled: true, assets: [] })
  ),
}));

jest.mock("expo-sharing", () => ({
  shareAsync: jest.fn(() => Promise.resolve()),
}));
