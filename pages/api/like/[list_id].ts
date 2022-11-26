import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "shared/prisma";
import { ListIdParamsSchema } from "shared/schemas";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const params = ListIdParamsSchema.safeParse(req.query);

  if (!params.success) {
    return res.status(400).json(params.error.issues);
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const list = await prisma.list.findUnique({
    where: {
      id: params.data.list_id,
    },
  });

  if (!list) {
    return res.status(400).json({ message: "invalid list id" });
  }

  const isLiked = await prisma.like.findUnique({
    where: {
      list_id_user_id: {
        list_id: params.data.list_id,
        user_id: session.uid,
      },
    },
  });

  if (isLiked) {
    await prisma.like.delete({
      where: {
        id: isLiked.id,
      },
    });
    res.status(200).json({
      message: "list has been unliked",
    });
  } else {
    await prisma.like.create({
      data: {
        list_id: params.data.list_id,
        user_id: session.uid,
      },
    });
    res.status(201).json({
      message: "list has been liked",
    });
  }
};
