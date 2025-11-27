import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { STATUS_COLORS } from "@/constants/Colors";
import { resolveBorderColor, resolveEffortColor } from "./utils";

export const AddFromPlanButton = ({
  lastDone,
  label,
  daysOver,
  onPress,
  effort,
  energyCap,
  currentEffortTotal,
}: {
  lastDone: string;
  label: string;
  daysOver: number;
  onPress: () => void;
  effort?: number;
  energyCap: number;
  currentEffortTotal: number;
}) => {
  return (
    <TouchableRipple
      style={{
        ...styles.optionContainer,
        borderColor: resolveBorderColor(daysOver),
      }}
      onPress={onPress}
      rippleColor="rgba(0, 0, 0, .32)"
    >
      <View style={styles.optionFlexContainer}>
        <View>
          <Text style={{ fontSize: 17 }}>{label}</Text>
          <Text style={{ fontSize: 12 }}>{lastDone}</Text>
        </View>
        <View>
          <Text
            style={{
              ...styles.effortText,
              backgroundColor: resolveEffortColor(
                effort ?? 0,
                currentEffortTotal,
                energyCap
              ),
            }}
          >
            {effort}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    marginTop: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: `${STATUS_COLORS.default}20`,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  optionFlexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  effortText: {
    display: "flex",
    borderRadius: 50,
    padding: 6,
    fontSize: 8,
  },
});
