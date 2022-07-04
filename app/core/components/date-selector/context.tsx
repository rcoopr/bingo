import { createContext, useContext, useState } from "react";

import { addDays } from "date-fns";
import type { DateRange } from "react-day-picker";

const today = new Date();
const defaultSelected: DateRange = {
  from: today,
  to: addDays(today, 4),
};

export type DateRangeContextValue = {
  state: DateRange | undefined;
  setState: (value: DateRange | undefined) => void;
};

export const DateRangeContext = createContext<
  DateRangeContextValue | undefined
>(undefined);

export const DateRangeProvider: React.FC = ({ children }) => {
  const [state, setState] =
    useState<DateRangeContextValue["state"]>(defaultSelected);

  const value: DateRangeContextValue = {
    state,
    setState,
  };

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
};

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }

  return context;
}
