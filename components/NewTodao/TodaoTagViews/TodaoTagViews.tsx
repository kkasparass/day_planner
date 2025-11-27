import { View } from "react-native";
import { PlanningCategory } from "@/types/types";
import SwipeableTabs from "../../SwipeTabs/SwipeableTabs";
import { TodaoPlanList } from "../TodaoPlanList";
import { useCategoryTags } from "@/hooks/useCategoryTags";

export const TodaoTagViews = ({
  onTextSubmit,
  energyCap,
  currentEffortTotal,
}: {
  onTextSubmit: (label: string, cat?: PlanningCategory) => void;
  energyCap: number;
  currentEffortTotal: number;
}) => {
  const { tags, selectedIndex, setSelectedIndex } = useCategoryTags();

  return (
    <View style={{ height: 550 }}>
      <SwipeableTabs
        selectedIndex={selectedIndex}
        labels={tags.map((tag) => (tag === null ? "all" : tag))}
      >
        {tags.map((tag) => (
          <TodaoPlanList
            onTextSubmit={onTextSubmit}
            tag={tag}
            key={tag}
            energyCap={energyCap}
            currentEffortTotal={currentEffortTotal}
          />
        ))}
      </SwipeableTabs>
    </View>
  );
};
