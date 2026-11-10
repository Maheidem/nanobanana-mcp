---
title: Google Nano Banana Image Generation Models - Complete Research
date: 2026-03-10
tags: [google, nano-banana, gemini, image-generation, image-editing, vertex-ai, mcp]
status: completed
confidence: high
---

# Google Nano Banana Image Generation Models: Complete Research

## Executive Summary

"Nano Banana" is Google's branding for Gemini's native image generation and editing capabilities. It encompasses three distinct model tiers built on the Gemini architecture, each optimized for different use cases ranging from rapid prototyping to studio-quality professional asset production.

The Nano Banana family currently consists of three models: **Nano Banana** (Gemini 2.5 Flash Image, released August 2025), **Nano Banana Pro** (Gemini 3 Pro Image, released November 2025), and **Nano Banana 2** (Gemini 3.1 Flash Image, released February 2026). These models are accessible through the Gemini API (via Google AI Studio), Vertex AI, Firebase AI Logic, and the Gemini CLI. They are separate from Google's Imagen models, which remain available as dedicated high-fidelity image generators with mask-based editing and upscaling capabilities.

The models support text-to-image generation, image editing via natural language, multi-turn iterative editing, style transfer, reference image composition, and text rendering within images. Output resolutions range from 512px to 4K depending on the model tier, with pricing from $0.039/image (Flash) to $0.24/image (Pro 4K).

---

## 1. What Are Nano Banana Models?

### Product Identity

Nano Banana is the consumer and developer-facing brand name for Gemini's built-in image generation capabilities. Unlike Imagen (a separate dedicated image generation model), Nano Banana models are multimodal Gemini models that can generate and edit images as part of a broader conversational interaction.

Source: [Image generation with Gemini (aka Nano Banana)](https://ai.google.dev/gemini-api/docs/image-generation)

### Model Versions

| Codename | Official Model Name | Model ID | Release Date | Status |
|---|---|---|---|---|
| Nano Banana | Gemini 2.5 Flash Image | `gemini-2.5-flash-image` | August 2025 | GA |
| Nano Banana Pro | Gemini 3 Pro Image | `gemini-3-pro-image-preview` | November 20, 2025 | Public Preview |
| Nano Banana 2 | Gemini 3.1 Flash Image | `gemini-3.1-flash-image-preview` | February 26, 2026 | Public Preview |

Sources:
- [Gemini Image -- Nano Banana (Google DeepMind)](https://deepmind.google/models/gemini-image/)
- [Gemini 3 Pro Image -- Nano Banana Pro (Google DeepMind)](https://deepmind.google/models/gemini-image/pro/)
- [Google launches Nano Banana 2 (TechCrunch)](https://techcrunch.com/2026/02/26/google-launches-nano-banana-2-model-with-faster-image-generation/)
- [Google releases Nano Banana Pro (TechCrunch)](https://techcrunch.com/2025/11/20/google-releases-nano-banana-pro-its-latest-image-generation-model/)

### Relationship to Other Google AI Models

**Nano Banana vs Imagen:**
- **Nano Banana** = Gemini-based multimodal models that generate images as part of conversational text+image interactions. They accept text and image inputs and produce text and image outputs.
- **Imagen** = Dedicated image generation models (Imagen 4.0) optimized purely for text-to-image generation, plus specialized capabilities like mask-based inpainting, outpainting, and upscaling.
- Imagen models: `imagen-4.0-generate-001`, `imagen-4.0-ultra-generate-001`, `imagen-4.0-fast-generate-001`, `imagen-4.0-upscale-preview`
- Nano Banana models cannot do mask-based editing natively (it's done via natural language instead). Imagen has explicit mask parameters.

Source: [Generate images using Imagen](https://ai.google.dev/gemini-api/docs/imagen)

**Nano Banana vs Gemini text models:**
- Nano Banana models ARE Gemini models with image generation enabled. They use the same `generateContent` API endpoint as text-only Gemini models.
- The key difference is setting `responseModalities: ["TEXT", "IMAGE"]` in the generation config.

### Platform Availability

| Platform | Nano Banana | Nano Banana Pro | Nano Banana 2 |
|---|---|---|---|
| Gemini API (Google AI Studio) | Yes | Yes | Yes (Preview) |
| Vertex AI | Yes | Yes | Yes (Preview) |
| Firebase AI Logic | Yes | Yes | Yes |
| Gemini CLI | Yes | Yes | Yes |
| Gemini App (consumer) | Yes | Yes | Yes |
| Google Search | -- | -- | Yes |

Source: [Nano Banana 2 blog post](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-nano-banana-2/)

---

## 2. Onboarding and Access

### Getting Started (Gemini Developer API)

**Step 1: Get an API Key**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with a Google account
3. Navigate to API Keys section
4. Generate a new API key

**Step 2: Install SDK**

Python:
```bash
pip install google-genai
```

Node.js/TypeScript:
```bash
npm install @google/genai
```

**Step 3: Configure Authentication**

```bash
export GEMINI_API_KEY="your-api-key-here"
```

Source: [Gemini API quickstart](https://ai.google.dev/gemini-api/docs/quickstart)

### Getting Started (Vertex AI / Enterprise)

**Step 1: Google Cloud Project Setup**
1. Create or select a Google Cloud project
2. Enable the Vertex AI API
3. Set up billing

**Step 2: Authentication via Application Default Credentials (ADC)**
```bash
gcloud auth application-default login
```

Or use a service account:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

**Step 3: Environment Configuration**
```bash
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GOOGLE_CLOUD_LOCATION="global"
export GOOGLE_GENAI_USE_VERTEXAI="True"
```

Source: [Generate images with Gemini on Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/image-generation)

### Authentication Methods Summary

| Method | Use Case | Platform |
|---|---|---|
| API Key (`x-goog-api-key` header) | Quick prototyping, personal projects | Gemini Developer API |
| OAuth 2.0 / ADC | Enterprise applications | Vertex AI |
| Service Account JSON | Server-to-server, CI/CD | Vertex AI |
| Firebase App Config | Mobile/web apps | Firebase AI Logic |

### Pricing

#### Nano Banana (Gemini 2.5 Flash Image)

| Tier | Input Cost | Output Cost (per image) |
|---|---|---|
| Free | Not available | Not available |
| Paid (Standard) | $0.30/1M tokens | $0.039/image (1024px) |
| Paid (Batch) | $0.15/1M tokens | $0.0195/image |

#### Nano Banana Pro (Gemini 3 Pro Image)

| Tier | Input Cost | Output Cost (per image) |
|---|---|---|
| Free | Not available | Not available |
| Paid (Standard) | $2.00/1M tokens | 1K/2K: $0.134, 4K: $0.24 |
| Paid (Batch) | $1.00/1M tokens | 1K/2K: $0.067, 4K: $0.12 |

#### Nano Banana 2 (Gemini 3.1 Flash Image)

| Tier | Input Cost | Output Cost (per image by resolution) |
|---|---|---|
| Free | Not available | Not available |
| Paid 512px | $0.50/1M tokens | $0.045 |
| Paid 1K | $0.50/1M tokens | $0.067 |
| Paid 2K | $0.50/1M tokens | $0.101 |
| Paid 4K | $0.50/1M tokens | $0.151 |
| Batch 512px | $0.25/1M tokens | $0.022 |
| Batch 1K | $0.25/1M tokens | $0.034 |
| Batch 2K | $0.25/1M tokens | $0.050 |
| Batch 4K | $0.25/1M tokens | $0.076 |

**Important:** The Batch API provides a flat **50% discount** on all token prices with a target turnaround of 24 hours (typically 2-6 hours).

**No free tier for image generation.** The free tier provides 0 IPM (images per minute). Billing must be enabled.

Sources:
- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)

### Rate Limits

| Tier | Requirement | IPM (Images/Min) | RPM | Notes |
|---|---|---|---|---|
| Free | Google account | 0 | 5 | No image generation |
| Tier 1 | Billing enabled | 10 | 300 | Unlocked immediately with billing |
| Tier 2 | $50+ spend | Higher | Higher | Check AI Studio dashboard |
| Tier 3 | $500+ spend | Highest | Highest | Check AI Studio dashboard |

**Batch API Enqueued Token Limits:**
- Tier 1: 1,000,000 tokens (Gemini 3.1 Flash Image)
- Tier 2: 250,000,000 tokens
- Tier 3: 750,000,000 tokens

Source: [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)

---

## 3. Core Capabilities

### Image Generation from Text

All three Nano Banana models support text-to-image generation. You describe the scene in natural language and the model generates the image.

**Key characteristics:**
- Multimodal output: Models always return both text AND images (cannot return only images)
- Narrative prompts work better than keyword lists
- Advanced text rendering in generated images
- SynthID invisible watermarking on all generated images

### Image Editing

Edit existing images by providing an image + text instructions. Supports:
- Adding elements to existing images
- Removing elements via description
- Modifying colors, styles, lighting
- Style transfer from reference images
- Transforming artistic style
- Inpainting specific areas (via natural language, not pixel masks)

### Multi-Turn Iterative Editing

Use chat/conversation mode to iteratively refine images:
1. Generate or upload an initial image
2. Send follow-up instructions: "Make it warmer", "Add clouds", "Change the style to watercolor"
3. The model maintains context across turns using "thought signatures"

### Reference Images

- **Nano Banana 2:** Up to 10 objects + 4 characters (14 total)
- **Nano Banana Pro:** Up to 6 objects + 5 characters (11 total)
- **Nano Banana:** Up to 14 reference images

Reference images enable character consistency, style guidance, and composition control.

### Text Rendering in Images

All models can render text within generated images (signs, posters, labels). Nano Banana Pro has the lowest error rates (mostly under 10%) across multiple languages.

### Supported Input/Output Formats

| Format | Input | Output |
|---|---|---|
| PNG | Yes | Yes |
| JPEG | Yes | Yes |
| WebP | Yes | No |
| HEIC/HEIF | Yes | No |

### Resolution Limits

| Model | Default | Supported Resolutions |
|---|---|---|
| Nano Banana (2.5 Flash) | 1024px | 1K only |
| Nano Banana Pro (3 Pro) | 1K | 1K, 2K, 4K |
| Nano Banana 2 (3.1 Flash) | 1K | 512px, 1K, 2K, 4K |

### Aspect Ratios

All models support: `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`

Additional ratios for some models: `1:4`, `1:8`, `4:1`, `8:1`

### Video Capabilities

**None.** Nano Banana models are image-only. Google has separate video generation models (Veo).

### Grounding (Search Integration)

- **Google Web Search:** Available on all models. Enables grounding images in real-world knowledge.
- **Google Image Search:** Available on Gemini 3.1 Flash Image (Nano Banana 2) only. Returns source attributions.

### Content Safety

Multi-layer filtering operates at three stages:
1. **Pre-generation:** Prompt filtering before generation begins
2. **During generation:** Real-time monitoring
3. **Post-generation:** Review before returning results

**Person generation:** Photorealistic depictions of public figures or children are restricted.

**SynthID watermarking:** All generated images are imperceptibly watermarked, persisting through compression, resizing, and format conversion.

Safety settings can be configured per-request:
```json
{
  "safetySettings": [{
    "method": "PROBABILITY",
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  }]
}
```

Source: [Gemini 3 Pro Image on Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-pro-image)

---

## 4. API Integration

### REST API

**Base URL (Gemini Developer API):**
```
https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
```

**Base URL (Vertex AI):**
```
https://{API_ENDPOINT}/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL}:generateContent
```

**Authentication Header:**
- Gemini API: `x-goog-api-key: YOUR_API_KEY`
- Vertex AI: `Authorization: Bearer $(gcloud auth print-access-token)`

### cURL Example: Text-to-Image Generation

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: ${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "A futuristic cityscape at sunset with flying cars"}]
    }],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "imageConfig": {
        "aspectRatio": "16:9",
        "imageSize": "2K"
      }
    }
  }'
```

### cURL Example: Image Editing

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: ${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "Change the sky to a dramatic purple sunset"},
        {"inline_data": {"mime_type": "image/png", "data": "'$(base64 -i input.png)'"}}
      ]
    }],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"]
    }
  }'
```

### Response Format

```json
{
  "candidates": [{
    "content": {
      "parts": [
        {"text": "Here is the generated image of a futuristic cityscape..."},
        {
          "inlineData": {
            "mimeType": "image/png",
            "data": "iVBORw0KGgoAAAANSUhEUgAA..."
          }
        }
      ]
    }
  }]
}
```

**Important:** The response always includes both text and image parts. Images are returned as base64-encoded data in `inlineData`.

### Request Size Limits

- Inline data (text + images): **20 MB** maximum total request size
- For larger inputs, use the File API to upload files first
- Per-file limit for inline data: **7 MB**
- Per-file from Google Cloud Storage: **30 MB**
- Total input size: **500 MB** (via File API)

### SDK Options

| Language | Package | Install |
|---|---|---|
| Python | `google-genai` | `pip install google-genai` |
| Node.js/TypeScript | `@google/genai` | `npm install @google/genai` |
| Java | `com.google.cloud:google-genai` | Maven/Gradle |
| Go | `cloud.google.com/go/ai/generativelanguage` | `go get` |
| Swift | Firebase AI Logic SDK | CocoaPods/SPM |
| Kotlin | Firebase AI Logic SDK | Gradle |
| Dart/Flutter | Firebase AI Logic SDK | pub.dev |
| Unity/C# | Firebase AI Logic SDK | Unity Package Manager |

Sources:
- [Image generation with Gemini](https://ai.google.dev/gemini-api/docs/image-generation)
- [Google Gen AI Python SDK](https://github.com/googleapis/python-genai)
- [Google Gen AI JS SDK](https://github.com/googleapis/js-genai)
- [Firebase AI Logic](https://firebase.google.com/docs/ai-logic/generate-images-gemini)

---

## 5. Programmatic Usage

### Python SDK Examples

#### Setup

```python
from google import genai
from google.genai import types
import base64
import pathlib

# Gemini Developer API
client = genai.Client(api_key="YOUR_GEMINI_API_KEY")

# OR Vertex AI (set env vars first)
# export GOOGLE_CLOUD_PROJECT=your-project
# export GOOGLE_CLOUD_LOCATION=global
# export GOOGLE_GENAI_USE_VERTEXAI=True
# client = genai.Client()
```

#### Generate Image from Text

```python
response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents="A futuristic cityscape at sunset with flying cars",
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
        image_config=types.ImageConfig(
            aspect_ratio="16:9",
            image_size="2K"
        ),
    ),
)

# Save generated image
for part in response.candidates[0].content.parts:
    if part.inline_data:
        image_bytes = part.inline_data.data
        pathlib.Path("output.png").write_bytes(image_bytes)
        print("Image saved to output.png")
    elif part.text:
        print(f"Text: {part.text}")
```

#### Edit an Existing Image

```python
import pathlib

# Load existing image
image_bytes = pathlib.Path("input.png").read_bytes()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        types.Part.from_text("Change the sky to a dramatic purple sunset"),
    ],
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
    ),
)

# Save edited image
for part in response.candidates[0].content.parts:
    if part.inline_data:
        pathlib.Path("edited.png").write_bytes(part.inline_data.data)
```

#### Multi-Turn Editing (Chat)

```python
chat = client.chats.create(
    model="gemini-3.1-flash-image-preview",
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
    ),
)

# First turn: generate
response1 = chat.send_message("Generate a cozy cabin in the mountains at sunset")
# Save first image...

# Second turn: edit
response2 = chat.send_message("Add snow falling gently")
# Save second image...

# Third turn: refine
response3 = chat.send_message("Make the lighting warmer and add smoke from the chimney")
# Save third image...
```

#### Use Style References

```python
style_image = pathlib.Path("style_reference.png").read_bytes()
content_image = pathlib.Path("photo.png").read_bytes()

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=[
        types.Part.from_bytes(data=style_image, mime_type="image/png"),
        types.Part.from_bytes(data=content_image, mime_type="image/png"),
        types.Part.from_text(
            "Transform the photo into the artistic style of the reference image. "
            "Preserve the original composition but render it with the reference style."
        ),
    ],
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
        image_config=types.ImageConfig(image_size="4K"),
    ),
)
```

#### Generate 4K Image with Thinking (Pro)

```python
response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents="A photorealistic product photograph of a luxury watch on a marble surface. Studio lighting with a 3-point setup creating dramatic shadows. Ultra-realistic, with sharp focus on the watch face. 85mm lens.",
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
        image_config=types.ImageConfig(
            aspect_ratio="3:2",
            image_size="4K",
        ),
    ),
)
```

#### Use Thinking Configuration (Nano Banana 2)

```python
response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents="Design a detailed infographic about climate change with charts and data",
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
        thinking_config=types.ThinkingConfig(
            thinking_level="HIGH",
            include_thoughts=True,
        ),
    ),
)
```

#### Use Google Search Grounding

```python
chat = client.chats.create(
    model="gemini-3.1-flash-image-preview",
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
        tools=[{"google_search": {}}],
    ),
)

response = chat.send_message("Generate an image of the latest Tesla Cybertruck in a desert setting")
```

### Node.js/TypeScript SDK Examples

#### Setup

```typescript
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

// Gemini Developer API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// OR Vertex AI
// const ai = new GoogleGenAI({ vertexai: true, project: "your-project", location: "global" });
```

#### Generate Image from Text

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: "A watercolor painting of a Japanese garden in spring",
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    imageConfig: {
      aspectRatio: "16:9",
      imageSize: "2K",
    },
  },
});

// Save generated image
for (const part of response.candidates[0].content.parts) {
  if (part.inlineData) {
    const buffer = Buffer.from(part.inlineData.data, "base64");
    fs.writeFileSync("output.png", buffer);
    console.log("Image saved to output.png");
  } else if (part.text) {
    console.log(`Text: ${part.text}`);
  }
}
```

#### Edit an Existing Image

```typescript
const imageBuffer = fs.readFileSync("input.png");
const base64Image = imageBuffer.toString("base64");

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: [
    { inlineData: { mimeType: "image/png", data: base64Image } },
    { text: "Make this image look like a vintage photograph from the 1970s" },
  ],
  config: {
    responseModalities: ["TEXT", "IMAGE"],
  },
});
```

#### Multi-Turn Editing (Chat)

```typescript
const chat = ai.chats.create({
  model: "gemini-3.1-flash-image-preview",
  config: {
    responseModalities: ["TEXT", "IMAGE"],
  },
});

// Generate initial image
const response1 = await chat.sendMessage("Generate a portrait of a fantasy elf warrior");

// Refine
const response2 = await chat.sendMessage("Add glowing runes on the armor");

// Further refine
const response3 = await chat.sendMessage("Change the background to a misty forest");
```

### Generation Parameters

| Parameter | Type | Values | Notes |
|---|---|---|---|
| `responseModalities` | string[] | `["TEXT", "IMAGE"]` or `["IMAGE"]` | TEXT + IMAGE is recommended |
| `imageConfig.aspectRatio` | string | `"1:1"`, `"16:9"`, `"9:16"`, etc. | See full list above |
| `imageConfig.imageSize` | string | `"512"`, `"1K"`, `"2K"`, `"4K"` | **Must use uppercase K** |
| `temperature` | float | 0.0 - 2.0 | Controls randomness |
| `topP` | float | 0.0 - 1.0 (default 0.95) | Nucleus sampling |
| `topK` | int | 64 (fixed for Pro) | Token selection |
| `candidateCount` | int | 1 | Only 1 candidate supported |
| `thinkingConfig.thinkingLevel` | string | `"minimal"`, `"high"` | Nano Banana 2 & Pro |
| `thinkingConfig.includeThoughts` | boolean | true/false | Return thinking text |

**Critical note on `imageSize`:** You MUST use uppercase "K" (e.g., `"4K"`, not `"4k"`). Lowercase is silently ignored and falls back to 1K default.

Sources:
- [Image generation with Gemini](https://ai.google.dev/gemini-api/docs/image-generation)
- [Google Gen AI Python SDK](https://googleapis.github.io/python-genai/)
- [Google Gen AI JS SDK (@google/genai)](https://www.npmjs.com/package/@google/genai)

---

## 6. Advanced Features

### Negative Prompts

Nano Banana models support negative prompts through natural language description. Instead of listing exclusions, describe what you DO NOT want plainly:

**Do:** "Generate a landscape. Exclude walls, frames, borders."
**Do NOT:** "Generate a landscape with no walls, don't show frames."

The key insight: avoid instructive language or words like "no" or "don't" -- simply list the elements to exclude.

Source: [How to prompt Gemini 2.5 Flash Image Generation](https://developers.googleblog.com/en/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/)

### Inpainting (Area-Specific Editing)

Unlike Imagen which uses pixel masks, Nano Banana uses natural language for targeted editing:

```
"Using the provided image, change only the hat to red. Keep everything else exactly the same."
```

Template: "Using the provided image, change only the [specific element] to [new description]. Keep everything else exactly the same."

### Style Transfer

```
"Transform the provided photograph into the artistic style of [artist/movement]. Preserve the original composition but render it with [stylistic elements]."
```

### Multi-Image Composition

```
"Create a new image by combining elements from the provided images. Take the [element from image 1] and place it with the [element from image 2]. The final image should be [scene description]."
```

### Character Consistency Across Images

Nano Banana 2 supports maintaining character resemblance across multiple generations:
- Up to 5 characters with consistent appearance
- Use detailed character descriptions in conversation context
- Restart conversations with full descriptions if features drift

### Batch Generation

The Batch API enables high-volume generation at 50% cost:

```python
# Submit batch job
batch_job = client.batches.create(
    model="gemini-3.1-flash-image-preview",
    requests=[...],  # List of generation requests
)

# Poll for completion
status = client.batches.get(batch_job.name)
# Or configure webhook notification
```

- Target turnaround: 24 hours (typically 2-6 hours)
- Supports hundreds of thousands of requests per submission
- Results include per-request success/failure counts

Source: [Batch API](https://ai.google.dev/gemini-api/docs/batch-api)

### Thinking / Reasoning (Pro and Nano Banana 2)

For complex generation tasks, the model uses an internal reasoning process:

- **Nano Banana Pro:** Thinking is always enabled (cannot be disabled)
- **Nano Banana 2:** Configurable via `thinkingConfig`
  - `thinkingLevel: "minimal"` -- faster, less reasoning
  - `thinkingLevel: "high"` -- more deliberate, better for complex compositions

Thinking improves results for:
- Complex multi-subject compositions
- Precise text rendering
- Detailed technical diagrams
- Images requiring real-world logic

### Thought Signatures

When using multi-turn conversations, the model includes "thought signatures" in responses. These preserve context across turns for better iterative editing. They appear as opaque tokens in the response parts.

### Content Credentials (C2PA)

Gemini 3 Pro Image supports Content Credentials (C2PA), an industry standard for digital content provenance, providing verifiable metadata about AI-generated images.

### Grounding with Image Search (Nano Banana 2 only)

```python
config = types.GenerateContentConfig(
    response_modalities=["TEXT", "IMAGE"],
    tools=[{"google_image_search": {}}],
)
```

When using Image Search grounding, the response includes:
- `searchEntryPoint`: HTML/CSS for search suggestions
- `groundingChunks`: Top 3 sources with attribution
- `imageSearchQueries`: Search terms used
- `groundingSupports`: Citation mappings

**Important:** You must maintain source attribution when using Image Search grounding.

---

## 7. MCP Server Integration

### Existing MCP Servers

Multiple MCP servers exist for wrapping Nano Banana capabilities:

#### 1. nanobanana-mcp-server (by zhongweili) -- Most Feature-Rich

- **Install:** `pip install nanobanana-mcp-server` or `uvx nanobanana-mcp-server@latest`
- **Language:** Python 3.11+
- **Models:** All three Nano Banana models with intelligent auto-routing
- **Features:** Smart model selection, aspect ratio control, output path control, smart templates, Google Search grounding, file management via Gemini Files API
- **Tools:** `generate_image()`, `edit_image()`, `upload_file()`

Configuration for Claude Desktop:
```json
{
  "mcpServers": {
    "nanobanana": {
      "command": "uvx",
      "args": ["nanobanana-mcp-server@latest"],
      "env": {
        "GEMINI_API_KEY": "your-key-here"
      }
    }
  }
}
```

Source: [GitHub - zhongweili/nanobanana-mcp-server](https://github.com/zhongweili/nanobanana-mcp-server)

#### 2. Nano-Banana-MCP (by ConechoAI) -- Node.js Based

- **Install:** `npm install nano-banana-mcp` or `npx nano-banana-mcp`
- **Language:** TypeScript/Node.js 18+
- **Features:** Image generation, editing, iterative continue-editing, style transfer, reference images, cross-platform file handling
- **Tools:** `generate_image`, `edit_image`, `continue_editing`, `get_last_image_info`, `configure_gemini_token`, `get_configuration_status`
- **Notable:** Entirely generated by Claude Code

Source: [GitHub - ConechoAI/Nano-Banana-MCP](https://github.com/ConechoAI/Nano-Banana-MCP)

#### 3. Your Current Project's MCP Server

Based on the MCP tools already registered in this environment, the `nano-banana` MCP server exposes:

| Tool | Description |
|---|---|
| `nb_pro_generate_image` | Generate NEW 4K images from text using Gemini 3 Pro Image |
| `nb_pro_edit_image` | Edit existing images by file path using Gemini 3 Pro Image |
| `nb_pro_continue_editing` | Continue editing the last image in session |
| `nb_pro_get_last_image` | Get metadata about the last generated/edited image |

### Best Practices for Building an MCP Server

Based on analysis of existing implementations:

1. **Tool Design:**
   - Separate `generate` and `edit` into distinct tools (different parameter schemas)
   - Add a `continue_editing` tool for stateful iterative workflows
   - Include a `get_info` tool for session state inspection

2. **State Management:**
   - Track the last generated/edited image path for continue-editing
   - Use timestamped file naming: `generated-{timestamp}-{id}.png`
   - Support configurable output directories

3. **Model Selection:**
   - Default to Nano Banana 2 (fastest, best price/performance)
   - Route to Pro automatically when quality keywords are detected ("4K", "professional", "production")
   - Allow explicit model tier override

4. **Authentication:**
   - Support multiple auth methods (API key, Vertex AI ADC, auto-detect)
   - Use environment variable for API key (standard: `GEMINI_API_KEY`)
   - Never hardcode keys

5. **Error Handling:**
   - Handle rate limits gracefully with retry logic
   - Parse safety filter rejections and provide actionable feedback
   - Validate image sizes and aspect ratios before API calls

6. **Input Validation:**
   - Validate `imageSize` uses uppercase "K"
   - Validate aspect ratio is in the supported list
   - Check file existence and MIME type for edit operations

Sources:
- [GitHub - zhongweili/nanobanana-mcp-server](https://github.com/zhongweili/nanobanana-mcp-server)
- [GitHub - ConechoAI/Nano-Banana-MCP](https://github.com/ConechoAI/Nano-Banana-MCP)
- [Nano Banana MCP on PulseMCP](https://www.pulsemcp.com/servers/conechoai-nano-banana)

---

## 8. Comparison with Competitors

### Nano Banana vs DALL-E 3 (OpenAI)

| Feature | Nano Banana 2 | DALL-E 3 |
|---|---|---|
| Max Resolution | 4K (4096px) | 1024x1792 |
| Text Rendering | Good (under 10% error rate) | Best-in-class |
| Editing | Full conversational editing | Limited |
| Multi-turn | Yes, with context preservation | No |
| Pricing | $0.045-$0.151/image | $0.04-$0.12/image |
| API | REST + SDKs (Python, Node, etc.) | REST + Python SDK |
| Style | Bright, vivid | Photorealistic |
| Batch | Yes (50% discount) | No |

### Nano Banana vs Midjourney

| Feature | Nano Banana 2 | Midjourney |
|---|---|---|
| Max Resolution | 4K | Up to 4x upscale |
| API | Full REST API + SDKs | Limited API (newer) |
| Editing | Conversational | Vary/Remix commands |
| Pricing | Pay-per-image ($0.045+) | $10-60/month subscription |
| Style | Versatile | Most aesthetically polished |
| Best For | Developer integration, products | Creative/artistic work |
| Text Rendering | Good | Poor |

### Nano Banana vs Stable Diffusion

| Feature | Nano Banana 2 | Stable Diffusion (SDXL/SD3) |
|---|---|---|
| Deployment | Cloud API only | Self-hosted or API |
| Cost | Per-image pricing | Free (self-hosted) or API pricing |
| Customization | Prompt-based | Full control (LoRA, ControlNet, etc.) |
| Editing | Natural language | Mask-based (pixel-level control) |
| Open Source | No | Yes |
| GPU Required | No (cloud) | Yes (self-hosted) |

### Unique Advantages of Nano Banana

1. **Conversational editing:** Most natural editing workflow -- just describe changes in plain English
2. **Multi-turn context:** Maintains conversation history for iterative refinement
3. **Text rendering:** Among the best text-in-image capabilities
4. **Integrated grounding:** Can use Google Search for real-world accuracy
5. **Character consistency:** Maintains character resemblance across generations
6. **Multi-platform SDKs:** Python, Node.js, Java, Go, Swift, Kotlin, Dart, C#
7. **Batch API:** 50% cost reduction for high-volume workloads
8. **4K output:** Up to 4096px resolution

### Unique Disadvantages

1. **No free tier for image generation** (billing required)
2. **No pixel-level mask control** (unlike Imagen, Stable Diffusion)
3. **Always returns text with images** (cannot get image-only responses)
4. **Cannot be self-hosted** (cloud-only)
5. **Safety filters** can be restrictive for some creative use cases
6. **SynthID watermarking** cannot be removed
7. **Preview status** (Pro and Nano Banana 2 are still in preview)

Sources:
- [Midjourney vs DALL-E vs Gemini Imagen 2026](https://freeacademy.ai/blog/midjourney-vs-dalle-vs-gemini-imagen-comparison-2026)
- [AI Image Generation: DALL-E vs Gemini vs Stable Diffusion](https://www.weblineindia.com/blog/ai-image-generation-dalle-vs-gemini-vs-stable-diffusion/)
- [Best AI Image Generators 2026 (Zapier)](https://zapier.com/blog/best-ai-image-generator/)

---

## 9. Imagen: The Other Google Image Model

Imagen is Google's dedicated image generation model, separate from Nano Banana/Gemini. It is accessed through a different API method (`generateImages` instead of `generateContent`).

### Current Imagen Models

| Model ID | Tier | Resolution |
|---|---|---|
| `imagen-4.0-generate-001` | Standard | 1K, 2K |
| `imagen-4.0-ultra-generate-001` | Ultra | 1K, 2K |
| `imagen-4.0-fast-generate-001` | Fast | 1K, 2K |
| `imagen-4.0-upscale-preview` | Upscale | Up to 17MP |

### When to Use Imagen vs Nano Banana

| Use Case | Best Model |
|---|---|
| Conversational image editing | Nano Banana |
| Multi-turn iterative refinement | Nano Banana |
| Text rendering in images | Nano Banana Pro |
| 4K resolution generation | Nano Banana Pro / Nano Banana 2 |
| Mask-based inpainting | Imagen |
| Mask-based outpainting | Imagen |
| Image upscaling (2x-4x) | Imagen Upscale |
| Batch generation (multiple images per request) | Imagen (1-4 per request) |
| Person generation controls | Imagen (explicit toggle) |
| Pure text-to-image (no conversation needed) | Either |

### Image Upscaling (Imagen Only)

```bash
curl -X POST \
  "https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/imagen-4.0-upscale-preview:predict" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{
      "prompt": "",
      "image": {"bytesBase64Encoded": "'$(base64 -i input.png)'"}
    }],
    "parameters": {
      "mode": "upscale",
      "upscaleFactor": "x4",
      "mimeType": "image/png"
    }
  }'
```

Upscale factors: `x2`, `x3`, `x4` (output must not exceed 17 megapixels).

Source: [Upscale images using Imagen](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/upscale-image)

---

## 10. Prompt Engineering Best Practices

### Core Principle

**"Describe the scene, don't just list keywords."** Nano Banana models excel with narrative, descriptive prompts.

### Templates by Use Case

**Photorealistic:**
> A photorealistic [shot type] of [subject], [action], set in [environment]. The scene is illuminated by [lighting], creating a [mood] atmosphere. Captured with a [camera/lens details].

**Product Mockup:**
> A high-resolution, studio-lit product photograph of a [product] on a [surface]. The lighting is a [setup] to [purpose]. Ultra-realistic, with sharp focus on [key detail].

**Sticker/Icon:**
> A [style] sticker of a [subject], featuring [characteristics] and a [color palette]. The design should have [line style] and [shading style]. The background must be white.

**Text in Image:**
> Create a [image type] for [brand] with the text '[text]' in a [font style]. The design should be [style], with a [color scheme].

### Tips

1. **Use camera language:** "wide-angle shot," "macro shot," "85mm portrait lens," "Dutch angle"
2. **Specify lighting:** "golden hour," "studio 3-point lighting," "dramatic backlighting"
3. **Negative prompts:** Simply list elements to exclude, avoid "no" or "don't"
4. **Aspect ratio preservation:** When editing, add "Do not change the input aspect ratio"
5. **Iterative refinement:** Use conversational follow-ups for gradual improvements
6. **Multiple images:** The model adopts the last image's aspect ratio

Source: [How to prompt Gemini 2.5 Flash Image Generation](https://developers.googleblog.com/en/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/)

---

## Gaps and Limitations of This Research

1. **Exact rate limits per tier** are not publicly documented in detail; they must be checked in the AI Studio dashboard
2. **Seed parameter** for reproducible generation: Referenced in some third-party guides but not clearly documented in official API docs as of this research date
3. **Guidance scale** parameter: Not exposed in the Nano Banana API (unlike Stable Diffusion)
4. **Batch API detailed code examples** for image generation specifically are not yet in the official docs
5. **Webhook callback configuration** for batch jobs: Mentioned in community discussions but lacking official documentation
6. **Video generation** is not supported by Nano Banana; Google has separate Veo models for this
7. **Nano Banana Pro and Nano Banana 2** are both still in "Preview" status; breaking changes are possible

---

## References

### Primary Sources (Official Documentation)

1. **[Image generation with Gemini (aka Nano Banana)](https://ai.google.dev/gemini-api/docs/image-generation)**
   - Accessed: 2026-03-10
   - Type: Official Documentation
   - Reliability: 5/5
   - Used for: API specifications, model IDs, parameters, code examples

2. **[Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing)**
   - Accessed: 2026-03-10
   - Type: Official Documentation
   - Reliability: 5/5
   - Used for: Per-image pricing, batch pricing, all three model tiers

3. **[Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)**
   - Accessed: 2026-03-10
   - Type: Official Documentation
   - Reliability: 5/5
   - Used for: IPM, RPM, tier structure, batch token limits

4. **[Generate images with Gemini on Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/image-generation)**
   - Accessed: 2026-03-10
   - Type: Official Documentation
   - Reliability: 5/5
   - Used for: Vertex AI setup, ADC authentication, enterprise features

5. **[Gemini 3 Pro Image on Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-pro-image)**
   - Accessed: 2026-03-10
   - Type: Official Documentation
   - Reliability: 5/5
   - Used for: Model specs, token limits, safety settings, supported formats

6. **[Generate images using Imagen](https://ai.google.dev/gemini-api/docs/imagen)**
   - Accessed: 2026-03-10
   - Type: Official Documentation
   - Reliability: 5/5
   - Used for: Imagen vs Nano Banana distinction, Imagen model IDs

7. **[Upscale images using Imagen](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/upscale-image)**
   - Accessed: 2026-03-10
   - Type: Official Documentation
   - Reliability: 5/5
   - Used for: Upscaling API, parameters, constraints

8. **[Firebase AI Logic: Generate images with Gemini](https://firebase.google.com/docs/ai-logic/generate-images-gemini)**
   - Accessed: 2026-03-10
   - Type: Official Documentation
   - Reliability: 5/5
   - Used for: Multi-platform code examples (Swift, Kotlin, Java, JS, Dart, Unity)

9. **[Batch API](https://ai.google.dev/gemini-api/docs/batch-api)**
   - Accessed: 2026-03-10
   - Type: Official Documentation
   - Reliability: 5/5
   - Used for: Batch processing details, async operations

### Google Blog Posts and Announcements

10. **[Gemini Image -- Nano Banana (Google DeepMind)](https://deepmind.google/models/gemini-image/)**
    - Accessed: 2026-03-10
    - Type: Official Product Page
    - Reliability: 5/5
    - Used for: Model overview, capabilities summary

11. **[Gemini 3 Pro Image -- Nano Banana Pro (Google DeepMind)](https://deepmind.google/models/gemini-image/pro/)**
    - Accessed: 2026-03-10
    - Type: Official Product Page
    - Reliability: 5/5
    - Used for: Pro model specs, 4K support, text rendering benchmarks

12. **[Nano Banana 2: Google's latest AI image generation model](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/)**
    - Accessed: 2026-03-10
    - Type: Official Blog
    - Reliability: 5/5
    - Used for: Nano Banana 2 release details

13. **[Build with Nano Banana 2](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-nano-banana-2/)**
    - Accessed: 2026-03-10
    - Type: Official Blog
    - Reliability: 5/5
    - Used for: Developer guidance, feature details

14. **[Nano Banana Pro blog post](https://blog.google/innovation-and-ai/products/nano-banana-pro/)**
    - Accessed: 2026-03-10
    - Type: Official Blog
    - Reliability: 5/5
    - Used for: Pro model announcement, capabilities

15. **[How to prompt Gemini 2.5 Flash Image Generation](https://developers.googleblog.com/en/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/)**
    - Accessed: 2026-03-10
    - Type: Official Developer Blog
    - Reliability: 5/5
    - Used for: Prompt engineering best practices, templates

### SDK and GitHub Sources

16. **[Google Gen AI Python SDK](https://github.com/googleapis/python-genai)**
    - Accessed: 2026-03-10
    - Type: Official SDK Repository
    - Reliability: 5/5
    - Used for: Python SDK patterns

17. **[Google Gen AI JS SDK (@google/genai)](https://github.com/googleapis/js-genai)**
    - Accessed: 2026-03-10
    - Type: Official SDK Repository
    - Reliability: 5/5
    - Used for: Node.js/TypeScript SDK patterns

18. **[nanobanana-mcp-server (zhongweili)](https://github.com/zhongweili/nanobanana-mcp-server)**
    - Accessed: 2026-03-10
    - Type: Community/Open Source
    - Reliability: 4/5
    - Used for: MCP server implementation patterns, tool definitions

19. **[Nano-Banana-MCP (ConechoAI)](https://github.com/ConechoAI/Nano-Banana-MCP)**
    - Accessed: 2026-03-10
    - Type: Community/Open Source
    - Reliability: 4/5
    - Used for: Node.js MCP server implementation, tool design

### News and Third-Party Sources

20. **[Google launches Nano Banana 2 (TechCrunch)](https://techcrunch.com/2026/02/26/google-launches-nano-banana-2-model-with-faster-image-generation/)**
    - Accessed: 2026-03-10
    - Type: Tech News
    - Reliability: 4/5
    - Used for: Release date confirmation, feature summary

21. **[Google releases Nano Banana Pro (TechCrunch)](https://techcrunch.com/2025/11/20/google-releases-nano-banana-pro-its-latest-image-generation-model/)**
    - Accessed: 2026-03-10
    - Type: Tech News
    - Reliability: 4/5
    - Used for: Pro release date confirmation

22. **[Midjourney vs DALL-E vs Gemini comparison](https://freeacademy.ai/blog/midjourney-vs-dalle-vs-gemini-imagen-comparison-2026)**
    - Accessed: 2026-03-10
    - Type: Tech Blog
    - Reliability: 3/5
    - Used for: Competitive comparison data

23. **[Best AI Image Generators 2026 (Zapier)](https://zapier.com/blog/best-ai-image-generator/)**
    - Accessed: 2026-03-10
    - Type: Tech Blog
    - Reliability: 3/5
    - Used for: Competitive landscape context

---

## Version History

- v1.0 (2026-03-10): Initial comprehensive research covering all 8 requested areas plus Imagen relationship and prompt engineering
