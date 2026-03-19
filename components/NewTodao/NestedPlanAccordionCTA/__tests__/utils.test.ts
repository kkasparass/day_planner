import { resolveDaysOver } from "../utils";

describe("resolveDaysOver", () => {
  it("returns -10 when repeatFreq is 0", () => {
    expect(resolveDaysOver(0, null)).toBe(-10);
    expect(resolveDaysOver(0, new Date())).toBe(-10);
  });

  it("returns 1 when lastDone is null (never done)", () => {
    expect(resolveDaysOver(7, null)).toBe(1);
  });

  it("returns a negative number when repeat is not yet due", () => {
    // lastDone = 2 days ago, repeatFreq = 7 → due in 5 days → daysOver = -5
    const lastDone = new Date();
    lastDone.setDate(lastDone.getDate() - 2);
    expect(resolveDaysOver(7, lastDone)).toBeLessThan(0);
  });

  it("returns 0 when due exactly today", () => {
    // lastDone = 7 days ago, repeatFreq = 7 → repeatBy = today
    const lastDone = new Date();
    lastDone.setDate(lastDone.getDate() - 7);
    expect(resolveDaysOver(7, lastDone)).toBe(0);
  });

  it("returns a positive number when overdue", () => {
    // lastDone = 10 days ago, repeatFreq = 7 → overdue by 3 days
    const lastDone = new Date();
    lastDone.setDate(lastDone.getDate() - 10);
    expect(resolveDaysOver(7, lastDone)).toBe(3);
  });
});
