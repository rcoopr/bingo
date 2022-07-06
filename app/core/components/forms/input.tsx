import { forwardRef } from "react";

import clsx from "clsx";

export const TextInput = forwardRef(
  (
    props: JSX.IntrinsicElements["input"] & {
      error?: boolean | string;
    },
    ref: React.ClassAttributes<HTMLInputElement>["ref"]
  ) => {
    const { className, error, ...inputProps } = props;

    return (
      <>
        <input
          ref={ref}
          className={clsx(
            className,
            error && "border-red-500",
            "w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm ring-indigo-500 focus:outline-none focus:ring-2"
          )}
          type="text"
          aria-invalid={!!error}
          aria-errormessage={
            typeof error === "string" ? error : "Invalid input"
          }
          {...inputProps}
        />
        {error && (
          <p
            className="text-xs italic text-red-500"
            id={`${inputProps.id}-error`}
          >
            {typeof error === "string" ? error : "Invalid input"}
          </p>
        )}
      </>
    );
  }
);
TextInput.displayName = "TextInput";
