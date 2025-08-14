import { StyleSheet, View, ScrollView } from "react-native";

import { Button, Card, Divider, Text, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { PlanningCategory } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import { EditNestedPlanItem } from "@/components/EditCat/EditNestedPlanItem";

export default function CatEdit() {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();
  const [baseCategory, setBaseCategory] = useState<PlanningCategory | null>(
    null
  );
  const [reloadDB, setReloadDB] = useState(true);
  const [inputText, setInputText] = useState(baseCategory?.tag ?? "");

  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<PlanningCategory>(
        `SELECT * FROM planning_categories WHERE id=${id}`
      );
      setBaseCategory(result);
      setInputText(result?.tag ?? "");
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  const handleEditTag = async (tag: string) => {
    await db.runAsync("UPDATE planning_categories SET tag = ? WHERE id = ?", [
      tag,
      id as string,
    ]);
    setReloadDB(true);
  };

  const handleTextSubmit = async () => {
    await handleEditTag(inputText);
  };

  if (!baseCategory) {
    return;
  }

  return (
    <>
      <ScrollView>
        <Text style={{ marginTop: 15, marginBottom: 5 }}>
          Add plan tree tag
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: 15,
            marginHorizontal: 15,
          }}
        >
          <TextInput
            style={{ width: "75%" }}
            label="Tag"
            defaultValue={inputText}
            onChangeText={(text) => setInputText(text)}
          />
          <Button mode="contained" onPress={handleTextSubmit}>
            Edit
          </Button>
        </View>
        <Divider style={{ marginVertical: 15 }} />
        <Card key={baseCategory.id} style={{ paddingHorizontal: 10 }}>
          <EditNestedPlanItem
            cat={baseCategory}
            reloadParent={() => setReloadDB(true)}
          />
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
