export const shortcutAppIds = [
  "macos",
  "chrome",
  "arc",
  "firefox",
  "safari",
  "edge",
  "opera",
  "orion",
  "zen",
  "zsh",
  "ghostty",
  "vscode",
  "claude",
  "codex",
  "excel",
  "word",
  "powerpoint",
  "google-docs",
  "google-sheets",
  "google-slides",
  "numbers",
  "pages",
  "keynote"
] as const;

export type ShortcutAppId = (typeof shortcutAppIds)[number];

export type AppId = "all" | ShortcutAppId;

export type ThemePreference = "system" | "light" | "dark";

export interface ShortcutEntry {
  app: ShortcutAppId;
  category: string;
  action: string;
  keys: string[];
  description: string;
  tags: string[];
  sourceUrl?: string;
}

export interface UserSettings {
  hotkey: string;
  launchAtLogin: boolean;
  theme: ThemePreference;
  enabledApps: ShortcutAppId[];
}

export interface HotkeyStatus {
  registered: boolean;
  message: string;
}

export interface SettingsPayload {
  settings: UserSettings;
  hotkeyStatus: HotkeyStatus;
}

export type ViewRequest = "shortcuts" | "settings";

export interface ShortcutIndexApi {
  getSettings: () => Promise<SettingsPayload>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<SettingsPayload>;
  copyText: (text: string) => Promise<void>;
  hideWindow: () => Promise<void>;
  onShowView: (callback: (view: ViewRequest) => void) => () => void;
}
