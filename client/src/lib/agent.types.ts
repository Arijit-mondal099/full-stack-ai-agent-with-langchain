import { z } from "zod";

export const ResponseType = z.object({
  status: z.number(),
  message: z.string(),
  success: z.boolean(),
  data: z.object({
    reply: z.string(),
    sources: z.array(z.string()).default([]),
  }),
});

export type AgentResponse = z.infer<typeof ResponseType>;

export type Provider = "OpenAI" | "Gemini" | "Llama";

export type ResultState = {
  reply: string;
  sources: string[];
};

export type AgentPayload = {
  provider: string;
  text: string;
};

export type Message = {
  role: "user" | "model";
  content: string;
  sources?: string[];
};
