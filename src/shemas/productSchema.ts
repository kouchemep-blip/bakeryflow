import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),

  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),

  price: z
    .number()
    .positive("Le prix doit être supérieur à 0"),

  categoryId: z
    .number()
    .positive("Veuillez choisir une catégorie"),

  status: z.enum([
    "AVAILABLE",
    "UNAVAILABLE",
  ]),
});

export type ProductFormData = z.infer<typeof productSchema>