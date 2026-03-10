/** Nano Banana model IDs */
export const MODELS = {
  /** Nano Banana (Gemini 2.5 Flash Image) - GA, 1K only, cheapest */
  FLASH: "gemini-2.5-flash-image",
  /** Nano Banana Pro (Gemini 3 Pro Image) - Preview, up to 4K, highest quality */
  PRO: "gemini-3-pro-image-preview",
  /** Nano Banana 2 (Gemini 3.1 Flash Image) - Preview, up to 4K, best value */
  FLASH2: "gemini-3.1-flash-image-preview",
} as const;

export const DEFAULT_MODEL = MODELS.FLASH2;

/** Models available for prompt enhancement */
export const ENHANCER_MODELS = {
  FLASH: "gemini-2.5-flash",
  PRO: "gemini-2.5-pro",
} as const;

export type EnhancerModelId = (typeof ENHANCER_MODELS)[keyof typeof ENHANCER_MODELS];

/** Default model for prompt enhancement (cheap, fast, text-only) */
export const DEFAULT_ENHANCER_MODEL = ENHANCER_MODELS.FLASH;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

/** Valid aspect ratios for all models */
export const ASPECT_RATIOS = [
  "1:1", "2:3", "3:2", "3:4", "4:3",
  "4:5", "5:4", "9:16", "16:9", "21:9",
] as const;

export type AspectRatio = (typeof ASPECT_RATIOS)[number];

/** Valid image sizes (must use uppercase K) */
export const IMAGE_SIZES = ["512", "1K", "2K", "4K"] as const;

export type ImageSize = (typeof IMAGE_SIZES)[number];

/** Model capabilities */
export const MODEL_CAPABILITIES: Record<ModelId, { maxSize: ImageSize; sizes: readonly ImageSize[] }> = {
  [MODELS.FLASH]: { maxSize: "1K", sizes: ["1K"] },
  [MODELS.PRO]: { maxSize: "4K", sizes: ["1K", "2K", "4K"] },
  [MODELS.FLASH2]: { maxSize: "4K", sizes: ["512", "1K", "2K", "4K"] },
};

/** Max inline file size: 7MB */
export const MAX_FILE_SIZE_BYTES = 7 * 1024 * 1024;

/** Supported input image MIME types */
export const SUPPORTED_INPUT_MIMES = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"] as const;

/** File extension to MIME type mapping */
export const EXT_TO_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".heic": "image/heic",
  ".heif": "image/heif",
};
