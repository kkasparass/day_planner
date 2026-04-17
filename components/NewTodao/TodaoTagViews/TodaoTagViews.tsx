import React from "react";
import { View } from "react-native";
import { PlanningCategory } from "@/types/types";
import SwipeableTabs from "../../SwipeTabs/SwipeableTabs";
import { TodaoPlanList } from "../TodaoPlanList";
import { useCategoryTags } from "@/hooks/useCategoryTags";
import { RoutinesList } from "../RoutinesList/RoutinesList";

export const TodaoTagViews = ({
  onTextSubmit,
  energyCap,
  currentEffortTotal,
  onRoutineSelect,
}: {
  onTextSubmit: (label: string, cat?: PlanningCategory) => void;
  onRoutineSelect: (id: number) => void;
  energyCap: number;
  currentEffortTotal: number;
}) => {
  const { tags, selectedIndex } = useCategoryTags({ hasRoutines: true });

  return (
    <View style={{ height: 550 }}>
      <SwipeableTabs
        selectedIndex={selectedIndex}
        labels={tags.map((tag) => (tag === null ? "all" : tag))}
      >
        {tags.map((tag) =>
          tag === "Routines" ? (
            <RoutinesList
              key="unique_routines-section"
              onRoutineSelect={onRoutineSelect}
            />
          ) : (
            <TodaoPlanList
              onTextSubmit={onTextSubmit}
              tag={tag}
              key={tag}
              energyCap={energyCap}
              currentEffortTotal={currentEffortTotal}
            />
          ),
        )}
      </SwipeableTabs>
    </View>
  );
};
