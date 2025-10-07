import { z } from 'zod';

export const startShiftSchema = z.object({
    openingBalance: z.number().min(0, "Opening balance must be at least 0"),
})

export const endShiftSchema = z.object({
    closingBalance: z.number().min(0, "Closing balance must be at least 0"),
})