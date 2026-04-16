import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export type DragGesture = ReturnType<typeof Gesture.Pan>;

interface UseDraggableListOptions<T> {
  data: T[];
  onReorder: (newData: T[], from: number, to: number) => void;
}

interface UseDraggableListResult {
  activeIndex: number;
  hoveredIndex: number;
  containerRef: React.RefObject<View | null>;
  onContainerLayout: () => void;
  getItemProps: (index: number) => {
    onLayout: (e: { nativeEvent: { layout: { height: number } } }) => void;
    isActive: boolean;
    isHovered: boolean;
    drag: DragGesture;
  };
}

export function useDraggableList<T>({
  data,
  onReorder,
}: UseDraggableListOptions<T>): UseDraggableListResult {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const itemHeights = useRef<number[]>([]);
  const containerRef = useRef<View>(null);
  const containerAbsY = useRef(0);
  const activeRef = useRef(-1);
  const hoveredRef = useRef(-1);
  const dataRef = useRef(data);
  dataRef.current = data;

  const onContainerLayout = useCallback(() => {
    containerRef.current?.measure((_x, _y, _w, _h, _px, py) => {
      containerAbsY.current = py;
    });
  }, []);

  const onDragStart = useCallback((index: number) => {
    activeRef.current = index;
    hoveredRef.current = index;
    setActiveIndex(index);
    setHoveredIndex(index);
  }, []);

  const onDragUpdate = useCallback((absoluteY: number) => {
    const relY = absoluteY - containerAbsY.current;
    let cumY = 0;
    let newHover = dataRef.current.length - 1;

    for (let i = 0; i < dataRef.current.length; i++) {
      const h = itemHeights.current[i] ?? 50;
      if (relY <= cumY + h / 2) {
        newHover = i;
        break;
      }
      cumY += h;
    }

    if (hoveredRef.current !== newHover) {
      hoveredRef.current = newHover;
      setHoveredIndex(newHover);
    }
  }, []);

  const onDragFinalize = useCallback(() => {
    const from = activeRef.current;
    const to = hoveredRef.current;

    activeRef.current = -1;
    hoveredRef.current = -1;
    setActiveIndex(-1);
    setHoveredIndex(-1);

    if (from !== -1 && to !== -1 && from !== to) {
      const arr = [...dataRef.current];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      onReorder(arr, from, to);
    }
  }, [onReorder]);

  const gestureCache = useRef<Map<number, DragGesture>>(new Map());

  const prevCallbacks = useRef({ onDragStart, onDragUpdate, onDragFinalize });
  if (
    prevCallbacks.current.onDragStart !== onDragStart ||
    prevCallbacks.current.onDragUpdate !== onDragUpdate ||
    prevCallbacks.current.onDragFinalize !== onDragFinalize
  ) {
    gestureCache.current.clear();
    prevCallbacks.current = { onDragStart, onDragUpdate, onDragFinalize };
  }

  const getDragGesture = useCallback(
    (index: number): DragGesture => {
      if (!gestureCache.current.has(index)) {
        gestureCache.current.set(
          index,
          Gesture.Pan()
            .activateAfterLongPress(300)
            .onStart(() => {
              "worklet";
              runOnJS(onDragStart)(index);
            })
            .onUpdate((e) => {
              "worklet";
              runOnJS(onDragUpdate)(e.absoluteY);
            })
            .onFinalize(() => {
              "worklet";
              runOnJS(onDragFinalize)();
            }),
        );
      }
      return gestureCache.current.get(index)!;
    },
    [onDragStart, onDragUpdate, onDragFinalize],
  );

  const getItemProps = useCallback(
    (index: number) => ({
      onLayout: (e: { nativeEvent: { layout: { height: number } } }) => {
        itemHeights.current[index] = e.nativeEvent.layout.height;
      },
      isActive: index === activeIndex,
      isHovered:
        activeIndex !== -1 && index === hoveredIndex && index !== activeIndex,
      drag: getDragGesture(index),
    }),
    [activeIndex, hoveredIndex, getDragGesture],
  );

  return {
    activeIndex,
    hoveredIndex,
    containerRef,
    onContainerLayout,
    getItemProps,
  };
}
