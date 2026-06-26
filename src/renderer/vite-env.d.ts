/// <reference types="vite/client" />

import type { ShortcutIndexApi } from "../shared/types";

declare global {
  interface Window {
    shortcutIndex?: ShortcutIndexApi;
  }
}
