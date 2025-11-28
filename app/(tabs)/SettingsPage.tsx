import { useState } from "react";
import { ScrollView, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button } from "react-native-paper";
import { useSettingsPage } from "@/hooks/useSettingsPage";
import { InputDialog } from "@/components/dialogs/InputDialog";

export default function SettingsPage() {
  const {
    backupDatabase,
    restoreDatabase,
    deleteAllData,
    deleteTimeline,
    deleteTodos,
    deleteCategories,
  } = useSettingsPage();
  const [isBackupDialogVisible, setIsBackupDialogVisible] = useState(false);

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
          <View style={{ marginBottom: 1000 }} />
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
        </View>
      </ScrollView>
      <InputDialog
        isVisible={isBackupDialogVisible}
        onDismiss={() => setIsBackupDialogVisible(false)}
        onTextSubmit={backupDatabase}
        title="Backup filename"
        defaultValue={"test-db"}
        triggerLabel="backup"
        inputLabel="Filename"
      />
    </ParallaxScrollView>
  );
}
