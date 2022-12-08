import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "shared/prisma";
import { ListsPagenation } from "shared/types";

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

  const likes = await prisma.like.findMany({
    where: {
      user_id,
    },
    take: 10,
    skip: cursor_id ? 1 : 0,
    cursor: cursor_id
      ? { list_id_user_id: { list_id: cursor_id, user_id } }
      : undefined,
    orderBy: {
      created_at: "desc",
    },
    include: {
      list: true,
    },
  });

  let has_next = false;

  if (likes.length > 0) {
    const hasNextQuery = await prisma.like.findMany({
      where: {
        user_id,
      },
      take: 1,
      skip: 1,
      cursor: {
        list_id_user_id: { list_id: likes[likes.length - 1].list_id, user_id },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (hasNextQuery.length > 0) {
      has_next = true;
    }
  }

  const lists = likes.map((like) => like.list);

  const resBody: ListsPagenation = {
    lists,
    has_next,
  };

  res.status(200).json(resBody);
};
