import clsx from "clsx";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import { useControlField, useField } from "remix-validated-form";
import { z } from "zod";

const today = new Date();

export function DatePickerRVF({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const { getInputProps } = useField(name);
  const { error: errFrom, validate: validateFrom } = useField(`${name}.from`);
  const { error: errTo, validate: validateTo } = useField(`${name}.to`);

  const error =
    errFrom === z.ZodIssueCode.invalid_date ? undefined : errFrom || errTo;

  const [dateRange, setDateRange] = useControlField<DateRange | undefined>(
    name
  );
  const { onChange, onBlur } = getInputProps();

  return (
    <>
      <input
        type="hidden"
        name={`${name}.from`}
        value={dateRange?.from?.toDateString() ?? ""}
      />
      <input
        type="hidden"
        name={`${name}.to`}
        value={dateRange?.to?.toDateString() ?? ""}
      />
      <DayPicker
        onDayClick={onChange}
        onDayBlur={onBlur}
        mode="range"
        defaultMonth={today}
        selected={dateRange}
        footer={
          <Footer
            from={dateRange?.from}
            to={dateRange?.to}
            error={errFrom === z.ZodIssueCode.invalid_date}
          />
        }
        onSelect={(range: DateRange | undefined) => {
          validateFrom();
          validateTo();
          setDateRange(range);
        }}
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
      {/* Don't expect this to ever show */}
      {error && (
        <div className="pt-1 text-red-700" id="start-error">
          {error}
        </div>
      )}
    </>
  );
}

const Footer = ({
  from,
  to,
  error,
}: {
  from?: Date;
  to?: Date;
  error?: boolean;
}) => {
  let first: string | undefined = undefined;
  let last: string | undefined = undefined;

  if (!from && !to) {
    first = "Select a start date";
  } else if (from && !to) {
    first = format(from, "PPP");
  } else if (from && to) {
    first = format(from, "PPP");
    last = format(to, "PPP");
  } else {
    first = "to and no from";
    last = undefined;
  }

  // return <div className="flex justify-between pt-2">{contents}</div>;

  return (
    <div
      className={clsx("grid h-12 items-center", error && "text-error")}
      style={{ gridTemplateColumns: "1fr 1em 1fr" }}
    >
      <div className={clsx("text-center", !last && "col-span-3")}>{first}</div>
      <div className={clsx(!last && "hidden", "text-center")}>-</div>
      <div className={clsx(!last && "hidden", "text-center")}>{last}</div>
    </div>
  );
};
