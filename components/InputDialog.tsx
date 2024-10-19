import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

export const InputDialog = ({
  isVisible,
  onDismiss,
  onTextSubmit,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onTextSubmit: (label: string) => void;
}) => {
  const [todaoText, setTodaoText] = useState("");

  const handleTextSubmit = async () => {
    await onTextSubmit(todaoText);
    setTodaoText("");
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onDismiss}>
        <Dialog.Title>Text input</Dialog.Title>
        <Dialog.Content
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: 15,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            style={{ width: 230 }}
            label="Todo"
            defaultValue={todaoText}
            onChangeText={(text) => setTodaoText(text)}
          />
          <Button mode="contained" onPress={handleTextSubmit}>
            +
          </Button>
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
