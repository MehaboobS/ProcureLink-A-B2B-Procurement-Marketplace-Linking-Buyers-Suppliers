import { z } from "zod";

export const createBidSchema = z.object({
  quotedPrice: z
    .number()
    .positive(),

  quantity: z
    .number()
    .int()
    .positive(),

  deliveryDays: z
    .number()
    .int()
    .positive(),

  remarks: z
    .string()
    .max(500)
    .optional(),
}).strict();

export type CreateBidInput = z.infer<typeof createBidSchema>;