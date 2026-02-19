import { Provider, DraftSchema, RequestSchema } from "../schema/agent.schema";
import { ApiError } from "../utils/api-err";
import { async_hander } from "../utils/async-handler";
import { webSearch, WebSearchResponse } from "../lib/tools/web-search";
import { ApiResponse } from "../utils/api-res";

import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  BaseMessage,
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ENV } from "../lib/env";

// TODO: Store history somewhere (in-memory, Redis, DB, etc.)
const conversationHistory: BaseMessage[] = [];

// util fun for select model (e.g. openai, and gemini etc).
export const selectedProvider = (provider: Provider) => {
  switch (provider) {
    case "openai":
      return new ChatGroq({
        apiKey: ENV.GROQ_API_KEY,
        model: "openai/gpt-oss-20b",
        temperature: 0,
      });
    case "llama":
      return new ChatGroq({
        apiKey: ENV.GROQ_API_KEY,
        model: "llama-3.3-70b-versatile",
        temperature: 0,
      });
    case "gemini":
      return new ChatGoogleGenerativeAI({
        apiKey: ENV.GEMINI_API_KEY,
        model: "gemini-2.5-flash-lite",
        temperature: 0,
      });
    default:
      throw new Error("Invalid provider");
  }
};

// util fun for check that is we need an web search for user given query
export const shouldWebSearch = async (prompt: string): Promise<boolean> => {
  // TODO: Via llm to check
  const searchKeywords = [
    "search",
    "find",
    "latest",
    "current",
    "today",
    "news",
    "price",
    "stock",
    "rate",
    "score",
    "near me",
    "live",
    "trending",
    "update",
  ];

  try {
    return searchKeywords.some((keyword) =>
      prompt.toLowerCase().includes(keyword),
    );
  } catch (error) {
    return false;
  }
};

// util fun for structor web search content
export const formateWebSearchResult = (result: WebSearchResponse[]): string => {
  if (result.length === 0) return "none";

  return result
    .map((res, idx) => {
      const sipt = res.snippet.trim() ? res.snippet.trim() : "no snippet";
      return `#${idx + 1} ${res.title}:\n${sipt}\n${res.url}`;
    })
    .join("\n\n");
};

// util fun for to modify user prompt to structor
export const createPrompt = (args: {
  prompt: string;
  searchResult: WebSearchResponse[];
}): string => {
  const hasSearchResult = args.searchResult.length > 0;

  return [
    "You are an B2B support agent.",
    "Write a customer ready result.",
    "",
    "Output with strict JSON with this exact shape:",
    '{ "reply": string, "sources": string[] }',
    "",
    "Rules:",
    "- Be polite, clear, short paragraphs.",
    "- Ask for missing info if needed.",
    "- Do Not make strong promises (no guarantees).",
    hasSearchResult
      ? "- If you used any web search result, sources[] must contain 1-2 URLs from the provided web search result."
      : "- sources must be [].",
    "",
    "Web search results:",
    formateWebSearchResult(args.searchResult),
    "",
    "Prompt:",
    args.prompt,
  ].join("\n");
};

// util fun for return uniq strings
export const uniq = (arr: string[]): string[] => {
  return Array.from(new Set(arr));
};

// util fun for check is http/https protocal url or not
export const isHttpProtocalUrl = (url: string): boolean => {
  try {
    const check = new URL(url);
    return check.protocol === "http:" || check.protocol === "https:";
  } catch (error) {
    return false;
  }
};

// controller for run agent
export const runAgent = async_hander(async (req, res) => {
  const parsed = RequestSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid input try again!");
  }

  const { text, provider } = parsed.data;
  const prompt = text.trim();

  const doWebSearch = await shouldWebSearch(prompt);
  let webSearchResult: WebSearchResponse[] = [];

  try {
    if (doWebSearch) {
      webSearchResult = await webSearch({ query: prompt.slice(0, 200) });
    }

    const finalPrompt = createPrompt({ prompt, searchResult: webSearchResult });

    const model = selectedProvider(provider);
    const method = provider === "gemini" ? "jsonSchema" : "jsonMode";

    const structuredModel = model.withStructuredOutput(DraftSchema, { method });

    console.log(conversationHistory)

    const draft = await structuredModel.invoke([
      new SystemMessage("Return strict JSON only. No markdown, no extra keys."),
      ...conversationHistory,
      new HumanMessage(finalPrompt),
    ]);

    conversationHistory.push(new HumanMessage(prompt));
    conversationHistory.push(new AIMessage(draft.reply));

    let sources = uniq(draft.sources).filter(
      (source) => typeof source === "string",
    );
    sources = sources.filter(isHttpProtocalUrl).slice(0, 3);

    if (doWebSearch && webSearchResult.length > 0) {
      const allowed = uniq(
        webSearchResult
          .map((searchRes) =>
            typeof searchRes.url === "string" ? searchRes.url.trim() : "",
          )
          .filter(Boolean),
      );

      if (sources.length === 0) {
        throw new ApiError(422, "Sources are empty!");
      }

      const notAllowedSources = sources.filter(
        (source) => !allowed.includes(source),
      );
      if (notAllowedSources.length > 0) {
        throw new ApiError(422, "Sources aren't allowed!");
      }

      return res
        .status(200)
        .json(new ApiResponse(200, "success", { reply: draft.reply, sources }));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "success", { reply: draft.reply, sources: [] }),
      );
  } catch (error) {
    console.log("Error:: from run agent -->", error);
    webSearchResult = [];
  }
});
