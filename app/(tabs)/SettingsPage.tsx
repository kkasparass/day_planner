import { useState } from "react";
import { ScrollView, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button } from "react-native-paper";
import { useSettingsPage } from "@/hooks/useSettingsPage";
import { InputDialog } from "@/components/dialogs/InputDialog";
import { SettingsDataOptionsDialog } from "@/components/dialogs/SettingsDataOptionsDialog";

export default function SettingsPage() {
  const {
    userSettings,
    updateInitialEffort,
    runCustomDBCommand,
    backupDatabase,
    restoreDatabase,
    deleteAllData,
    deleteTimeline,
    deleteTodos,
    deleteCategories,
  } = useSettingsPage();
  const [isBackupDialogVisible, setIsBackupDialogVisible] = useState(false);
  const [isEffortDialogVisible, setIsEffortDialogVisible] = useState(false);
  const [isDataOptionsDialogVisible, setIsDataOptionsDialogVisible] =
    useState(false);

  return (
    <ParallaxScrollView title="Settings">
      <ScrollView>
        <View style={{ display: "flex", gap: 16 }}>
          <Button
            mode="contained"
            onPress={() => setIsBackupDialogVisible(true)}
          >
            Backup all data
          </Button>
          <Button mode="contained" onPress={() => restoreDatabase()}>
            Restore data
          </Button>
          <View style={{ marginBottom: 50 }} />
          <Button
            mode="contained"
            onPress={() => setIsEffortDialogVisible(true)}
          >
            Update initial effort | Currently: {userSettings?.initialEffort}
          </Button>
          <View style={{ marginBottom: 50 }} />
          <Button
            mode="contained"
            onPress={() => setIsDataOptionsDialogVisible(true)}
          >
            Show data deletion options
          </Button>
          <View style={{ marginBottom: 50 }} />
          <Button mode="contained" onPress={() => runCustomDBCommand()}>
            Run custom DB command (for testing)
          </Button>
        </View>
      </ScrollView>
      <SettingsDataOptionsDialog
        isVisible={isDataOptionsDialogVisible}
        onDismiss={() => setIsDataOptionsDialogVisible(false)}
        deleteAllData={deleteAllData}
        deleteTimeline={deleteTimeline}
        deleteTodos={deleteTodos}
        deleteCategories={deleteCategories}
      />
      <InputDialog
        isVisible={isBackupDialogVisible}
        onDismiss={() => setIsBackupDialogVisible(false)}
        onTextSubmit={backupDatabase}
        title="Backup filename"
        defaultValue={"test-db"}
        triggerLabel="backup"
        inputLabel="Filename"
      />
      <InputDialog
        isVisible={isEffortDialogVisible}
        onDismiss={() => setIsEffortDialogVisible(false)}
        onTextSubmit={updateInitialEffort}
        keyboardType="numeric"
        title="Update initial effort"
        defaultValue={userSettings?.initialEffort?.toString()}
        triggerLabel="update"
        inputLabel="New effort value"
      />
    </ParallaxScrollView>
  );
}
