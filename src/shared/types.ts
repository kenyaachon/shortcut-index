export type AppId = "all" | "macos" | "chrome" | "zsh" | "ghostty" | "vscode" | "claude" | "codex";

export type ThemePreference = "system" | "light" | "dark";

export interface ShortcutEntry {
  app: Exclude<AppId, "all">;
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
