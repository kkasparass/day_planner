import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { TodoTimeline, TodoTimelineItem } from "@/types/types";

export const TimelineListDialog = ({
  isVisible,
  onDismiss,
  onTimelineSelect,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onTimelineSelect: (timelineId: number) => void;
}) => {
  const db = useSQLiteContext();
  const [todaoTimeline, setTodaoTimeline] = useState<TodoTimeline>();
  const [reloadDB, setReloadDB] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setReloadDB(true);
    }
  }, [isVisible]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<TodoTimelineItem>(
        "SELECT * FROM todao_timeline ORDER BY id DESC"
      );
      setTodaoTimeline(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onDismiss}
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "black",
          alignItems: "flex-start",
          paddingBottom: 50,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
            paddingHorizontal: 15,
            width: "100%",
          }}
        >
          <Text variant="displayMedium">Timelines</Text>
          <Button mode="contained" onPress={onDismiss}>
            X
          </Button>
        </View>
        <FlatList
          data={todaoTimeline}
          renderItem={({ item: todoDay }) => (
            <TouchableRipple
              style={{
                marginTop: 10,
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-start",
                backgroundColor: "#BB86FC",
                borderRadius: 15,
                paddingHorizontal: 15,
                paddingVertical: 10,
              }}
              onPress={() => onTimelineSelect(todoDay.id)}
              rippleColor="rgba(0, 0, 0, .32)"
            >
              <View>
                <Text style={{ fontSize: 17 }}>
                  {new Date(todoDay.date).toDateString()}
                </Text>
              </View>
            </TouchableRipple>
          )}
          keyExtractor={(item) => `${item.id}`}
        />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
