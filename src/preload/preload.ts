import { contextBridge, ipcRenderer } from "electron";
import type { ShortcutIndexApi, UserSettings, ViewRequest } from "../shared/types";

const api: ShortcutIndexApi = {
  getSettings: () => ipcRenderer.invoke("settings:get"),
  updateSettings: (settings: Partial<UserSettings>) => ipcRenderer.invoke("settings:update", settings),
  copyText: (text: string) => ipcRenderer.invoke("clipboard:write", text),
  hideWindow: () => ipcRenderer.invoke("window:hide"),
  onShowView: (callback: (view: ViewRequest) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, view: ViewRequest) => callback(view);
    ipcRenderer.on("view:show", listener);
    return () => ipcRenderer.removeListener("view:show", listener);
  }
};

contextBridge.exposeInMainWorld("shortcutIndex", api);
