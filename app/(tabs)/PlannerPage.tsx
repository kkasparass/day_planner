import React from "react";
import { PlanList } from "@/components/PlanList";
import SwipeableTabs from "@/components/SwipeTabs/SwipeableTabs";
import { useCategoryTags } from "@/hooks/useCategoryTags";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function PlannerPage() {
  const { tags, selectedIndex } = useCategoryTags({});

  return (
    <ParallaxScrollView title="Categories" fullWidth>
      <SwipeableTabs
        selectedIndex={selectedIndex}
        labels={tags.map((tag) => (tag === null ? "all" : tag))}
      >
        {tags.map((tag) => (
          <PlanList tag={tag} key={tag} />
        ))}
      </SwipeableTabs>
    </ParallaxScrollView>
  );
}
