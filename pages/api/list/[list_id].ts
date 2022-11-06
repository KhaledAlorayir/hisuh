import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "shared/prisma";
import { z } from "zod";

interface HandlerReturn {
  status: number;
  data: any;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const paramsSchema = z.object({
    list_id: z.string().uuid("invalid list id"),
  });

  const params = paramsSchema.safeParse(req.query);

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

  if (list.owner_id !== session.uid) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "DELETE") {
    await prisma.list.delete({
      where: { id: params.data.list_id },
    });
    return res.status(200).json({ message: "list has been deleted" });
  }

  if (req.method === "PATCH") {
  }
  return res.status(405).json({ message: "Method Not Allowed" });
};

const Update = (): HandlerReturn => {
  return { data: null, status: 404 };
};
