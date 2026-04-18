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

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  image_url: z.string().url().optional().or(z.literal('')),
  category_id: z.string().uuid("Invalid category ID"),
  type: z.enum(['news', 'agenda']),
  status: z.enum(['draft', 'published']).default('draft'),
  event_date: z.string().optional().or(z.literal('')),
});

export type PostInput = z.infer<typeof postSchema>;

export const financeSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  type: z.enum(['income', 'expense', 'financing']),
  category_name: z.string().min(1, "Category name is required"),
  amount: z.number().int().nonnegative(),
  note: z.string().optional().or(z.literal('')),
});

export type FinanceInput = z.infer<typeof financeSchema>;

export const staffMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  photo_url: z.string().url().optional().or(z.literal('')),
  parent_id: z.string().uuid().optional().nullable(),
  order_index: z.number().int().default(0),
});

export type StaffMemberInput = z.infer<typeof staffMemberSchema>;
