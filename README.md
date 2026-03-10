# @maheidem/nanobanana-mcp

MCP server for Google's Nano Banana image generation models (Gemini). Generate and edit images via natural language from Claude Code or any MCP client.

## Features

- **Text-to-image generation** with configurable model, aspect ratio, and resolution (up to 4K)
- **Image editing** via natural language — add/remove elements, style transfer, inpainting
- **Iterative refinement** — keep editing the last generated image
- **3 model tiers** — Flash (cheap), Pro (studio-quality), Flash 2 (best value)
- **File paths only** — no base64 in responses, prevents context window overflow
- **Persistent model preference** — choose once, used everywhere

## Models

| Model | ID | Status | Max Resolution | Price/Image |
|-------|----|--------|---------------|-------------|
| Nano Banana | `gemini-2.5-flash-image` | GA | 1K | $0.039 |
| Nano Banana Pro | `gemini-3-pro-image-preview` | Preview | 4K | $0.134–$0.24 |
| Nano Banana 2 | `gemini-3.1-flash-image-preview` | Preview | 4K | $0.045–$0.151 |

## Prerequisites

- Node.js >= 18
- A Google AI API key with **billing enabled** (no free tier for image generation)
- Get your key at [Google AI Studio](https://aistudio.google.com/)

## Install

### Claude Code (recommended)

```bash
claude mcp add nano-banana -e GEMINI_API_KEY=your-key -- npx --yes @maheidem/nanobanana-mcp
```

### Manual `.mcp.json`

```json
{
  "mcpServers": {
    "nano-banana": {
      "command": "npx",
      "args": ["@maheidem/nanobanana-mcp"],
      "env": {
        "GEMINI_API_KEY": "your-key"
      }
    }
  }
}
```

## Tools

### `nb_generate_image`
Generate a new image from a text prompt.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `prompt` | Yes | Text description of the image |
| `model` | No | Model ID (uses saved preference) |
| `aspectRatio` | No | e.g. `16:9`, `1:1`, `9:16` |
| `imageSize` | No | `512`, `1K`, `2K`, or `4K` |
| `outputDir` | No | Save directory (default: `NB_OUTPUT_DIR` or cwd) |

### `nb_edit_image`
Edit an existing image with natural language instructions.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `imagePath` | Yes | Path to the source image |
| `prompt` | Yes | Edit instructions |
| `referenceImagePaths` | No | Reference images for style transfer |
| `model` | No | Model ID |
| `aspectRatio` | No | Output aspect ratio |
| `imageSize` | No | Output resolution |
| `outputDir` | No | Save directory |

### `nb_continue_editing`
Continue editing the last generated/edited image.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `prompt` | Yes | New edit instructions |
| `model` | No | Model ID |
| `imageSize` | No | Output resolution |
| `outputDir` | No | Save directory |

### `nb_get_last_image`
Get metadata about the last generated/edited image. No API call.

### `nb_list_models`
List available models and set a preferred model (persisted to disk).

| Parameter | Required | Description |
|-----------|----------|-------------|
| `setModel` | No | Model ID to save as default |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google AI API key (or `GOOGLE_API_KEY`) |
| `NB_OUTPUT_DIR` | No | Default output directory for generated images |

## License

MIT
