import claudeData from "./claude.json";
import codexData from "./codex.json";
import chromeData from "./chrome.json";
import ghosttyData from "./ghostty.json";
import macosData from "./macos.json";
import vscodeData from "./vscode.json";
import zshData from "./zsh.json";
import type { AppId, ShortcutEntry } from "../../shared/types";

export const appOrder: Exclude<AppId, "all">[] = ["macos", "chrome", "zsh", "ghostty", "vscode", "claude", "codex"];

export const appLabels: Record<AppId, string> = {
  all: "All apps",
  macos: "macOS",
  chrome: "Chrome",
  zsh: "zsh",
  ghostty: "Ghostty",
  vscode: "VS Code",
  claude: "Claude Code",
  codex: "Codex CLI"
};

export const shortcuts: ShortcutEntry[] = [
  ...(macosData as ShortcutEntry[]),
  ...(chromeData as ShortcutEntry[]),
  ...(zshData as ShortcutEntry[]),
  ...(ghosttyData as ShortcutEntry[]),
  ...(vscodeData as ShortcutEntry[]),
  ...(claudeData as ShortcutEntry[]),
  ...(codexData as ShortcutEntry[])
];
