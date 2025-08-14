import { StyleSheet, View } from "react-native";
import { ReactNode, useState } from "react";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { InputDialog } from "./InputDialog";
import { EffortOptionsInput } from "../effortManagement/EffortOptionsInput/EffortOptionsInput";

export const EditCatDialog = ({
  isVisible,
  onDismiss,
  onSubmit,
  effort,
  label,
  title,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onSubmit: (label: string, effort: number) => void;
  effort: number;
  label: string;
  title?: string;
}) => {
  const [effortValue, setEffortValue] = useState(effort);

  const handleSubmit = async (labelText: string) => {
    await onSubmit(labelText, effortValue);
  };

  return (
    <InputDialog
      isVisible={isVisible}
      onDismiss={onDismiss}
      onTextSubmit={handleSubmit}
      title={title ?? "Edit Cat"}
      defaultValue={label}
      triggerLabel="edit"
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
        <EffortOptionsInput value={effortValue} onChange={setEffortValue} />
      </View>
    </InputDialog>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
