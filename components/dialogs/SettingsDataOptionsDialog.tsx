import React from "react";
import { StyleSheet } from "react-native";
import { FC } from "react";
import { Button, Dialog, Portal } from "react-native-paper";

export type SettingsDataOptionsDialogProps = {
  deleteAllData: () => Promise<void>;
  deleteTimeline: () => Promise<void>;
  deleteTodos: () => Promise<void>;
  deleteCategories: () => Promise<void>;
  isVisible: boolean;
  onDismiss: () => void;
};

export const SettingsDataOptionsDialog: FC<SettingsDataOptionsDialogProps> = ({
  deleteAllData,
  deleteTimeline,
  deleteTodos,
  deleteCategories,
  isVisible,
  onDismiss,
}) => {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onDismiss}>
        <Dialog.Title>{"Data deletion options"}</Dialog.Title>
        <Dialog.Content style={styles.dialogContainer}>
          <Button mode="contained" onPress={deleteAllData}>
            Deleta all data
          </Button>
          <Button mode="contained" onPress={deleteTimeline}>
            Deleta timeline
          </Button>
          <Button mode="contained" onPress={deleteTodos}>
            Deleta individual todos
          </Button>
          <Button mode="contained" onPress={deleteCategories}>
            Deleta all categories
          </Button>
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
