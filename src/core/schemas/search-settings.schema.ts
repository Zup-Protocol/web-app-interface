import { z } from "zod";

export const searchSettingsSchema = z.object({
  minLiquidity: z.string(),
  blockedExchanges: z.array(z.string()).optional().default([]),
});
