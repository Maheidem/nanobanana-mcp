import type { ModelId, AspectRatio, ImageSize } from "./constants.js";

/** Options for generating a new image */
export interface GenerateImageOptions {
  prompt: string;
  model?: ModelId;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
  outputDir?: string;
}

/** Options for editing an existing image */
export interface EditImageOptions {
  imagePath: string;
  prompt: string;
  referenceImagePaths?: string[];
  model?: ModelId;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
  outputDir?: string;
}

/** Result from the Gemini API after image generation/editing */
export interface GeminiImageResult {
  imageBase64: string;
  mimeType: string;
  textResponse: string;
}

/** In-memory state for the last generated/edited image */
export interface SessionState {
  lastImagePath: string | null;
  lastPrompt: string | null;
  lastModel: string | null;
  lastTimestamp: string | null;
  preferredModel: string | null;
  enhancePrompt: boolean;
  enhancerModel: string | null;
  needsModelSelection: boolean;
}
