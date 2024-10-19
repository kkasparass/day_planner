import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { Button, Checkbox, Text } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { RoutineItem as RoutineItemT } from "@/types/types";

export const RoutineItem = ({
  routineItem,
  reloadTodos,
}: {
  routineItem: RoutineItemT;
  reloadTodos: () => void;
}) => {
  const db = useSQLiteContext();

  const { id } = routineItem;

  const handleDelete = async () => {
    await db.runAsync("DELETE FROM routine_items WHERE id = $id", { $id: id });
    reloadTodos();
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Text>{routineItem.label}</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Button
          mode="contained"
          style={{ width: 50, height: "100%" }}
          onPress={handleDelete}
        >
          -
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
