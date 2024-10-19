import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

const resolveBackgroundColor = (daysOver: number) => {
  switch (true) {
    case daysOver < -5:
      return "#BB86FC";
    case daysOver < 0:
      return "#215c0d";
    case daysOver === 0:
      return "#c7b244";
    case daysOver === 1:
      return "#d9824c";
    case daysOver > 1:
      return "#eb5252";
    default:
      return "#BB86FC";
  }
};

export const AddFromPlanButton = ({
  lastDone,
  label,
  daysOver,
  onPress,
}: {
  lastDone: string;
  label: string;
  daysOver: number;
  onPress: () => void;
}) => {
  return (
    <TouchableRipple
      style={{
        marginTop: 10,
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: resolveBackgroundColor(daysOver),
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
      onPress={onPress}
      rippleColor="rgba(0, 0, 0, .32)"
    >
      <View>
        <Text style={{ fontSize: 17 }}>{label}</Text>
        <Text style={{ fontSize: 12 }}>{lastDone}</Text>
      </View>
    </TouchableRipple>
  );
};
