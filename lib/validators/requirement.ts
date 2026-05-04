import { z } from "zod";

// Helpers to coerce numbers coming from form inputs (which may be strings)
const coerceNumber = (schema: any) => z.preprocess((val) => {
  if (typeof val === "string" && val.trim() !== "") return Number(val);
  return val;
}, schema);

export const requirementSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),

  categoryId: z.string(),

  quantity: coerceNumber(z.number().min(1)),
  unit: z.string(),

  deliveryLocation: z.string(),
  deliveryDeadline: z.string(),

  budgetMin: coerceNumber(z.number().min(0)).optional(),
  budgetMax: coerceNumber(z.number().min(0)).optional(),
  budgetHidden: z.boolean().optional(),

  closingDatetime: z.string(),

  biddingMode: z.enum(["SEALED", "OPEN", "DIRECT"]),
  visibility: z.enum(["ALL", "VERIFIED", "PREMIUM"]),

  tags: z.array(z.string()).optional(),
  specDocumentUrl: z.string().optional()
});