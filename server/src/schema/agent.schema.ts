import { z } from "zod";

export const ProviderScheam = z.enum(["openai", "gemini", "llama"]);

export type Provider = z.infer<typeof ProviderScheam>;

export const RequestSchema = z.object({
  provider: ProviderScheam,
  text: z.string().min(1),
});

export const DraftSchema = z.object({
  reply: z.string(),
  sources: z.array(z.string()).max(3),
});

export type AgentResponse = z.infer<typeof DraftSchema>;
