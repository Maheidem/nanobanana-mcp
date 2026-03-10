import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MODELS, DEFAULT_MODEL, ASPECT_RATIOS, IMAGE_SIZES } from "../constants.js";
import { generateImage, enhancePrompt } from "../services/gemini.js";
import { saveImage, resolveOutputDir } from "../utils/files.js";
import { parseGeminiError, mcpError } from "../utils/errors.js";
import type { SessionState } from "../types.js";

const modelIds = [MODELS.FLASH, MODELS.PRO, MODELS.FLASH2] as const;

const inputSchema = {
  prompt: z.string()
    .min(1, "Prompt is required")
    .max(10000, "Prompt too long (max 10000 chars)")
    .describe("Text description of the image to generate"),
  enhancePrompt: z.boolean()
    .optional()
    .describe("When true, uses a Gemini text model to rewrite your prompt into a detailed, optimized version before generating. Great for short/simple prompts."),
  model: z.enum(modelIds)
    .optional()
    .describe(`Model to use. Default: ${DEFAULT_MODEL}. Options: ${modelIds.join(", ")}`),
  aspectRatio: z.enum(ASPECT_RATIOS)
    .optional()
    .describe("Aspect ratio (e.g. 16:9, 1:1, 9:16)"),
  imageSize: z.enum(IMAGE_SIZES)
    .optional()
    .describe("Output resolution: 512, 1K, 2K, or 4K. Must use uppercase K. Auto-downgrades if model doesn't support it."),
  outputDir: z.string()
    .optional()
    .describe("Directory to save the image. Defaults to NB_OUTPUT_DIR env var or current working directory."),
};

export function registerGenerateTool(server: McpServer, state: SessionState): void {
  server.registerTool(
    "nb_generate_image",
    {
      title: "Generate Image (Nano Banana)",
      description: `Generate a new image from a text prompt using Google's Nano Banana (Gemini) models.

Supports text-to-image generation with configurable model, aspect ratio, and resolution.
The image is saved to disk and the file path is returned (no base64 in response).

Default model: ${DEFAULT_MODEL} (Nano Banana 2 - best price/performance, up to 4K).

Args:
  - prompt (string, required): Detailed description of the image to generate
  - enhancePrompt (boolean, optional): Rewrite prompt using AI for better results
  - model (string, optional): Model ID to use
  - aspectRatio (string, optional): e.g. "16:9", "1:1", "9:16"
  - imageSize (string, optional): "512", "1K", "2K", or "4K"
  - outputDir (string, optional): Where to save the output image

Returns: File path of the generated image, model used, and any text description from the model.

Tips:
  - Use enhancePrompt=true for short prompts like "a cat in space" to get much better results
  - Narrative prompts work better than keyword lists
  - Use "Exclude X, Y, Z" instead of "no X, don't include Y" for negative prompts
  - Billing must be enabled on your Google AI account (no free tier for image generation)`,
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

        const outputDir = resolveOutputDir(params.outputDir);
        const model = params.model || (state.preferredModel as NonNullable<typeof params.model>) || undefined;

        // Enhance prompt: per-call param overrides config, config is default
        const shouldEnhance = params.enhancePrompt ?? state.enhancePrompt;
        let finalPrompt = params.prompt;
        let enhanced = false;
        if (shouldEnhance) {
          finalPrompt = await enhancePrompt(params.prompt, state.enhancerModel || undefined);
          enhanced = true;
        }

        const result = await generateImage({
          prompt: finalPrompt,
          model,
          aspectRatio: params.aspectRatio,
          imageSize: params.imageSize,
        });

        const filePath = saveImage(result.imageBase64, outputDir, result.mimeType);

        // Update session state
        state.lastImagePath = filePath;
        state.lastPrompt = finalPrompt;
        state.lastModel = result.model;
        state.lastTimestamp = new Date().toISOString();

        const lines = [
          `Image saved to: ${filePath}`,
          `Model: ${result.model}`,
        ];
        if (enhanced) {
          lines.push(`Enhanced prompt: ${finalPrompt}`);
        }
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
