import { KeyboardTypeOptions, StyleSheet, View } from "react-native";
import { ReactNode, useState } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

export const InputDialog = ({
  defaultValue,
  title,
  triggerLabel,
  inputLabel,
  isVisible,
  onDismiss,
  onTextSubmit,
  children,
  keyboardType,
}: {
  defaultValue?: string;
  title?: string;
  triggerLabel?: string;
  isVisible: boolean;
  onDismiss: () => void;
  onTextSubmit: (label: string) => void;
  children?: ReactNode;
  keyboardType?: KeyboardTypeOptions;
  inputLabel?: string;
}) => {
  const [todaoText, setTodaoText] = useState(defaultValue ?? "");

  const handleTextSubmit = async () => {
    await onTextSubmit(todaoText);
    setTodaoText("");
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onDismiss}>
        <Dialog.Title>{title ?? "Text input"}</Dialog.Title>
        <Dialog.Content
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
          }}
        >
          <View
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
              label={inputLabel ?? "Todo"}
              keyboardType={keyboardType}
              defaultValue={defaultValue ?? todaoText}
              onChangeText={(text) => setTodaoText(text)}
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
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
