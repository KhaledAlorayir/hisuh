import { z } from "zod";

export const ListBodySchema = z.object({
  name: z.string().min(5).max(60),
  description: z.string().min(5).max(150).optional(),
  entries: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        description: z.string().min(5).max(100).optional(),
        place_id: z.string().optional(),
        lat: z.number(),
        lon: z.number(),
      })
    )
    .max(15),
});
