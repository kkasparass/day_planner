import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { DraggableList, DragHandle } from "../DraggableList";

jest.mock("react-native-gesture-handler", () => {
  const createPanGesture = () => {
    const g: any = {
      activateAfterLongPress: jest.fn().mockReturnThis(),
      onStart: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      onFinalize: jest.fn().mockReturnThis(),
    };
    return g;
  };
  return {
    Gesture: { Pan: jest.fn(createPanGesture) },
    GestureDetector: ({ children }: any) => children,
  };
});

describe("DraggableList", () => {
  const data = [
    { id: 1, label: "Alpha" },
    { id: 2, label: "Beta" },
    { id: 3, label: "Gamma" },
  ];

  it("renders all items", () => {
    const { getByText } = render(
      <DraggableList
        data={data}
        keyExtractor={(item) => `${item.id}`}
        onReorder={jest.fn()}
        renderItem={({ item }) => <Text>{item.label}</Text>}
      />
    );
    expect(getByText("Alpha")).toBeTruthy();
    expect(getByText("Beta")).toBeTruthy();
    expect(getByText("Gamma")).toBeTruthy();
  });

  it("passes drag and isActive to renderItem", () => {
    const renderItem = jest.fn(({ item }: { item: typeof data[0]; drag: any; isActive: boolean }) => (
      <Text>{item.label}</Text>
    ));

    render(
      <DraggableList
        data={data}
        keyExtractor={(item) => `${item.id}`}
        onReorder={jest.fn()}
        renderItem={renderItem}
      />
    );

    expect(renderItem).toHaveBeenCalledTimes(data.length);
    expect(renderItem.mock.calls[0][0]).toMatchObject({
      item: data[0],
      isActive: false,
    });
    expect(renderItem.mock.calls[0][0].drag).toBeDefined();
  });

  it("renders nothing when data is empty", () => {
    const renderItem = jest.fn(() => <Text>item</Text>);
    render(
      <DraggableList
        data={[]}
        keyExtractor={(item: any) => `${item.id}`}
        onReorder={jest.fn()}
        renderItem={renderItem}
      />
    );
    expect(renderItem).not.toHaveBeenCalled();
  });
});

describe("DragHandle", () => {
  it("renders children", () => {
    const { getByText } = render(
      <DragHandle gesture={{} as any}>
        <Text>drag me</Text>
      </DragHandle>
    );
    expect(getByText("drag me")).toBeTruthy();
  });
});
