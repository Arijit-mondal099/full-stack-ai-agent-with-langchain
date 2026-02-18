
export const ENV = {
    PORT: process.env.PORT || 4001,
    NODE_ENV: process.env.NODE_ENV || "development",
    NODE_API_URI: process.env.NODE_API_URI as string,
    CORS_ORIGIN: process.env.CORS_ORIGIN as string,

    SCALEKIT_ENVIRONMENT_URL: process.env.SCALEKIT_ENVIRONMENT_URL as string,
    SCALEKIT_CLIENT_ID: process.env.SCALEKIT_CLIENT_ID as string,
    SCALEKIT_CLIENT_SECRET: process.env.SCALEKIT_CLIENT_SECRET as string,

    TAVILY_API_KEY: process.env.TAVILY_API_KEY as string,

    GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
    GROQ_API_KEY: process.env.GROQ_API_KEY as string,
}
