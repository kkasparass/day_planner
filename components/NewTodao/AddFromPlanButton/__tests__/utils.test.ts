import { STATUS_COLORS } from "@/constants/Colors";
import { resolveBorderColor, resolveEffortColor } from "../utils";

describe("resolveBorderColor", () => {
  it("returns default color when daysOver < -5", () => {
    expect(resolveBorderColor(-10)).toBe(STATUS_COLORS.default);
    expect(resolveBorderColor(-6)).toBe(STATUS_COLORS.default);
  });

  it("returns success color when daysOver is between -5 and -1 inclusive", () => {
    expect(resolveBorderColor(-5)).toBe(STATUS_COLORS.success);
    expect(resolveBorderColor(-1)).toBe(STATUS_COLORS.success);
  });

  it("returns noData color when daysOver is exactly 0", () => {
    expect(resolveBorderColor(0)).toBe(STATUS_COLORS.noData);
  });

  it("returns warning color when daysOver is exactly 1", () => {
    expect(resolveBorderColor(1)).toBe(STATUS_COLORS.warning);
  });

  it("returns alert color when daysOver > 1", () => {
    expect(resolveBorderColor(2)).toBe(STATUS_COLORS.alert);
    expect(resolveBorderColor(100)).toBe(STATUS_COLORS.alert);
  });
});

describe("resolveEffortColor", () => {
  it("returns success when effort is 0", () => {
    expect(resolveEffortColor(0, 5, 10)).toBe(STATUS_COLORS.success);
  });

  it("returns success when effort + currentTotal fits within cap", () => {
    expect(resolveEffortColor(3, 5, 10)).toBe(STATUS_COLORS.success);
    expect(resolveEffortColor(5, 5, 10)).toBe(STATUS_COLORS.success);
  });

  it("returns alert when effort + currentTotal exceeds cap", () => {
    expect(resolveEffortColor(6, 5, 10)).toBe(STATUS_COLORS.alert);
  });
});
