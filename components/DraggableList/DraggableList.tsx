import React from "react";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { useDraggableList } from "./useDraggableList";

export type { DragGesture } from "./useDraggableList";

interface DraggableListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (info: {
    item: T;
    drag: import("./useDraggableList").DragGesture;
    isActive: boolean;
  }) => React.ReactNode;
  onReorder: (newData: T[], from: number, to: number) => void;
}

export function DraggableList<T>({
  data,
  keyExtractor,
  renderItem,
  onReorder,
}: DraggableListProps<T>) {
  const { containerRef, onContainerLayout, getItemProps } = useDraggableList({
    data,
    onReorder,
  });

  return (
    <View ref={containerRef} onLayout={onContainerLayout}>
      {data.map((item, index) => {
        const { onLayout, isActive, isHovered, drag } = getItemProps(index);
        return (
          <View
            key={keyExtractor(item)}
            style={[
              isActive && { opacity: 0.6 },
              isHovered && styles.dropTarget,
            ]}
            onLayout={onLayout}
          >
            {renderItem({ item, drag, isActive })}
          </View>
        );
      })}
    </View>
  );
}

export function DragHandle({
  gesture,
  children,
}: {
  gesture: import("./useDraggableList").DragGesture;
  children: React.ReactNode;
}) {
  return (
    <GestureDetector gesture={gesture}>
      <View>{children}</View>
    </GestureDetector>
  );
}

const styles = {
  dropTarget: {
    borderTopWidth: 2,
    borderTopColor: "rgba(255,255,255,0.4)",
  },
};
