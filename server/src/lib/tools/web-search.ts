import { ENV } from "../env";

export type WebSearchResponse = {
  title: string;
  url: string;
  snippet: string;
};

export const webSearch = async (args: {
  query: string;
  k?: number;
}): Promise<WebSearchResponse[]> => {
  if (!ENV.TAVILY_API_KEY) {
    console.log("Error :: API key not provided to tavily!");
    return [];
  }

  if (!args.query?.trim()) {
    return [];
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: ENV.TAVILY_API_KEY,
        query: args.query,
        search_depth: "basic",
        include_answer: false,
        include_images: false,
        max_results: args.k ?? 3,
        include_raw_content: false,
      }),
    });

    if (!response.ok) return [];

    const data = (await response.json()) as {
      results: {
        title: unknown;
        url: unknown;
        content: unknown;
      }[];
    };

    const results = Array.isArray(data.results) ? data.results : [];

    return results.map((res) => {
      const title = typeof res.title === "string" ? res.title : "result";
      const url = typeof res.url === "string" ? res.url : "";
      const content = typeof res.content === "string" ? res.content : "";

      return {
        title,
        url,
        snippet: content.slice(0, 350),
      };
    }).filter(filteredRes => filteredRes.url.length > 0);

  } catch (error) {
    console.error("Error :: from tavily web search -->", error);
    return [];
  }
};
