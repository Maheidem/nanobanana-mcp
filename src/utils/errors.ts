/**
 * Parse Gemini API errors into user-friendly messages.
 */
export function parseGeminiError(error: unknown): string {
  // Always log the raw error to stderr for debugging
  console.error("[nano-banana] Raw error:", error);

  if (error instanceof Error) {
    const msg = error.message;

    // Rate limit
    if (msg.includes("429") || msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("quota")) {
      return `Rate limit exceeded. The Gemini API allows 10 images/minute on Tier 1. Wait a moment and try again. (${msg})`;
    }

    // Safety filter
    if (msg.toLowerCase().includes("safety") || msg.toLowerCase().includes("blocked") || msg.toLowerCase().includes("harm")) {
      return `Image generation was blocked by safety filters. Try rephrasing your prompt. (${msg})`;
    }

    // Invalid API key
    if (msg.includes("401") || msg.includes("403") || msg.toLowerCase().includes("api key")) {
      return `API key error: ${msg}`;
    }

    // Local file errors — pass through directly
    if (msg.startsWith("Image file") || msg.startsWith("Unsupported image") || msg.includes("too large")) {
      return msg;
    }

    // Model not found (API 404)
    if (msg.includes("404")) {
      return `Model not found: ${msg}`;
    }

    // Generic with original message
    return `Gemini API error: ${msg}`;
  }

  return `Unknown error: ${String(error)}`;
}

/**
 * Format an error as an MCP error response.
 */
export function mcpError(message: string): { content: Array<{ type: "text"; text: string }>; isError: true } {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}
