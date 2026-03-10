import { KeyboardTypeOptions, StyleSheet, View } from "react-native";
import { FC, ReactNode, useState } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

export type InputDialogProps = {
  defaultValue?: string;
  title?: string;
  triggerLabel?: string;
  isVisible: boolean;
  onDismiss: () => void;
  onTextSubmit: (label: string) => void;
  children?: ReactNode;
  keyboardType?: KeyboardTypeOptions;
  inputLabel?: string;
};

export const InputDialog: FC<InputDialogProps> = ({
  defaultValue,
  title,
  triggerLabel,
  inputLabel,
  isVisible,
  onDismiss,
  onTextSubmit,
  children,
  keyboardType,
}) => {
  const [text, setText] = useState(defaultValue ?? "");

  const handleTextSubmit = async () => {
    await onTextSubmit(text);
    setText("");
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onDismiss}>
        <Dialog.Title>{title ?? "Text input"}</Dialog.Title>
        <Dialog.Content style={styles.dialogContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={{ flexGrow: 1, flexShrink: 1 }}
              label={inputLabel ?? "Todo"}
              keyboardType={keyboardType}
              defaultValue={defaultValue ?? text}
              onChangeText={(text) => setText(text)}
            />
            <Button mode="contained" onPress={handleTextSubmit}>
              {triggerLabel ?? "+"}
            </Button>
          </View>
          {children}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    columnGap: 25,
    alignItems: "center",
  },
});
