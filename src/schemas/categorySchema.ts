import z from "zod";

export const categorySchema = z.object({
    name: z 
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Le nom est trop long.")
})
export type CategoryFormData = z.infer<typeof categorySchema>