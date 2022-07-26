import type { Game, User } from "@prisma/client";

import { db } from "~/core/database";

export async function createGame({
  title,
  description,
  startDate,
  endDate,
  userId,
}: Pick<Game, "title" | "description" | "startDate" | "endDate"> & {
  userId: User["id"];
}) {
  return db.game.create({
    data: {
      title,
      description,
      startDate,
      endDate,
      teams: {
        create: [
          {
            name: "Default",
            description: "A game must have at least one team",
            players: {
              create: [
                {
                  role: "OWNER",
                  joinedAt: new Date(),
                  userId,
                },
              ],
            },
          },
        ],
      },
    },
  });
}
