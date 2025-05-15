import { StyleSheet, View } from "react-native";
import { useRef, useState } from "react";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { TodaoTagViews } from "./TodaoTagViews";

export const NewTodaoDialog = ({
  isVisible,
  onDismiss,
  onTextSubmit,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onTextSubmit: (label: string, catId?: number) => void;
}) => {
  const [todaoText, setTodaoText] = useState("");
  const input = useRef(null);

  const handleUpdateChecked = () => {
    onTextSubmit(todaoText);
    setTodaoText("");
    input.current.clear();
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onDismiss}
        style={{
          height: "100%",
          paddingTop: 100,
          width: "100%",
          backgroundColor: "black",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
            paddingHorizontal: 15,
          }}
        >
          <Text variant="displayMedium">New Todao</Text>
          <Button mode="contained" onPress={onDismiss}>
            X
          </Button>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            columnGap: 15,
            marginBottom: 20,
            paddingHorizontal: 15,
          }}
        >
          <TextInput
            style={{ width: "70%" }}
            label="Todo"
            ref={input}
            defaultValue={todaoText}
            onChangeText={(text) => setTodaoText(text)}
          />
          <Button
            mode="contained"
            onPress={handleUpdateChecked}
            style={{ width: "25%" }}
          >
            Add
          </Button>
        </View>
        <TodaoTagViews onTextSubmit={onTextSubmit} />
      </Modal>
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
