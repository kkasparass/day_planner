import { renderHook, act } from "@testing-library/react-native";
import { Gesture } from "react-native-gesture-handler";
import { DragGesture, useDraggableList } from "../useDraggableList";

type MockDragGesture = DragGesture & {
  _trigger: {
    start: () => void;
    update: (absoluteY: number) => void;
    finalize: () => void;
  };
};

const triggerOf = (drag: DragGesture) => (drag as MockDragGesture)._trigger;

// Each Gesture.Pan() call returns a gesture object that stores callbacks.
// _trigger exposes them so tests can simulate gesture events.
jest.mock("react-native-gesture-handler", () => {
  const createPanGesture = () => {
    let _start: () => void;
    let _update: (e: { absoluteY: number }) => void;
    let _finalize: () => void;
    const g: any = {
      activateAfterLongPress: jest.fn().mockReturnThis(),
      onStart: jest.fn((cb: () => void) => {
        _start = cb;
        return g;
      }),
      onUpdate: jest.fn((cb: (e: { absoluteY: number }) => void) => {
        _update = cb;
        return g;
      }),
      onFinalize: jest.fn((cb: () => void) => {
        _finalize = cb;
        return g;
      }),
      _trigger: {
        start: () => _start?.(),
        update: (absoluteY: number) => _update?.({ absoluteY }),
        finalize: () => _finalize?.(),
      },
    };
    return g;
  };

  return {
    Gesture: { Pan: jest.fn(createPanGesture) },
    GestureDetector: ({ children }: any) => children,
  };
});

const DATA = ["a", "b", "c"];

const makeHook = (onReorder = jest.fn()) =>
  renderHook(() => useDraggableList({ data: DATA, onReorder }));

// Helper: simulate a layout event giving each item a known height
const setItemHeights = (
  result: ReturnType<typeof makeHook>["result"],
  heights: number[]
) => {
  act(() => {
    heights.forEach((h, i) => {
      const { onLayout } = result.current.getItemProps(i);
      onLayout({ nativeEvent: { layout: { height: h } } });
    });
  });
};

beforeEach(() => {
  (Gesture.Pan as jest.Mock).mockClear();
});

describe("useDraggableList", () => {
  it("initial state: activeIndex and hoveredIndex are -1", () => {
    const { result } = makeHook();
    expect(result.current.activeIndex).toBe(-1);
    expect(result.current.hoveredIndex).toBe(-1);
  });

  it("getItemProps returns isActive=false and isHovered=false initially", () => {
    const { result } = makeHook();
    const props = result.current.getItemProps(0);
    expect(props.isActive).toBe(false);
    expect(props.isHovered).toBe(false);
  });

  it("drag start sets activeIndex and hoveredIndex to that item", () => {
    const { result } = makeHook();

    act(() => {
      triggerOf(result.current.getItemProps(1).drag).start();
    });

    expect(result.current.activeIndex).toBe(1);
    expect(result.current.hoveredIndex).toBe(1);
  });

  it("getItemProps reflects isActive=true after drag start", () => {
    const { result } = makeHook();

    act(() => {
      triggerOf(result.current.getItemProps(0).drag).start();
    });

    expect(result.current.getItemProps(0).isActive).toBe(true);
    expect(result.current.getItemProps(1).isActive).toBe(false);
  });

  it("drag update changes hoveredIndex based on absoluteY", () => {
    const { result } = makeHook();
    // Heights: [60, 60, 60]. Thresholds: 0→30, 1→90, 2→150
    setItemHeights(result, [60, 60, 60]);

    act(() => {
      triggerOf(result.current.getItemProps(0).drag).start();
    });

    // absoluteY=100, containerAbsY=0 → relY=100 > 90, so hovers index 2
    act(() => {
      triggerOf(result.current.getItemProps(0).drag).update(100);
    });

    expect(result.current.hoveredIndex).toBe(2);
  });

  it("drag update uses default height of 50 when no layout measured", () => {
    const { result } = makeHook();
    // No setItemHeights — defaults to 50px each
    // Thresholds: 0→25, 1→75, 2→125

    act(() => {
      triggerOf(result.current.getItemProps(0).drag).start();
    });

    // absoluteY=60 → relY=60, falls in index 1 range (25..75)
    act(() => {
      triggerOf(result.current.getItemProps(0).drag).update(60);
    });

    expect(result.current.hoveredIndex).toBe(1);
  });

  it("finalize calls onReorder with reordered array when from !== to", () => {
    const onReorder = jest.fn();
    const { result } = makeHook(onReorder);
    // Default 50px heights → thresholds: 0→25, 1→75, 2→125

    // Start drag on item 0
    act(() => {
      triggerOf(result.current.getItemProps(0).drag).start();
    });

    // Move to hover over item 2 (absoluteY=130)
    act(() => {
      triggerOf(result.current.getItemProps(0).drag).update(130);
    });

    expect(result.current.hoveredIndex).toBe(2);

    // Finalize
    act(() => {
      triggerOf(result.current.getItemProps(0).drag).finalize();
    });

    // from=0, to=2 → ["b", "c", "a"]
    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(onReorder).toHaveBeenCalledWith(["b", "c", "a"], 0, 2);
  });

  it("finalize does NOT call onReorder when item dropped in place", () => {
    const onReorder = jest.fn();
    const { result } = makeHook(onReorder);

    act(() => {
      triggerOf(result.current.getItemProps(1).drag).start();
    });

    // No update → hoveredIndex stays at 1 (same as activeIndex)
    act(() => {
      triggerOf(result.current.getItemProps(1).drag).finalize();
    });

    expect(onReorder).not.toHaveBeenCalled();
  });

  it("finalize resets activeIndex and hoveredIndex to -1", () => {
    const { result } = makeHook();

    act(() => {
      triggerOf(result.current.getItemProps(0).drag).start();
    });

    act(() => {
      triggerOf(result.current.getItemProps(0).drag).update(130);
    });

    act(() => {
      triggerOf(result.current.getItemProps(0).drag).finalize();
    });

    expect(result.current.activeIndex).toBe(-1);
    expect(result.current.hoveredIndex).toBe(-1);
  });

  it("isHovered is true only for hovered item when a different item is active", () => {
    const { result } = makeHook();

    act(() => {
      triggerOf(result.current.getItemProps(0).drag).start();
    });

    act(() => {
      triggerOf(result.current.getItemProps(0).drag).update(130);
    });

    // active=0, hovered=2
    expect(result.current.getItemProps(0).isHovered).toBe(false); // active item not hovered
    expect(result.current.getItemProps(1).isHovered).toBe(false);
    expect(result.current.getItemProps(2).isHovered).toBe(true);
  });

  it("drag to last position when absoluteY exceeds all items", () => {
    const onReorder = jest.fn();
    const { result } = makeHook(onReorder);

    act(() => {
      triggerOf(result.current.getItemProps(0).drag).start();
    });

    // absoluteY well past all items
    act(() => {
      triggerOf(result.current.getItemProps(0).drag).update(9999);
    });

    expect(result.current.hoveredIndex).toBe(2); // last index
  });

  it("gesture objects are cached — same drag reference returned for same index", () => {
    const { result } = makeHook();
    const drag1 = result.current.getItemProps(0).drag;
    const drag2 = result.current.getItemProps(0).drag;
    expect(drag1).toBe(drag2);
  });
});
