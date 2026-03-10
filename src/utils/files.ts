import * as fs from "node:fs";
import * as path from "node:path";
import { MAX_FILE_SIZE_BYTES, EXT_TO_MIME } from "../constants.js";

/**
 * Read an image file and return its base64 data and MIME type.
 * Validates file exists, size <= 7MB, and has a supported image extension.
 */
export function readImageAsBase64(filePath: string): { base64: string; mimeType: string } {
  const resolved = path.resolve(filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Image file not found: ${resolved}`);
  }

  const stat = fs.statSync(resolved);
  if (stat.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
    throw new Error(`Image file too large: ${sizeMB}MB (max 7MB). Path: ${resolved}`);
  }

  const ext = path.extname(resolved).toLowerCase();
  const mimeType = EXT_TO_MIME[ext];
  if (!mimeType) {
    throw new Error(`Unsupported image format: ${ext}. Supported: .png, .jpg, .jpeg, .webp, .heic, .heif`);
  }

  const buffer = fs.readFileSync(resolved);
  return { base64: buffer.toString("base64"), mimeType };
}

/**
 * Save base64 image data to a file with a timestamped name.
 * Returns the absolute path of the saved file.
 */
export function saveImage(base64Data: string, outputDir: string, mimeType: string): string {
  const dir = path.resolve(outputDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const ext = mimeType === "image/jpeg" ? ".jpg" : ".png";
  const timestamp = formatTimestamp(new Date());
  const random = Math.random().toString(36).substring(2, 6);
  const filename = `nb-${timestamp}-${random}${ext}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(filePath, buffer);

  return filePath;
}

/**
 * Resolve the output directory from: param > env var > cwd.
 */
export function resolveOutputDir(paramDir?: string): string {
  if (paramDir) return path.resolve(paramDir);
  if (process.env.NB_OUTPUT_DIR) return path.resolve(process.env.NB_OUTPUT_DIR);
  return process.cwd();
}

/** Format date as YYYYMMDD-HHmmss */
function formatTimestamp(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}${mo}${d}-${h}${mi}${s}`;
}
