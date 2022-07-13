import * as React from "react";

import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { getFormData, useFormInputProps } from "remix-params-helper";
import { z } from "zod";

import { requireAuthSession } from "~/core/auth/guards";
import { commitAuthSession } from "~/core/auth/session.server";
import { TextInput, Label, DateRangeSelector } from "~/core/components";
import { assertIsPost } from "~/core/utils/http.server";
import { createGame } from "~/modules/game/mutations";
import customStyles from "~/styles/rdp.css";

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
      href: DateRangeSelector.styles,
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

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request);

  return null;
};

const today = new Date();
const defaultDateRange: DateRange = {
  from: today,
  to: addDays(today, 4),
};

export default function NewGamePage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descRef = React.useRef<HTMLInputElement>(null);
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
    <Form
      method="post"
      className="flex h-full w-full flex-col gap-2 rounded-lg rounded-tl-3xl bg-slate-200 p-12"
    >
      <div className="mb-4">
        <Label htmlFor="title">Title</Label>
        <TextInput
          {...inputProps("title")}
          ref={titleRef}
          name="title"
          id="title"
          disabled={disabled}
          error={actionData?.errors?.title}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="description">Description</Label>
        <TextInput
          {...inputProps("description")}
          ref={descRef}
          name="description"
          id="description"
          disabled={disabled}
          error={actionData?.errors?.description}
        />
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
        <Label htmlFor="date">Date</Label>
        <div className="w-max rounded-lg bg-white p-3 shadow-sm">
          <DateRangeSelector range={dateRange} setRange={setDateRange} />
          {(actionData?.errors?.startDate || actionData?.errors?.endDate) && (
            <div className="pt-1 text-red-700" id="start-error">
              {actionData.errors.startDate || actionData.errors.endDate}
            </div>
          )}
        </div>
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
