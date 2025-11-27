import { add, differenceInDays } from "date-fns";

export const resolveDaysOver = (
  repeatFreq: number,
  lastDone: Date | null
): number => {
  if (repeatFreq === 0) {
    return -10;
  }
  if (lastDone === null) {
    return 1;
  }
  const today = new Date();
  const repeatBy = add(lastDone, { days: repeatFreq });
  return differenceInDays(today, repeatBy);
};
