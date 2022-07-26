import type { Game } from "@prisma/client";

import { db } from "~/core/database";

export async function getGame({ id }: Pick<Game, "id">) {
  return db.game.findFirst({
    where: { id },
  });
}
