import { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, Card, Divider, Text, TextInput } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { EditNestedPlanItem } from "@/components/EditCat/EditNestedPlanItem";
import { useSingleCategory } from "@/hooks/useSingleCategory";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function CatEdit() {
  const { id } = useLocalSearchParams();
  const {
    category: baseCategory,
    editTag,
    reloadDB,
  } = useSingleCategory({
    id: Number(id),
  });
  const [inputText, setInputText] = useState("");

  const handleTextSubmit = async () => {
    await editTag(inputText);
  };

  if (!baseCategory) {
    return;
  }

  return (
    <ParallaxScrollView fullWidth>
      <ScrollView>
        <Text style={{ marginTop: 15, marginBottom: 5 }}>
          Add plan tree tag
        </Text>
        <View style={styles.inputRowContainer}>
          <TextInput
            style={{ width: "75%" }}
            label="Tag"
            defaultValue={baseCategory?.tag ?? ""}
            onChangeText={(text) => setInputText(text)}
          />
          <Button
            mode="contained"
            onPress={handleTextSubmit}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            Edit
          </Button>
        </View>
        <Divider style={{ marginVertical: 15 }} />
        <Card key={baseCategory.id} style={{ paddingHorizontal: 10 }}>
          <EditNestedPlanItem cat={baseCategory} reloadParent={reloadDB} />
        </Card>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  inputRowContainer: {
    display: "flex",
    flexDirection: "row",
    columnGap: 15,
    marginHorizontal: 15,
  },
});
