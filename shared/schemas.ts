import { z } from "zod";

export const PostListBodySchema = z.object({
  name: z.string().min(5).max(60),
  description: z.string().min(5).max(150).optional(),
  entries: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        description: z.string().min(5).max(100).optional(),
        lat: z.number(),
        lon: z.number(),
      })
    )
    .max(15),
});
