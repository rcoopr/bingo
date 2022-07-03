import type { User } from "~/core/database";
import { db } from "~/core/database";

export async function getGames({ userId }: { userId: User["id"] }) {
  return db.game.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}
