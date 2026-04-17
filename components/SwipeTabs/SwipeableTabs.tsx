import React, { useCallback, useEffect } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  I18nManager,
} from "react-native";
import DefaultTabBar from "./TabBar";

interface IProps {
  /**  When a swipe is completed onSwipe is called with selected index.
   * */
  onSwipe?: (index: number) => any;
  /**
   *  Changing selectedIndex animates the component to the corresponding tab.
   */
  selectedIndex?: number;
  /**
   * Pass components or screens as children and they will be rendered in tabs.
   */
  children?: any;
  /**
   * Pass the labels you want to display in TabBar
   */
  labels?: string[];
  /**
   * If you want to display your own label components use this.
   */
  labelComponents?: React.FC<{ selected: boolean; label: string }>[];
}
const { width } = Dimensions.get("window");
const animated = new Animated.Value(0);

export default function SwipeableTabs(props: IProps) {
  let { children, onSwipe, labels, labelComponents } = props;
  onSwipe = onSwipe || (() => {});
  if (children && !children.length) children = [children];

  const TabStateWrapperRef = React.useRef<TabStateWrapper | undefined>(undefined);
  const selectedIndexRef = React.useRef(0);
  const TabBar = DefaultTabBar;
  const Tabs = children || [];
  const { isRTL } = I18nManager;

  const triggerSelection = useCallback((moveTo: number) => {
    selectedIndexRef.current = moveTo;
    let direction = isRTL ? 1 : -1;
    Animated.timing(animated, {
      toValue: direction * moveTo * width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      TabStateWrapperRef.current?.setState({ selectedIndex: moveTo });
      onSwipe!(moveTo);
    });
  }, [isRTL, onSwipe]);

  useEffect(() => {
    if (props.selectedIndex !== undefined) {
      triggerSelection(props.selectedIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedIndex]);

  return children && children.length ? (
    <View
      // onTouchStart={onTouchStart}
      // onTouchEnd={onTouchEnd}
      // onTouchMove={onTouchMove}
      style={styles.window}
    >
      {!!labels && (
        <TabStateWrapper
          //@ts-ignore
          ref={TabStateWrapperRef}
          TabBar={TabBar}
          labels={labels}
          tabCount={Tabs.length}
          selectedIndex={selectedIndexRef.current}
          labelComponents={labelComponents}
          onPress={(i) => setTimeout(() => triggerSelection(i), 0)}
        />
      )}
      <Animated.View
        style={[
          styles.body,
          {
            width: width * Tabs.length,
            transform: [{ translateX: animated }],
          },
        ]}
      >
        {Tabs.map((tab: any, index: number) => (
          <View key={index} style={styles.tab}>
            {tab}
          </View>
        ))}
      </Animated.View>
    </View>
  ) : null;
}
const styles = StyleSheet.create({
  window: {
    width: "100%",
    height: "100%",
    maxHeight: "100%",
    flexDirection: "column",
    overflow: "hidden",
  },
  body: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flex: 1,
  },
  tab: {
    width,
    overflow: "hidden",
    height: "100%",
  },
});

export interface ITabProps {
  labels: string[];
  selectedIndex: number;
  tabCount: number;
  onPress?: (index: number) => void;
  labelComponents?: React.FC<{ selected: boolean; label: string }>[];
}

class TabStateWrapper extends React.Component<
  { TabBar: any } & ITabProps,
  { selectedIndex: number }
> {
  constructor(props: any) {
    super(props);
    this.state = { selectedIndex: props.selectedIndex };
  }
  render() {
    const { TabBar } = this.props;
    return <TabBar {...this.props} selectedIndex={this.state.selectedIndex} />;
  }
  componentDidUpdate(prevProps: Readonly<{ TabBar: any } & ITabProps>): void {
    if (prevProps.selectedIndex !== this.props.selectedIndex)
      this.setState({ selectedIndex: this.props.selectedIndex });
  }
}
