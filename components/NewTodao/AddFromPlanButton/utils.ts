import { STATUS_COLORS } from "@/constants/Colors";

export const resolveBorderColor = (daysOver: number) => {
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

export const resolveEffortColor = (
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
