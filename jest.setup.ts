import "@testing-library/react-native/extend-expect";

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

import "react-native-gesture-handler/jestSetup";

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
