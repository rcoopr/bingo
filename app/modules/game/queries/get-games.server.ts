import type { User } from "@prisma/client";

import { db } from "~/core/database";

export async function getGames({ userId }: { userId: User["id"] }) {
  return db.game.findMany({
    where: { teams: { some: { players: { some: { userId } } } } },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}
