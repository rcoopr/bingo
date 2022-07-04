import * as React from "react";

import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import styles from "react-day-picker/dist/style.css";
import { getFormData, useFormInputProps } from "remix-params-helper";
import { z } from "zod";

import { requireAuthSession } from "~/core/auth/guards";
import { commitAuthSession } from "~/core/auth/session.server";
import { assertIsPost } from "~/core/utils/http.server";
import { createGame } from "~/modules/game/mutations";

import customStyles from "./rdp.css";

const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

export const NewGameFormSchema = z.object({
  title: z.string().min(2, "require-title"),
  description: z.string().optional(),
  startDate: dateSchema,
  endDate: dateSchema,
});

type NewGameFormData = z.infer<typeof NewGameFormSchema>;

type ActionData = {
  errors?: {
    [K in keyof NewGameFormData]?: string;
  };
};

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
    {
      rel: "stylesheet",
      href: customStyles,
    },
  ];
}

export const action: ActionFunction = async ({ request }) => {
  assertIsPost(request);

  const authSession = await requireAuthSession(request);
  const formValidation = await getFormData(request, NewGameFormSchema);

  if (!formValidation.success) {
    return json<ActionData>(
      {
        errors: formValidation.errors,
      },
      {
        status: 400,
        headers: {
          "Set-Cookie": await commitAuthSession(request, { authSession }),
        },
      }
    );
  }

  const { title, description, startDate, endDate } = formValidation.data;

  const game = await createGame({
    title,
    description: description ?? null,
    startDate,
    endDate,
    userId: authSession.userId,
  });

  return redirect(`/games/${game.id}`, {
    headers: {
      "Set-Cookie": await commitAuthSession(request, { authSession }),
    },
  });
};

const today = new Date();
const defaultDateRange: DateRange = {
  from: today,
  to: addDays(today, 4),
};

export default function NewGamePage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descRef = React.useRef<HTMLTextAreaElement>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    defaultDateRange
  );
  const inputProps = useFormInputProps(NewGameFormSchema);
  const transition = useTransition();
  const disabled =
    transition.state === "submitting" || transition.state === "loading";

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post" className="flex w-full flex-col gap-2">
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            {...inputProps("title")}
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
            disabled={disabled}
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            {...inputProps("description")}
            ref={descRef}
            name="description"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "description-error" : undefined
            }
            disabled={disabled}
          />
        </label>
        {actionData?.errors?.description && (
          <div className="pt-1 text-red-700" id="description-error">
            {actionData.errors.description}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <input
            type="hidden"
            name="startDate"
            required={true}
            value={dateRange?.from?.toDateString()}
          />
        </label>
        <label className="flex w-full flex-col gap-1">
          <input
            type="hidden"
            name="endDate"
            required={true}
            value={dateRange?.to?.toDateString()}
          />
        </label>
        <span>Date: </span>
        <DayPicker
          mode="range"
          defaultMonth={today}
          selected={dateRange}
          footer={<Footer from={dateRange?.from} to={dateRange?.to} />}
          onSelect={setDateRange}
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
        {(actionData?.errors?.startDate || actionData?.errors?.endDate) && (
          <div className="pt-1 text-red-700" id="start-error">
            {actionData.errors.startDate || actionData.errors.endDate}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          disabled={disabled}
        >
          Save
        </button>
      </div>
    </Form>
  );
}

const Footer = ({ from, to }: { from?: Date; to?: Date }) => {
  if (!from && !to) {
    return <p>Select a start date</p>;
  }

  if (from && !to) {
    return <p>{format(from, "PPP")}</p>;
  }

  if (from && to) {
    return (
      <p>
        {format(from, "PPP")}–{format(to, "PPP")}
      </p>
    );
  }

  return <p>to and no from</p>;
};
