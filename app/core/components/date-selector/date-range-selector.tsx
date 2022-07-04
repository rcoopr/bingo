import React, { useState } from "react";

import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import styles from "react-day-picker/dist/style.module.css";

import { useDateRange } from "./context";

const pastMonth = new Date(2020, 10, 15);

export function DateRangeSelector() {
  const { state: range, setState: setRange } = useDateRange();
  // const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

  let footer = <p>Please pick the first day.</p>;
  if (range?.from) {
    if (!range.to) {
      footer = <p>{format(range.from, "PPP")}</p>;
    } else if (range.to) {
      footer = (
        <p>
          {format(range.from, "PPP")}–{format(range.to, "PPP")}
        </p>
      );
    }
  }

  return (
    <DayPicker
      mode="range"
      defaultMonth={pastMonth}
      selected={range}
      footer={footer}
      onSelect={setRange}
      classNames={styles}
    />
  );
}
