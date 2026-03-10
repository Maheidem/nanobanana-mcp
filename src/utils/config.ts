import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const CONFIG_DIR = path.join(os.homedir(), ".config", "nanobanana-mcp");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export interface Config {
  preferredModel: string | null;
  enhancePrompt: boolean;
  enhancerModel: string | null;
}

const DEFAULT_CONFIG: Config = {
  preferredModel: null,
  enhancePrompt: false,
  enhancerModel: null,
};

/**
 * Read persisted config from ~/.config/nanobanana-mcp/config.json.
 * Returns defaults if file doesn't exist.
 */
export function loadConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // Corrupted config — return defaults
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Persist config to ~/.config/nanobanana-mcp/config.json.
 */
export function saveConfig(config: Config): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
}

/**
 * Check if this is the first run (no config file exists).
 */
export function isFirstRun(): boolean {
  return !fs.existsSync(CONFIG_FILE);
}
