import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, FAB } from "react-native-paper";
import { NestedPlanAccordion } from "@/components/NestedPlanAccordion";
import { useParentCategories } from "@/hooks/useParentCategories";
import { LabelEffortDialog } from "./dialogs/LabelEffortDialog";

export const PlanList = ({ tag }: { tag: string | null }) => {
  const { categories, addParentCaregory, refreshDB } = useParentCategories({
    tag,
  });
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <ScrollView>
        <View style={{ gap: 15, marginBottom: 100 }}>
          {categories.map((cat) => (
            <Card key={cat.id} style={{ paddingHorizontal: 10 }}>
              <NestedPlanAccordion cat={cat} reloadParent={refreshDB} isBase />
            </Card>
          ))}
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
      />
      <LabelEffortDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={addParentCaregory}
        effort={0}
        defaultValue=""
        title="New Cat"
        triggerLabel="add"
        inputLabel="Cat Name"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
