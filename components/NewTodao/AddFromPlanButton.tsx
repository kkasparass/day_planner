import { STATUS_COLORS } from "@/constants/Colors";
import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

const resolveBorderColor = (daysOver: number) => {
  switch (true) {
    case daysOver < -5:
      return STATUS_COLORS.default;
    case daysOver < 0:
      return STATUS_COLORS.success;
    case daysOver === 0:
      return STATUS_COLORS.noData;
    case daysOver === 1:
      return STATUS_COLORS.warning;
    case daysOver > 1:
      return STATUS_COLORS.alert;
    default:
      return STATUS_COLORS.default;
  }
};

const resolveEffortColor = (
  effort: number,
  currentEffortTotal: number,
  effortCap: number
) => {
  switch (true) {
    case effort === 0:
      return STATUS_COLORS.success;
    case effort + currentEffortTotal <= effortCap:
      return STATUS_COLORS.success;
    case effort + currentEffortTotal > effortCap:
      return STATUS_COLORS.alert;
    default:
      return STATUS_COLORS.default;
  }
};

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
        marginTop: 10,
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: `${STATUS_COLORS.default}20`,
        borderWidth: 1,
        borderColor: resolveBorderColor(daysOver),
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
      onPress={onPress}
      rippleColor="rgba(0, 0, 0, .32)"
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View>
          <Text style={{ fontSize: 17 }}>{label}</Text>
          <Text style={{ fontSize: 12 }}>{lastDone}</Text>
        </View>
        <View>
          <Text
            style={{
              display: "flex",
              borderRadius: 50,
              padding: 6,
              backgroundColor: resolveEffortColor(
                effort ?? 0,
                currentEffortTotal,
                energyCap
              ),
              fontSize: 8,
            }}
          >
            {effort}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};
