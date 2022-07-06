import React from "react";

import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import styles from "react-day-picker/dist/style.css";

import customStyles from "./rdp.css";

export { DateRangeSelector };

const today = new Date();

function DateRangeSelector({
  range,
  setRange,
}: {
  range?: DateRange;
  setRange: (range?: DateRange) => void;
}) {
  return (
    <DayPicker
      // className={customStyles}
      mode="range"
      defaultMonth={today}
      selected={range}
      footer={<Footer from={range?.from} to={range?.to} />}
      onSelect={setRange}
      showOutsideDays
      modifiersStyles={{
        outside: {
          opacity: 0.2,
        },
        today: {
          fontWeight: "bold",
        },
      }}
    />
  );
}

DateRangeSelector.styles = styles;

const Footer = ({ from, to }: { from?: Date; to?: Date }) => {
  if (!from && !to) {
    return (
      <div className="mt-2 flex justify-between rounded-full border border-slate-300 bg-slate-200 px-2.5 py-0.5 font-semibold">
        <p>Select a start date</p>
      </div>
    );
  }

  if (from && !to) {
    return (
      <div className="mt-2 flex justify-between rounded-full border border-slate-300 bg-slate-200 px-2.5 py-0.5 font-semibold">
        <p>{format(from, "PPP")}</p>
      </div>
    );
  }

  if (!from && to) {
    return (
      <div className="mt-2 flex justify-between rounded-full border border-slate-300 bg-slate-200 px-2.5 py-0.5 font-semibold">
        <p></p>
        <p>-</p>
        <p>{format(to, "PPP")}</p>;
      </div>
    );
  }

  return (
    <div className="mt-2 flex justify-between rounded-full border border-slate-300 bg-slate-200 px-2.5 py-0.5 font-semibold">
      <p>{format(from!, "PPP")}</p>
      <p>-</p>
      <p>{format(to!, "PPP")}</p>
    </div>
  );
};
