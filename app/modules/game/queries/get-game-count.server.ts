import type { Player } from "@prisma/client";

import { db } from "~/core/database";

export async function getTotalGameCount() {
  return db.game.count();
}

export async function getGameCount({
  userId,
  role,
}: {
  userId: string;
  role?: Player["role"];
}) {
  const roleCondition = role ? { AND: { role } } : {};

  return db.game.count({
    where: {
      teams: { some: { players: { some: { userId, ...roleCondition } } } },
    },
  });
}
