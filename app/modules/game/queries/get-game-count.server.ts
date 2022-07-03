import type { User } from "~/core/database";
import { db } from "~/core/database";

export async function getGameCount(args?: { userId?: User["id"] } | undefined) {
  if (args?.userId) {
    return db.game.count({ where: { userId: args.userId } });
  }
  return db.game.count();
}
