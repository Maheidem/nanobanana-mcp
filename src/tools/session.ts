import * as fs from "node:fs";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MODELS, DEFAULT_MODEL, IMAGE_SIZES, MODEL_CAPABILITIES } from "../constants.js";
import { editImage } from "../services/gemini.js";
import { readImageAsBase64, saveImage, resolveOutputDir } from "../utils/files.js";
import { loadConfig, saveConfig } from "../utils/config.js";
import { parseGeminiError, mcpError } from "../utils/errors.js";
import type { SessionState } from "../types.js";

const modelIds = [MODELS.FLASH, MODELS.PRO, MODELS.FLASH2] as const;

export function registerSessionTools(server: McpServer, state: SessionState): void {
  // --- nb_continue_editing ---
  server.registerTool(
    "nb_continue_editing",
    {
      title: "Continue Editing Last Image",
      description: `Continue editing the last generated or edited image with new instructions.

Re-reads the last image from disk and sends a fresh API call (no multi-turn chat state).
Use this for iterative refinement: generate an image, then keep tweaking it.

Args:
  - prompt (string, required): New edit instructions for the last image
  - model (string, optional): Model to use
  - imageSize (string, optional): Output resolution
  - outputDir (string, optional): Where to save the result

Returns: File path of the new version, model used.

Requires a previous nb_generate_image or nb_edit_image call in this session.`,
      inputSchema: {
        prompt: z.string()
          .min(1, "Edit prompt is required")
          .max(10000)
          .describe("New edit instructions for the last image"),
        model: z.enum(modelIds)
          .optional()
          .describe(`Model to use. Default: ${DEFAULT_MODEL}`),
        imageSize: z.enum(IMAGE_SIZES)
          .optional()
          .describe("Output resolution: 512, 1K, 2K, or 4K"),
        outputDir: z.string()
          .optional()
          .describe("Directory to save the result"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        if (!state.lastImagePath) {
          return mcpError("No previous image to continue editing. Use nb_generate_image or nb_edit_image first.");
        }

        if (!fs.existsSync(state.lastImagePath)) {
          return mcpError(`Last image file no longer exists: ${state.lastImagePath}`);
        }

        const source = readImageAsBase64(state.lastImagePath);
        const outputDir = resolveOutputDir(params.outputDir);
        const model = params.model || (state.preferredModel as NonNullable<typeof params.model>) || undefined;

        const result = await editImage({
          imageBase64: source.base64,
          imageMimeType: source.mimeType,
          prompt: params.prompt,
          model,
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

  // --- nb_get_last_image ---
  server.registerTool(
    "nb_get_last_image",
    {
      title: "Get Last Image Info",
      description: `Get metadata about the last generated or edited image in this session.

Returns the file path, prompt used, model, timestamp, and whether the file still exists on disk.
No API call is made — this is a local lookup only.

Returns: lastImagePath, lastPrompt, model, timestamp, fileExists`,
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => {
      if (!state.lastImagePath) {
        return { content: [{ type: "text", text: "No image has been generated or edited in this session yet." }] };
      }

      const fileExists = fs.existsSync(state.lastImagePath);
      const info = {
        lastImagePath: state.lastImagePath,
        lastPrompt: state.lastPrompt,
        model: state.lastModel,
        timestamp: state.lastTimestamp,
        fileExists,
      };

      return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
    },
  );

  // --- nb_list_models ---
  server.registerTool(
    "nb_list_models",
    {
      title: "List & Select Models",
      description: `List available Nano Banana models and optionally set a preferred model.

IMPORTANT: If no preferred model has been configured yet, you MUST call this tool first and ask the user which model they want to use before generating or editing any images. Use AskUserQuestion to let them choose.

When called without setModel: lists all models with capabilities and pricing.
When called with setModel: saves the preferred model to disk (persists across all sessions and folders).

The preferred model is used automatically by nb_generate_image, nb_edit_image, and nb_continue_editing when no explicit model is passed.

Args:
  - setModel (string, optional): Model ID to save as the preferred model (persisted to disk)

Returns: Formatted model list, current preference, and whether model selection is needed.`,
      inputSchema: {
        setModel: z.enum(modelIds)
          .optional()
          .describe("Set this model as the preferred model (persisted to disk across all sessions)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (params) => {
      // Persist preferred model if requested
      if (params.setModel) {
        state.preferredModel = params.setModel;
        state.needsModelSelection = false;
        const config = loadConfig();
        config.preferredModel = params.setModel;
        saveConfig(config);
      }

      const models = [
        {
          id: MODELS.FLASH,
          name: "Nano Banana (Gemini 2.5 Flash Image)",
          status: "GA",
          resolutions: MODEL_CAPABILITIES[MODELS.FLASH].sizes,
          pricing: "$0.039/image (1K)",
          best_for: "Quick, cheap generations. 1K resolution only.",
        },
        {
          id: MODELS.PRO,
          name: "Nano Banana Pro (Gemini 3 Pro Image)",
          status: "Preview",
          resolutions: MODEL_CAPABILITIES[MODELS.PRO].sizes,
          pricing: "$0.134/image (1K/2K), $0.24/image (4K)",
          best_for: "Highest quality, studio-grade. Best text rendering.",
        },
        {
          id: MODELS.FLASH2,
          name: "Nano Banana 2 (Gemini 3.1 Flash Image)",
          status: "Preview",
          resolutions: MODEL_CAPABILITIES[MODELS.FLASH2].sizes,
          pricing: "$0.045 (512px) → $0.151 (4K)",
          best_for: "Best price/performance. Up to 4K. Configurable thinking.",
        },
      ];

      const preferred = state.preferredModel || DEFAULT_MODEL;
      const lines = models.map((m) => {
        const isActive = m.id === preferred;
        return [
          `${isActive ? "→ " : "  "}**${m.name}**${isActive ? " (selected)" : ""}`,
          `  ID: ${m.id}`,
          `  Status: ${m.status}`,
          `  Resolutions: ${[...m.resolutions].join(", ")}`,
          `  Pricing: ${m.pricing}`,
          `  Best for: ${m.best_for}`,
        ].join("\n");
      }).join("\n\n");

      let footer: string;
      if (params.setModel) {
        footer = `\nPreferred model saved: ${params.setModel} (persisted to disk)`;
      } else if (state.preferredModel) {
        footer = `\nCurrent preferred model: ${state.preferredModel}`;
      } else {
        footer = `\nNo preferred model set yet. Ask the user which model they want to use, then call nb_list_models with setModel.`;
      }

      return { content: [{ type: "text", text: lines + footer }] };
    },
  );
}
