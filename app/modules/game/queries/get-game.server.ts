import type { Game, User } from "~/core/database";
import { db } from "~/core/database";

export async function getGame({
  userId,
  id,
}: Pick<Game, "id"> & {
  userId: User["id"];
}) {
  return db.game.findFirst({
    where: { id, userId },
  });
}
