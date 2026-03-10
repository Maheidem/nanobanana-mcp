import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MODELS, DEFAULT_MODEL, ASPECT_RATIOS, IMAGE_SIZES } from "../constants.js";
import { editImage } from "../services/gemini.js";
import { readImageAsBase64, saveImage, resolveOutputDir } from "../utils/files.js";
import { parseGeminiError, mcpError } from "../utils/errors.js";
import type { SessionState } from "../types.js";

const modelIds = [MODELS.FLASH, MODELS.PRO, MODELS.FLASH2] as const;

const inputSchema = {
  imagePath: z.string()
    .min(1, "Image path is required")
    .describe("Absolute path to the image file to edit"),
  prompt: z.string()
    .min(1, "Edit prompt is required")
    .max(10000, "Prompt too long (max 10000 chars)")
    .describe("Text instructions describing how to edit the image"),
  referenceImagePaths: z.array(z.string())
    .optional()
    .describe("Optional paths to reference images for style transfer or composition"),
  model: z.enum(modelIds)
    .optional()
    .describe(`Model to use. Default: ${DEFAULT_MODEL}`),
  aspectRatio: z.enum(ASPECT_RATIOS)
    .optional()
    .describe("Aspect ratio for the output image"),
  imageSize: z.enum(IMAGE_SIZES)
    .optional()
    .describe("Output resolution: 512, 1K, 2K, or 4K"),
  outputDir: z.string()
    .optional()
    .describe("Directory to save the edited image"),
};

export function registerEditTool(server: McpServer, state: SessionState): void {
  server.registerTool(
    "nb_edit_image",
    {
      title: "Edit Image (Nano Banana)",
      description: `Edit an existing image using natural language instructions via Google's Nano Banana (Gemini) models.

Provide an image path and text instructions to modify it. Supports:
- Adding/removing elements
- Changing colors, styles, lighting
- Style transfer (with reference images)
- Inpainting via natural language (no masks needed)
- Text rendering within images

The edited image is saved as a new file (original is not modified).

Args:
  - imagePath (string, required): Path to the source image to edit
  - prompt (string, required): Natural language edit instructions
  - referenceImagePaths (string[], optional): Reference images for style/composition
  - model (string, optional): Model ID to use
  - aspectRatio (string, optional): e.g. "16:9"
  - imageSize (string, optional): "512", "1K", "2K", or "4K"
  - outputDir (string, optional): Where to save the edited image

Returns: File path of the edited image, model used, and any text description.

Tips:
  - For targeted edits, use: "Change only the [element] to [new description]. Keep everything else exactly the same."
  - For style transfer, provide a style reference image in referenceImagePaths`,
      inputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        // Nudge model selection if not configured yet and no explicit model passed
        if (state.needsModelSelection && !params.model) {
          return mcpError("No preferred model configured yet. Call nb_list_models first to let the user choose a model, then call this tool again.");
        }

        // Read source image
        const source = readImageAsBase64(params.imagePath);

        // Read reference images if provided
        let referenceImages: Array<{ base64: string; mimeType: string }> | undefined;
        if (params.referenceImagePaths && params.referenceImagePaths.length > 0) {
          referenceImages = params.referenceImagePaths.map((p) => {
            const ref = readImageAsBase64(p);
            return { base64: ref.base64, mimeType: ref.mimeType };
          });
        }

        const outputDir = resolveOutputDir(params.outputDir);

        const model = params.model || (state.preferredModel as NonNullable<typeof params.model>) || undefined;

        const result = await editImage({
          imageBase64: source.base64,
          imageMimeType: source.mimeType,
          prompt: params.prompt,
          referenceImages,
          model,
          aspectRatio: params.aspectRatio,
          imageSize: params.imageSize,
        });

        const filePath = saveImage(result.imageBase64, outputDir, result.mimeType);

        // Update session state
        state.lastImagePath = filePath;
        state.lastPrompt = params.prompt;
        state.lastModel = result.model;
        state.lastTimestamp = new Date().toISOString();

        const lines = [
          `Edited image saved to: ${filePath}`,
          `Source: ${params.imagePath}`,
          `Model: ${result.model}`,
        ];
        if (result.textResponse) {
          lines.push(`Description: ${result.textResponse}`);
        }

        return { content: [{ type: "text", text: lines.join("\n") }] };
      } catch (error) {
        return mcpError(parseGeminiError(error));
      }
    },
  );
}
