import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useTransition } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";

import { requireAuthSession } from "~/core/auth/guards";
import { commitAuthSession } from "~/core/auth/session.server";
import { DateRangeSelector } from "~/core/components";
import { assertIsPost } from "~/core/utils/http.server";
import { createGame } from "~/modules/game/mutations";
import customStyles from "~/styles/rdp.css";

import type { OptimisticGame } from "../../../core/components/board/game";
import { GameView } from "../../../core/components/board/game";
import { DatePickerRVF } from "../../../core/components/forms/rvf/date";
import { InputRVF } from "../../../core/components/forms/rvf/input";
import { SubmitButtonRVF } from "../../../core/components/forms/rvf/submit";
import { TextareaRVF } from "../../../core/components/forms/rvf/textarea";

const dateSchema = z.preprocess((arg) => {
  if (arg === "" || !arg) return arg;
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  return arg;
}, z.union([z.date(), z.string(), z.undefined()]));

const newGameSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .refine(
      (val) => val.length < 100,
      (val) => ({
        message: `Title is too long (${val.length} / 100 chars)`,
      })
    ),
  description: z
    .string()
    .refine(
      (val) => val.length < 250,
      (val) => ({
        message: `Description is too long (${val.length} / 250 chars)`,
      })
    )
    .optional(),
  date: z.object({
    from: dateSchema.refine((val) => val instanceof Date, {
      message: z.ZodIssueCode.invalid_date,
    }),
    to: dateSchema,
  }),
});

const newGameValidator = withZod(newGameSchema);

export type NewGameFormData = z.infer<typeof newGameSchema>;

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

export function mapFormDataToGameInput(formData: NewGameFormData) {
  return {
    title: formData.title,
    description: formData.description ?? null,
    startDate: formData.date.from,
    endDate:
      formData.date.to instanceof Date ? formData.date.to : formData.date.from,
  };
}

export const action: ActionFunction = async ({ request }) => {
  assertIsPost(request);

  const authSession = await requireAuthSession(request);
  const formValidation = await newGameValidator.validate(
    await request.formData()
  );

  if (formValidation.error) {
    return validationError(formValidation.error);
  }

  const game = await createGame({
    title: formValidation.data.title,
    description: formValidation.data.description ?? null,
    startDate: formValidation.data.date.from as Date,
    endDate:
      formValidation.data.date.to instanceof Date
        ? formValidation.data.date.to
        : (formValidation.data.date.from as Date),
    userId: authSession.userId,
  });

  return redirect(`/dashboard/games/${game.id}`, {
    headers: {
      "Set-Cookie": await commitAuthSession(request, { authSession }),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request);

  return null;
};

export default function NewGamePage() {
  const transition = useTransition();
  let data: OptimisticGame = {};

  if (transition.submission?.formData) {
    const formData = Object.fromEntries(transition.submission.formData);
    // Form validation provides data in a weird flattened way
    data = {
      title: formData.title as string,
      description: (formData.description ?? null) as string | null,
      startDate: formData["date.from"] as string,
      endDate: formData["date.to"] as string,
    };
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {transition.submission ? (
        <GameView game={data} />
      ) : (
        <>
          {/* <NewGameFormTabs /> */}
          <ValidatedForm
            validator={newGameValidator}
            method="post"
            className="divide-y divide-neutral"
          >
            <section className="mx-auto mb-6 max-w-5xl">
              <h1 className="mt-0 text-2xl font-extralight tracking-wider">
                New Game Details
              </h1>
              <div className="mb-6 flex flex-col gap-6 lg:flex-row">
                <div className="flex grow flex-col">
                  <InputRVF name="title" label="Title" />
                  <TextareaRVF name="description" label="Description" />
                </div>
                <div className="mt-9 grid place-items-center">
                  <div className="rounded-lg bg-base-100 p-4 shadow highlight-t">
                    <DatePickerRVF name="date" label="Date" />
                  </div>
                </div>
              </div>
            </section>
            <section className="mb-6">
              <h1 className="text-2xl font-extralight tracking-wider">
                Game Board
              </h1>
              <GameView
                game={{ title: "", startDate: new Date().toDateString() }}
              />
            </section>
            <section className="">
              <h1 className="text-2xl font-extralight tracking-wider">Teams</h1>
              <div className="flex flex-wrap gap-2">
                <div className="flex basis-56 flex-col items-center gap-1 rounded-md border-2 border-base-content/20 p-2">
                  <InputRVF
                    name="team-1"
                    label="Team 1"
                    inputClass="input-sm"
                  />
                  <ul className="mt-2 flex w-full flex-col gap-1 rounded-lg">
                    <li className="grid place-items-center rounded bg-base-100 px-2 py-1 highlight-t">
                      Player 1
                    </li>
                    <li className="grid place-items-center rounded bg-base-100 px-2 py-1 highlight-t">
                      Player 2
                    </li>
                    <li className="grid place-items-center rounded bg-base-100 px-2 py-1 highlight-t">
                      Player 3
                    </li>
                    <li className="grid place-items-center rounded bg-base-100 px-2 py-1 highlight-t">
                      Player 4
                    </li>
                    <li className="grid place-items-center rounded bg-base-100 px-2 py-1 highlight-t">
                      Player 5
                    </li>
                  </ul>
                  <button className="btn btn-success btn-xs w-max rounded highlight-t highlight-white/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M 6 12 L 18 12 M 12 6 l 0 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="basis-28">
                  <button className="btn btn-lg h-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M 6 12 L 18 12 M 12 6 l 0 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <SubmitButtonRVF />
            </section>
          </ValidatedForm>
        </>
      )}
    </div>
  );
}
