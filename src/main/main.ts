import fs from "node:fs";
import path from "node:path";
import {
  app,
  BrowserWindow,
  clipboard,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  nativeTheme,
  screen,
  Tray
} from "electron";
import type { MenuItemConstructorOptions } from "electron";
import type { HotkeyStatus, SettingsPayload, ThemePreference, UserSettings, ViewRequest } from "../shared/types";

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);

const defaultSettings: UserSettings = {
  hotkey: "CommandOrControl+Option+K",
  launchAtLogin: false,
  theme: "system"
};

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let settings: UserSettings = defaultSettings;
let hotkeyStatus: HotkeyStatus = {
  registered: false,
  message: "Global shortcut has not been registered yet."
};
let registeredHotkey: string | null = null;

function settingsFilePath(): string {
  return path.join(app.getPath("userData"), "settings.json");
}

function readSettings(): UserSettings {
  try {
    const raw = fs.readFileSync(settingsFilePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return normalizeSettings(parsed);
  } catch {
    return defaultSettings;
  }
}

function normalizeSettings(input: Partial<UserSettings>): UserSettings {
  const theme: ThemePreference =
    input.theme === "light" || input.theme === "dark" || input.theme === "system" ? input.theme : "system";

  return {
    hotkey: typeof input.hotkey === "string" && input.hotkey.trim() ? input.hotkey.trim() : defaultSettings.hotkey,
    launchAtLogin: Boolean(input.launchAtLogin),
    theme
  };
}

function writeSettings(nextSettings: UserSettings): void {
  fs.mkdirSync(path.dirname(settingsFilePath()), { recursive: true });
  fs.writeFileSync(settingsFilePath(), `${JSON.stringify(nextSettings, null, 2)}\n`);
}

function rendererUrl(): string {
  if (process.env.VITE_DEV_SERVER_URL) {
    return process.env.VITE_DEV_SERVER_URL;
  }

  return `file://${path.join(__dirname, "../../dist/index.html")}`;
}

function preloadPath(): string {
  return path.join(__dirname, "../preload/preload.js");
}

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 720,
    minHeight: 520,
    show: false,
    frame: false,
    transparent: false,
    resizable: true,
    movable: true,
    skipTaskbar: true,
    title: "Shortcut Index",
    backgroundColor: "#f7f8fb",
    vibrancy: "under-window",
    visualEffectState: "active",
    webPreferences: {
      preload: preloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  if (isDev) {
    void window.loadURL(rendererUrl());
  } else {
    void window.loadFile(path.join(__dirname, "../../dist/index.html"));
  }

  window.on("blur", () => {
    if (!isDev && window.isVisible()) {
      window.hide();
    }
  });

  window.on("closed", () => {
    mainWindow = null;
  });

  return window;
}

function createTrayIcon() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">',
    '<rect x="5" y="8" width="26" height="20" rx="4" fill="black"/>',
    '<rect x="9" y="12" width="5" height="4" rx="1" fill="white"/>',
    '<rect x="16" y="12" width="5" height="4" rx="1" fill="white"/>',
    '<rect x="23" y="12" width="4" height="4" rx="1" fill="white"/>',
    '<rect x="9" y="18" width="7" height="4" rx="1" fill="white"/>',
    '<rect x="18" y="18" width="9" height="4" rx="1" fill="white"/>',
    "</svg>"
  ].join("");

  const image = nativeImage.createFromDataURL(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  image.setTemplateImage(true);
  return image;
}

function createTray(): Tray {
  const icon = createTrayIcon();
  const nextTray = new Tray(icon);

  if (icon.isEmpty()) {
    nextTray.setTitle("SI");
  }

  nextTray.setToolTip("Shortcut Index");
  nextTray.on("click", showSearchWindow);
  nextTray.on("right-click", () => {
    nextTray.popUpContextMenu(buildStatusMenu());
  });
  return nextTray;
}

function buildStatusMenu(): Menu {
  return Menu.buildFromTemplate([
    {
      label: "Open Shortcut Index",
      click: showSearchWindow
    },
    {
      label: "Settings...",
      click: showSettingsWindow
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      }
    }
  ]);
}

function buildApplicationMenu(): Menu {
  const appMenu: MenuItemConstructorOptions[] = [
    {
      label: "About Shortcut Index",
      click: () => app.showAboutPanel()
    },
    { type: "separator" },
    {
      label: "Settings...",
      accelerator: "CommandOrControl+,",
      click: showSettingsWindow
    },
    {
      label: "Open Shortcut Index",
      accelerator: settings.hotkey,
      click: showSearchWindow
    },
    {
      label: "Launch at Login",
      type: "checkbox",
      checked: settings.launchAtLogin,
      click: () => {
        const next = { ...settings, launchAtLogin: !settings.launchAtLogin };
        applyAndStoreSettings(next);
      }
    },
    { type: "separator" },
    { role: "services" },
    { type: "separator" },
    { role: "hide" },
    { role: "hideOthers" },
    { role: "unhide" },
    { type: "separator" },
    {
      label: "Quit Shortcut Index",
      accelerator: "CommandOrControl+Q",
      click: () => app.quit()
    }
  ];

  return Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: appMenu
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "Show Search",
          accelerator: "CommandOrControl+F",
          click: showSearchWindow
        },
        {
          label: "Show Settings",
          click: showSettingsWindow
        }
      ]
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "zoom" }, { type: "separator" }, { role: "front" }]
    }
  ]);
}

function positionWindow(window: BrowserWindow): void {
  if (!tray) {
    window.center();
    return;
  }

  const trayBounds = tray.getBounds();
  const windowBounds = window.getBounds();
  const nearestDisplay = screen.getDisplayNearestPoint({
    x: trayBounds.x + trayBounds.width / 2,
    y: trayBounds.y + trayBounds.height / 2
  });
  const { workArea } = nearestDisplay;

  const centeredX = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
  const x = Math.max(workArea.x + 12, Math.min(centeredX, workArea.x + workArea.width - windowBounds.width - 12));

  const opensDown = trayBounds.y < workArea.y + workArea.height / 2;
  const y = opensDown
    ? Math.min(trayBounds.y + trayBounds.height + 8, workArea.y + workArea.height - windowBounds.height - 12)
    : Math.max(workArea.y + 12, trayBounds.y - windowBounds.height - 8);

  window.setPosition(x, y, false);
}

function showWindow(): void {
  if (!mainWindow) {
    mainWindow = createWindow();
  }

  positionWindow(mainWindow);
  mainWindow.show();
  mainWindow.focus();
}

function showView(view: ViewRequest): void {
  showWindow();
  if (!mainWindow) {
    return;
  }

  if (mainWindow.webContents.isLoading()) {
    mainWindow.webContents.once("did-finish-load", () => {
      mainWindow?.webContents.send("view:show", view);
    });
    return;
  }

  mainWindow.webContents.send("view:show", view);
}

function showSearchWindow(): void {
  showView("shortcuts");
}

function showSettingsWindow(): void {
  showView("settings");
}

function toggleWindow(): void {
  if (!mainWindow) {
    showWindow();
    return;
  }

  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
}

function applyTheme(theme: ThemePreference): void {
  nativeTheme.themeSource = theme;
}

function applyLaunchAtLogin(openAtLogin: boolean): boolean {
  try {
    app.setLoginItemSettings({
      openAtLogin,
      openAsHidden: true,
      path: process.execPath
    });
  } catch {
    return readLaunchAtLogin(openAtLogin);
  }

  return app.getLoginItemSettings().openAtLogin;
}

function readLaunchAtLogin(fallback: boolean): boolean {
  try {
    return app.getLoginItemSettings().openAtLogin;
  } catch {
    return fallback;
  }
}

function registerConfiguredHotkey(nextHotkey: string): HotkeyStatus {
  if (registeredHotkey) {
    globalShortcut.unregister(registeredHotkey);
    registeredHotkey = null;
  }

  const accelerator = nextHotkey.trim();
  if (!accelerator) {
    return {
      registered: false,
      message: "No global shortcut is configured."
    };
  }

  const registered = globalShortcut.register(accelerator, toggleWindow);
  if (!registered) {
    return {
      registered: false,
      message: `${accelerator} could not be registered. It may already be used by macOS or another app.`
    };
  }

  registeredHotkey = accelerator;
  return {
    registered: true,
    message: `${accelerator} opens Shortcut Index.`
  };
}

function applyAndStoreSettings(nextSettings: UserSettings): SettingsPayload {
  applyTheme(nextSettings.theme);
  const actualLaunchAtLogin = applyLaunchAtLogin(nextSettings.launchAtLogin);
  const normalized = normalizeSettings({ ...nextSettings, launchAtLogin: actualLaunchAtLogin });
  const nextHotkeyStatus = registerConfiguredHotkey(normalized.hotkey);

  settings = normalized;
  hotkeyStatus = nextHotkeyStatus;
  writeSettings(settings);
  Menu.setApplicationMenu(buildApplicationMenu());

  return { settings, hotkeyStatus };
}

app.whenReady().then(() => {
  app.dock?.hide();

  const persistedSettings = readSettings();
  settings = normalizeSettings({
    ...persistedSettings,
    launchAtLogin: readLaunchAtLogin(persistedSettings.launchAtLogin)
  });
  applyTheme(settings.theme);
  Menu.setApplicationMenu(buildApplicationMenu());
  tray = createTray();
  mainWindow = createWindow();
  hotkeyStatus = registerConfiguredHotkey(settings.hotkey);

  ipcMain.handle("settings:get", (): SettingsPayload => ({ settings, hotkeyStatus }));
  ipcMain.handle("settings:update", (_event, partial: Partial<UserSettings>): SettingsPayload => {
    const next = normalizeSettings({ ...settings, ...partial });
    return applyAndStoreSettings(next);
  });
  ipcMain.handle("clipboard:write", (_event, text: string): void => {
    clipboard.writeText(text);
  });
  ipcMain.handle("window:hide", (event): void => {
    const senderWindow = BrowserWindow.fromWebContents(event.sender);
    (senderWindow ?? mainWindow)?.hide();
  });

  app.on("activate", showWindow);
});

app.on("window-all-closed", () => {
  if (!tray) {
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
