import { FlatList, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button, Divider } from "react-native-paper";
import { TimelineItem } from "@/components/TodaoTimeline/TimelineItem/TimelineItem";
import { useTodaoTimeline } from "@/components/TodaoTimeline/useTodaoTimeline";

export default function TodaoPage() {
  const { todaoTimeline, handleNewDay } = useTodaoTimeline();

  if (!todaoTimeline) {
    return null;
  }

  return (
    <ParallaxScrollView title="Todao">
      <Button
        mode="contained"
        style={styles.newDayButton}
        onPress={handleNewDay}
      >
        New Day
      </Button>

      <Divider />

      <FlatList
        data={todaoTimeline}
        renderItem={({ item: todoDay }) => (
          <TimelineItem timelineItem={todoDay} key={todoDay.id} />
        )}
        keyExtractor={(item) => `${item.id}`}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  newDayButton: { width: "100%", height: 40 },
});
