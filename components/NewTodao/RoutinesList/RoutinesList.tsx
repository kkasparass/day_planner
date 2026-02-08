import { FlatList, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { useRoutineEffortList } from "./useRoutineEffortList";

export const RoutinesList = ({
  onRoutineSelect,
}: {
  onRoutineSelect: (id: number) => void;
}) => {
  const { routines } = useRoutineEffortList();

  return (
    <FlatList
      data={routines}
      style={styles.listContainer}
      renderItem={({ item: { id, totalEffort, title } }) => (
        <TouchableRipple
          key={id}
          style={styles.timelineButton}
          onPress={() => onRoutineSelect(id)}
          rippleColor="rgba(0, 0, 0, .32)"
        >
          <View>
            <Text style={{ fontSize: 17 }}>
              {title} | {totalEffort}
            </Text>
          </View>
        </TouchableRipple>
      )}
      keyExtractor={(item) => `${item.id}`}
    />
  );
};

const styles = StyleSheet.create({
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
