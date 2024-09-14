import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Button, Card, Dialog, Portal, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { PlanningCategories, PlanningCategory } from "@/types/types";
import { TodaoTagViews } from "./TodaoTagViews";

export const NewTodaoDialog = ({
  isVisible,
  onDismiss,
  onTextSubmit,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onTextSubmit: (label: string, catId?: number) => void;
}) => {
  const [todaoText, setTodaoText] = useState("");

  const handleUpdateChecked = () => {
    onTextSubmit(todaoText);
    setTodaoText("");
  };

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onDismiss}>
        <Dialog.Title>New Todo</Dialog.Title>
        <Dialog.Content>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 15,
              marginBottom: 20,
            }}
          >
            <TextInput
              style={{ width: 230 }}
              label="Todo"
              value={todaoText}
              onChangeText={(text) => setTodaoText(text)}
            />
            <Button mode="contained" onPress={handleUpdateChecked}>
              Add
            </Button>
          </View>
          <TodaoTagViews onTextSubmit={onTextSubmit} />
        </Dialog.Content>
      </Dialog>
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
