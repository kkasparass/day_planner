import { FlatList, StyleSheet, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useTimelineListDialog } from "./useTimelineListDialog";
import { Colors } from "@/constants/Colors";

export const TimelineListDialog = ({
  isVisible,
  onDismiss,
  onTimelineSelect,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onTimelineSelect: (timelineId: number) => void;
}) => {
  const { todaoTimeline } = useTimelineListDialog({ isVisible });

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onDismiss}
        style={styles.modalContainer}
      >
        <View style={styles.header}>
          <Text variant="displayMedium">Timelines</Text>
          <Button mode="contained" onPress={onDismiss}>
            X
          </Button>
        </View>
        <FlatList
          data={todaoTimeline}
          style={styles.listContainer}
          renderItem={({ item: todoDay }) => (
            <TouchableRipple
              style={styles.timelineButton}
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
  modalContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.dark.background,
    alignItems: "flex-start",
    paddingBottom: 50,
    paddingHorizontal: 16,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
    paddingHorizontal: 15,
    width: "100%",
  },
  timelineButton: {
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#BB86FC",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  listContainer: {
    display: "flex",
    gap: 16,
  },
});
