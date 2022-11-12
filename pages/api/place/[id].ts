import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const paramsSchema = z.object({
    id: z.string(),
  });

  const params = paramsSchema.safeParse(req.query);
  if (!params.success) {
    return res.status(400).json({
      message: "invalid place id",
    });
  }

  try {
    const { data } = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: params.data.id,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
          language: "en",
        },
      }
    );
    res.status(200).json({ name: data.result.name });
  } catch (err) {
    res.status(500).json({ message: "google error" });
  }
};
