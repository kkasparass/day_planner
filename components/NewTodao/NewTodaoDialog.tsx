import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useRef, useState } from "react";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { TodaoTagViews } from "./TodaoTagViews/TodaoTagViews";
import { PlanningCategory } from "@/types/types";
import { EffortOptionsInput } from "../effortManagement/EffortOptionsInput/EffortOptionsInput";
import { Colors } from "@/constants/Colors";

export const NewTodaoDialog = ({
  isVisible,
  onDismiss,
  onTextSubmit,
  energyCap,
  currentEffortTotal,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onTextSubmit: (label: string, cat?: PlanningCategory) => void;
  energyCap: number;
  currentEffortTotal: number;
}) => {
  const [todaoText, setTodaoText] = useState("");
  const [todaoEffort, setTodaoEffort] = useState(0);
  const input = useRef(null);

  const handleNewTodo = () => {
    onTextSubmit(todaoText, { effort: todaoEffort } as PlanningCategory);
    setTodaoText("");
    (input as any).current.clear();
    setTodaoEffort(0);
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onDismiss}
        style={styles.modalContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.titleHeaderContainer}>
            <Text variant="displayMedium">New Todao</Text>
            <Button mode="contained" onPress={onDismiss}>
              X
            </Button>
          </View>
          <Text style={styles.efforTest}>
            {currentEffortTotal}/{energyCap}
          </Text>
          <View style={styles.labelInputContainer}>
            <TextInput
              style={{ width: "70%" }}
              label="Todo"
              ref={input}
              defaultValue={todaoText}
              onChangeText={(text) => setTodaoText(text)}
            />
            <Button
              mode="contained"
              onPress={handleNewTodo}
              style={{ width: "25%" }}
            >
              Add
            </Button>
          </View>
          <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
            <EffortOptionsInput value={todaoEffort} onChange={setTodaoEffort} />
          </View>
          <TodaoTagViews
            onTextSubmit={onTextSubmit}
            energyCap={energyCap}
            currentEffortTotal={currentEffortTotal}
          />
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.dark.background,
  },
  titleHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  efforTest: { paddingHorizontal: 15, fontSize: 16, marginBottom: 30 },
  labelInputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
});
