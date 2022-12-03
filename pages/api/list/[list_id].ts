import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "shared/prisma";
import { ListBodySchema, ListIdParamsSchema } from "shared/schemas";
import { entryInsert } from "shared/types";

interface HandlerReturn {
  status: number;
  data: any;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
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

  if (list.owner_id !== session.uid) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "DELETE") {
    const deletedList = await prisma.list.delete({
      where: { id: params.data.list_id },
    });
    return res.status(200).json(deletedList);
  }

  if (req.method === "PATCH") {
    const { data, status } = await Update(req, params.data.list_id);
    return res.status(status).json(data);
  }
};

const Update = async (
  req: NextApiRequest,
  list_id: string
): Promise<HandlerReturn> => {
  const body = ListBodySchema.safeParse(req.body);
  if (!body.success) {
    return { data: body.error.issues, status: 400 };
  }

  const { entries, name, description } = body.data;

  await prisma.entry.deleteMany({
    where: {
      list_id,
    },
  });

  let entriesList: entryInsert[] = [];

  for (let i = 0; i < entries.length; i++) {
    const spot = await prisma.spot.upsert({
      create: {
        lat: entries[i].lat,
        lon: entries[i].lon,
        place_id: entries[i].place_id,
      },
      update: {},
      where: {
        lat_lon: {
          lat: entries[i].lat,
          lon: entries[i].lon,
        },
      },
    });
    entriesList.push({
      spot_id: spot.id,
      description: entries[i].description,
      name: entries[i].name,
    });
  }

  const updatedList = await prisma.list.update({
    where: {
      id: list_id,
    },
    data: {
      name,
      description,
      entries: {
        createMany: { data: entriesList },
      },
    },
  });

  return { data: updatedList, status: 200 };
};
