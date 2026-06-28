import claudeData from "./claude.json";
import codexData from "./codex.json";
import arcData from "./arc.json";
import chromeData from "./chrome.json";
import edgeData from "./edge.json";
import excelData from "./excel.json";
import firefoxData from "./firefox.json";
import googleDocsData from "./google-docs.json";
import googleSheetsData from "./google-sheets.json";
import googleSlidesData from "./google-slides.json";
import ghosttyData from "./ghostty.json";
import keynoteData from "./keynote.json";
import macosData from "./macos.json";
import numbersData from "./numbers.json";
import operaData from "./opera.json";
import orionData from "./orion.json";
import pagesData from "./pages.json";
import powerpointData from "./powerpoint.json";
import safariData from "./safari.json";
import vscodeData from "./vscode.json";
import wordData from "./word.json";
import zshData from "./zsh.json";
import zenData from "./zen.json";
import { shortcutAppIds, type AppId, type ShortcutAppId, type ShortcutEntry } from "../../shared/types";

export const appOrder: ShortcutAppId[] = [...shortcutAppIds];

export const appLabels: Record<AppId, string> = {
  all: "All apps",
  macos: "macOS",
  chrome: "Chrome",
  arc: "Arc",
  firefox: "Firefox",
  safari: "Safari",
  edge: "Microsoft Edge",
  opera: "Opera",
  orion: "Orion",
  zen: "Zen Browser",
  zsh: "zsh",
  ghostty: "Ghostty",
  vscode: "VS Code",
  claude: "Claude Code",
  codex: "Codex CLI",
  excel: "Excel",
  word: "Word",
  powerpoint: "PowerPoint",
  "google-docs": "Google Docs",
  "google-sheets": "Google Sheets",
  "google-slides": "Google Slides",
  numbers: "Numbers",
  pages: "Pages",
  keynote: "Keynote"
};

export const shortcuts: ShortcutEntry[] = [
  ...(macosData as ShortcutEntry[]),
  ...(chromeData as ShortcutEntry[]),
  ...(arcData as ShortcutEntry[]),
  ...(firefoxData as ShortcutEntry[]),
  ...(safariData as ShortcutEntry[]),
  ...(edgeData as ShortcutEntry[]),
  ...(operaData as ShortcutEntry[]),
  ...(orionData as ShortcutEntry[]),
  ...(zenData as ShortcutEntry[]),
  ...(zshData as ShortcutEntry[]),
  ...(ghosttyData as ShortcutEntry[]),
  ...(vscodeData as ShortcutEntry[]),
  ...(claudeData as ShortcutEntry[]),
  ...(codexData as ShortcutEntry[]),
  ...(excelData as ShortcutEntry[]),
  ...(wordData as ShortcutEntry[]),
  ...(powerpointData as ShortcutEntry[]),
  ...(googleDocsData as ShortcutEntry[]),
  ...(googleSheetsData as ShortcutEntry[]),
  ...(googleSlidesData as ShortcutEntry[]),
  ...(numbersData as ShortcutEntry[]),
  ...(pagesData as ShortcutEntry[]),
  ...(keynoteData as ShortcutEntry[])
];
