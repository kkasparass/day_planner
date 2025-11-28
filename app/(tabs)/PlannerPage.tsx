import { PlanList } from "@/components/PlanList";
import { SafeAreaView } from "react-native-safe-area-context";
import SwipeableTabs from "@/components/SwipeTabs/SwipeableTabs";
import { useCategoryTags } from "@/hooks/useCategoryTags";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function PlannerPage() {
  const { tags, selectedIndex, setSelectedIndex } = useCategoryTags();

  return (
    <ParallaxScrollView title="Categories" fullWidth>
      <SafeAreaView>
        <SwipeableTabs
          selectedIndex={selectedIndex}
          labels={tags.map((tag) => (tag === null ? "all" : tag))}
        >
          {tags.map((tag) => (
            <PlanList tag={tag} key={tag} />
          ))}
        </SwipeableTabs>
      </SafeAreaView>
    </ParallaxScrollView>
  );
}
