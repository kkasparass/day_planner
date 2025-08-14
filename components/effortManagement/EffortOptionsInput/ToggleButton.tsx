import { STATUS_COLORS } from "@/constants/Colors";
import { Button } from "react-native-paper";

export const ToggleButton = ({
  value,
  onChange,
  optionValue,
}: {
  value: number;
  onChange: (value: number) => void;
  optionValue: number;
}) => {
  return (
    <Button
      mode="contained"
      onPress={() => onChange(optionValue)}
      compact
      style={{
        backgroundColor:
          value === optionValue
            ? STATUS_COLORS.default
            : `${STATUS_COLORS.default}A0`,
        paddingHorizontal: 10,
      }}
    >
      {optionValue}
    </Button>
  );
};
