import type { Game, User } from "~/core/database";
import { db } from "~/core/database";

export async function createGame({
  title,
  startDate,
  endDate,
  userId,
}: Pick<Game, "title" | "startDate" | "endDate"> & {
  userId: User["id"];
}) {
  return db.game.create({
    data: {
      title,
      startDate,
      endDate,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
