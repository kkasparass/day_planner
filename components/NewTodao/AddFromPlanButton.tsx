import { View } from "react-native";
import { Button, Divider, FAB, List, Text } from "react-native-paper";

export const AddFromPlanButton = ({
  lastDone,
  label,
  onPress,
}: {
  lastDone: string;
  label: string;
  onPress: () => void;
}) => {
  return (
    <Button
      style={{
        marginTop: 10,
        height: 50,
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
      onPress={onPress}
    >
      <View>
        <Text style={{ fontSize: 17 }}>{label}</Text>
        <Text style={{ fontSize: 12 }}>{lastDone}</Text>
      </View>
    </Button>
  );
};
