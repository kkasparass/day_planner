import { useState } from "react";
import { InputDialog, InputDialogProps } from "./InputDialog";
import { EffortOptionsInput } from "../effortManagement/EffortOptionsInput/EffortOptionsInput";

export const LabelEffortDialog = ({
  isVisible,
  onSubmit,
  effort,
  ...inputDialogProps
}: Omit<InputDialogProps, "onTextSubmit"> & {
  onSubmit: (label: string, effort: number) => void;
  effort: number;
}) => {
  const [effortValue, setEffortValue] = useState(effort);

  const handleSubmit = async (labelText: string) => {
    await onSubmit(labelText, effortValue);
  };

  if (!isVisible) {
    return;
  }

  return (
    <InputDialog
      isVisible={isVisible}
      onTextSubmit={handleSubmit}
      {...inputDialogProps}
    >
      <EffortOptionsInput value={effortValue} onChange={setEffortValue} />
    </InputDialog>
  );
};
