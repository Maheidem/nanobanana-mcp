import { GoogleGenAI } from "@google/genai";
import {
  DEFAULT_MODEL,
  DEFAULT_ENHANCER_MODEL,
  MODEL_CAPABILITIES,
  IMAGE_SIZES,
  type ModelId,
  type AspectRatio,
  type ImageSize,
} from "../constants.js";

/** Patterns to exclude from enhancer model list (non-text or specialized models) */
const ENHANCER_EXCLUDE = [
  /image/i, /audio/i, /tts/i, /robotics/i, /computer/i,
  /embedding/i, /research/i, /customtools/i, /nano-banana/i,
  /gemma/i, /imagen/i, /veo/i, /aqa/i,
  /-\d{3}$/, // versioned snapshots (-001)
  /-\d{2}-\d{4}$/, // date stamps (-09-2025)
  /-latest$/, // aliases
];
import type { GeminiImageResult } from "../types.js";

let client: GoogleGenAI | null = null;

/**
 * Initialize the Gemini client. Call once at startup.
 */
export function initGeminiClient(): void {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing API key. Set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.");
  }
  client = new GoogleGenAI({ apiKey });
}

function getClient(): GoogleGenAI {
  if (!client) throw new Error("Gemini client not initialized. Call initGeminiClient() first.");
  return client;
}

/** Cached list of enhancer model IDs (fetched once per session) */
let cachedEnhancerModels: string[] | null = null;

/**
 * Fetch available text-only Gemini models suitable for prompt enhancement.
 * Queries the models.list API endpoint and filters out image/audio/specialized models.
 * Results are cached for the session duration.
 */
export async function getAvailableEnhancerModels(): Promise<string[]> {
  if (cachedEnhancerModels) return cachedEnhancerModels;

  const ai = getClient();
  try {
    const models: string[] = [];
    const pager = await ai.models.list();
    for await (const model of pager) {
      const id = (model.name || "").replace(/^models\//, "");
      if (!id.startsWith("gemini-")) continue;
      if (ENHANCER_EXCLUDE.some((p) => p.test(id))) continue;
      if (!model.supportedActions?.includes("generateContent")) continue;
      models.push(id);
    }
    cachedEnhancerModels = models.length > 0 ? models : [DEFAULT_ENHANCER_MODEL];
    return cachedEnhancerModels;
  } catch {
    // Fallback if API call fails
    cachedEnhancerModels = [DEFAULT_ENHANCER_MODEL];
    return cachedEnhancerModels;
  }
}

/**
 * Normalize imageSize to uppercase K and downgrade if model doesn't support it.
 */
function resolveImageSize(size: ImageSize | undefined, model: ModelId): ImageSize | undefined {
  if (!size) return undefined;

  // Normalize: "4k" -> "4K", "2k" -> "2K"
  const normalized = size.replace(/k$/i, "K") as ImageSize;
  if (!IMAGE_SIZES.includes(normalized)) return undefined;

  const caps = MODEL_CAPABILITIES[model];
  if (!caps) return normalized;

  // Downgrade if model doesn't support this size
  if (!caps.sizes.includes(normalized)) {
    return caps.maxSize;
  }
  return normalized;
}

const ENHANCE_SYSTEM_PROMPT = `You are an expert image generation prompt engineer. Your job is to take a user's simple prompt and rewrite it into a detailed, vivid prompt optimized for AI image generation.

Rules:
- Keep the user's core intent and subject matter
- Add specific details: lighting, composition, style, mood, colors, camera angle, materials, textures
- Use descriptive, narrative language (not keyword lists)
- For negative elements, use "Exclude X, Y, Z" format
- Keep it under 500 words
- Return ONLY the enhanced prompt, nothing else — no preamble, no explanation`;

/**
 * Enhance a prompt using a text-only Gemini model.
 * Returns a more detailed, image-generation-optimized version.
 */
export async function enhancePrompt(prompt: string, enhancerModel?: string): Promise<string> {
  const ai = getClient();
  const model = enhancerModel || DEFAULT_ENHANCER_MODEL;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: ENHANCE_SYSTEM_PROMPT,
    },
  });

  const text = response?.candidates?.[0]?.content?.parts
    ?.filter((p: { text?: string }) => p.text)
    .map((p: { text?: string }) => p.text)
    .join("") || "";

  if (!text.trim()) {
    // Fallback to original prompt if enhancement fails
    return prompt;
  }

  return text.trim();
}

interface GenerateConfig {
  prompt: string;
  model?: ModelId;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
}

/**
 * Generate a new image from a text prompt.
 */
export async function generateImage(config: GenerateConfig): Promise<GeminiImageResult & { model: string }> {
  const ai = getClient();
  const model = config.model || DEFAULT_MODEL;
  const imageSize = resolveImageSize(config.imageSize, model);

  const response = await ai.models.generateContent({
    model,
    contents: config.prompt,
    config: {
      responseModalities: ["TEXT", "IMAGE"],
      ...(config.aspectRatio || imageSize
        ? {
            imageConfig: {
              ...(config.aspectRatio ? { aspectRatio: config.aspectRatio } : {}),
              ...(imageSize ? { imageSize } : {}),
            },
          }
        : {}),
    },
  });

  return { ...extractImageFromResponse(response), model };
}

interface EditConfig {
  imageBase64: string;
  imageMimeType: string;
  prompt: string;
  referenceImages?: Array<{ base64: string; mimeType: string }>;
  model?: ModelId;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
}

/**
 * Edit an existing image with a text prompt.
 */
export async function editImage(config: EditConfig): Promise<GeminiImageResult & { model: string }> {
  const ai = getClient();
  const model = config.model || DEFAULT_MODEL;
  const imageSize = resolveImageSize(config.imageSize, model);

  // Build content parts: reference images first, then source image, then prompt
  const parts: Array<{ inlineData: { mimeType: string; data: string } } | { text: string }> = [];

  // Add reference images if provided
  if (config.referenceImages) {
    for (const ref of config.referenceImages) {
      parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.base64 } });
    }
  }

  // Add the source image
  parts.push({ inlineData: { mimeType: config.imageMimeType, data: config.imageBase64 } });

  // Add the edit prompt
  parts.push({ text: config.prompt });

  const response = await ai.models.generateContent({
    model,
    contents: parts,
    config: {
      responseModalities: ["TEXT", "IMAGE"],
      ...(config.aspectRatio || imageSize
        ? {
            imageConfig: {
              ...(config.aspectRatio ? { aspectRatio: config.aspectRatio } : {}),
              ...(imageSize ? { imageSize } : {}),
            },
          }
        : {}),
    },
  });

  return { ...extractImageFromResponse(response), model };
}

/**
 * Extract image data and text from a Gemini response.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractImageFromResponse(response: any): GeminiImageResult {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!parts || !Array.isArray(parts)) {
    throw new Error("No content in Gemini response. The model may have refused the request.");
  }

  let imageBase64 = "";
  let mimeType = "image/png";
  let textResponse = "";

  for (const part of parts) {
    if (part.inlineData?.data) {
      imageBase64 = part.inlineData.data;
      mimeType = part.inlineData.mimeType || "image/png";
    } else if (part.text) {
      textResponse += part.text;
    }
  }

  if (!imageBase64) {
    const reason = textResponse
      ? `The model returned text but no image: "${textResponse.substring(0, 200)}"`
      : "The model returned no image data. Try a different prompt or model.";
    throw new Error(reason);
  }

  return { imageBase64, mimeType, textResponse };
}
