import { STATUS_COLORS } from "@/constants/Colors";
import { useRef } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ToggleButton } from "./ToggleButton";

export const EffortOptionsInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <ToggleButton value={value} onChange={onChange} optionValue={0} />
        <ToggleButton value={value} onChange={onChange} optionValue={1} />
        <ToggleButton value={value} onChange={onChange} optionValue={2} />
        <ToggleButton value={value} onChange={onChange} optionValue={4} />
      </View>
      <TextInput
        style={{ width: "25%" }}
        label="Effort"
        keyboardType="numeric"
        onChangeText={(text) => {
          onChange(Number(text));
        }}
      />
    </View>
  );
};
