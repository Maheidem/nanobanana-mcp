import { GoogleGenAI } from "@google/genai";
import {
  DEFAULT_MODEL,
  MODEL_CAPABILITIES,
  IMAGE_SIZES,
  type ModelId,
  type AspectRatio,
  type ImageSize,
} from "../constants.js";
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
