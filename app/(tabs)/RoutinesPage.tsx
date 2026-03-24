import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button, Divider } from "react-native-paper";
import { InputDialog } from "@/components/dialogs/InputDialog";
import { Routine } from "@/components/Routines/Routine/Routine";
import { useRoutinesPage } from "@/components/Routines/useRoutinesPage";
import { NestableScrollContainer } from "react-native-draggable-flatlist";

export default function RoutinesPage() {
  const {
    routines,
    newRoutinedialogVisible,
    handleNewRoute,
    openNewRoutineDialog,
    closeNewRoutineDialog,
    handleReloadDB,
  } = useRoutinesPage();

  if (!routines) {
    return null;
  }

  return (
    <ParallaxScrollView title="Routines">
      <Button
        mode="contained"
        style={styles.newRoutineButton}
        onPress={openNewRoutineDialog}
      >
        New Routine
      </Button>

      <Divider />

      <NestableScrollContainer>
        {routines.map((routine) => (
          <Routine
            routine={routine}
            key={routine.id}
            reloadRoutines={handleReloadDB}
          />
        ))}
      </NestableScrollContainer>

      <InputDialog
        isVisible={newRoutinedialogVisible}
        onDismiss={closeNewRoutineDialog}
        onTextSubmit={handleNewRoute}
        title="Add Routine"
        inputLabel="Routine Title"
        triggerLabel="Add"
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  newRoutineButton: { width: "100%", height: 40 },
});
