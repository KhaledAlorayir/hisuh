import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "shared/prisma";
import { UserLists } from "shared/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const query_schema = z.object({
    user_id: z.string().cuid(),
    cursor_id: z.string().uuid().optional().nullable(),
  });

  const validatedData = query_schema.safeParse(req.query);

  if (!validatedData.success) {
    return res.status(400).json({ message: "invalid id" });
  }

  const { user_id, cursor_id } = validatedData.data;

  const lists = await prisma.list.findMany({
    where: {
      owner_id: user_id,
    },
    take: 10,
    skip: cursor_id ? 1 : 0,
    cursor: cursor_id ? { id: cursor_id } : undefined,
    orderBy: {
      created_at: "desc",
    },
  });

  let has_next = false;

  if (lists.length > 0) {
    const hasNextQuery = await prisma.list.findMany({
      where: {
        owner_id: user_id,
      },
      take: 1,
      skip: 1,
      cursor: { id: lists[lists.length - 1].id },
      orderBy: {
        created_at: "desc",
      },
    });

    if (hasNextQuery.length > 0) {
      has_next = true;
    }
  }

  const resBody: UserLists = {
    lists,
    has_next,
  };

  res.status(200).json(resBody);
};
