import React from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
    <ParallaxScrollView title="Todos">
      <Button
        mode="contained"
        style={styles.newDayButton}
        onPress={handleNewDay}
      >
        New Day
      </Button>

      <Divider />
      <ScrollView>
        {todaoTimeline.map((todoDay) => (
          <TimelineItem timelineItem={todoDay} key={todoDay.id} />
        ))}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  newDayButton: { width: "100%", height: 40 },
});
