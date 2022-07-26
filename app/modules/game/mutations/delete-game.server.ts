import type { Game } from "@prisma/client";

import { db } from "~/core/database";

// Used to contain userId, is it necesary?
export async function deleteGame({ id }: Pick<Game, "id">) {
  return db.game.deleteMany({
    where: { id },
  });
}
