import type { Game } from "~/core/database";
import { db } from "~/core/database";

export async function getGame({ id }: Pick<Game, "id">) {
  return db.game.findFirst({
    where: { id },
  });
}
