import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PostListBodySchema } from "shared/schemas";
import prisma from "shared/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const body = PostListBodySchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json(body.error.issues);
  }

  const { entries, name, description } = body.data;

  let entriesList: {
    spot_id: number;
    description: string | undefined;
    name: string;
  }[] = [];

  for (let i = 0; i < entries.length; i++) {
    const spot = await prisma.spot.upsert({
      create: {
        lat: entries[i].lat,
        lon: entries[i].lon,
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

  const list = await prisma.list.create({
    data: {
      name: name,
      description: description,
      owner_id: session.uid,
      entries: {
        createMany: { data: entriesList },
      },
    },
  });

  res.status(200).json({ list });
};
