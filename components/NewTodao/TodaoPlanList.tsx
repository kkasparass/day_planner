import { ScrollView, StyleSheet, View } from "react-native";

import { Card } from "react-native-paper";
import { PlanningCategory } from "@/types/types";
import { NestedPlanAccordionCTA } from "./NestedPlanAccordionCTA/NestedPlanAccordionCTA";
import { useParentCategories } from "@/hooks/useParentCategories";

export const TodaoPlanList = ({
  tag,
  onTextSubmit,
  energyCap,
  currentEffortTotal,
}: {
  tag: string | null;
  onTextSubmit: (label: string, cat?: PlanningCategory) => void;
  energyCap: number;
  currentEffortTotal: number;
}) => {
  const { categories } = useParentCategories({ tag });

  return (
    <View style={{ height: "100%" }}>
      <ScrollView>
        <View style={styles.listContainer}>
          {categories.map((cat) => (
            <Card key={cat.id} style={{ paddingHorizontal: 10 }}>
              <NestedPlanAccordionCTA
                onTextSubmit={onTextSubmit}
                cat={cat}
                energyCap={energyCap}
                currentEffortTotal={currentEffortTotal}
              />
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: { gap: 16, marginBottom: 100 },
});
