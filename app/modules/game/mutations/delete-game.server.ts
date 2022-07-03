import type { Game, User } from "~/core/database";
import { db } from "~/core/database";

export async function deleteGame({
  id,
  userId,
}: Pick<Game, "id"> & { userId: User["id"] }) {
  return db.game.deleteMany({
    where: { id, userId },
  });
}
