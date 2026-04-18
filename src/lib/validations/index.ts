import { z } from 'zod';

export const demographicSchema = z.object({
  category_id: z.string().uuid({ message: "Invalid category ID" }),
  label: z.string().min(1, "Label is required"),
  value: z.number().int().nonnegative({ message: "Value must be a positive number" }),
  metadata: z.record(z.any()).optional(),
});

export type DemographicInput = z.infer<typeof demographicSchema>;

export const villageInfoSchema = z.object({
  name: z.string().min(1, "Village name is required"),
  vision: z.string().optional(),
  mission: z.array(z.string()).default([]),
  history: z.string().optional(),
  contact_info: z.object({
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    maps_url: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

export type VillageInfoInput = z.infer<typeof villageInfoSchema>;
