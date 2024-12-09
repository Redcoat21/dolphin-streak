import { z } from 'zod';

export const ZLoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type TLoginInput = z.infer<typeof ZLoginInput>;
