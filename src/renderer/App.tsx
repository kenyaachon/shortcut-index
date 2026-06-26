import { useEffect, useMemo, useRef, useState } from "react";
import {
  Apple,
  Check,
  Chrome,
  Code2,
  Copy,
  ExternalLink,
  Keyboard,
  Laptop,
  Monitor,
  Moon,
  Search,
  Settings,
  SquareTerminal,
  Sun,
  Terminal,
  X
} from "lucide-react";
import { appLabels, appOrder, shortcuts } from "./data";
import { Keycaps } from "./components/Keycaps";
import { scoreShortcut } from "./utils/search";
import type { AppId, SettingsPayload, ShortcutEntry, ShortcutIndexApi, ThemePreference } from "../shared/types";

type ViewMode = "shortcuts" | "settings";

const defaultPayload: SettingsPayload = {
  settings: {
    hotkey: "CommandOrControl+Option+K",
    launchAtLogin: false,
    theme: "system"
  },
  hotkeyStatus: {
    registered: false,
    message: "Renderer preview mode."
  }
};

let previewPayload = defaultPayload;

const previewApi: ShortcutIndexApi = {
  getSettings: async () => previewPayload,
  updateSettings: async (settings) => {
    previewPayload = {
      settings: {
        ...previewPayload.settings,
        ...settings
      },
      hotkeyStatus: {
        registered: false,
        message: "Global shortcuts register in the Electron app."
      }
    };
    return previewPayload;
  },
  copyText: async (text) => {
    await navigator.clipboard?.writeText(text);
  },
  hideWindow: async () => undefined,
  onShowView: () => () => undefined
};

function shortcutApi(): ShortcutIndexApi {
  return window.shortcutIndex ?? previewApi;
}

function AppIcon({ app }: { app: AppId }) {
  const props = { size: 18, strokeWidth: 2 };

  switch (app) {
    case "macos":
      return <Apple {...props} />;
    case "chrome":
      return <Chrome {...props} />;
    case "zsh":
      return <Terminal {...props} />;
    case "ghostty":
      return <Keyboard {...props} />;
    case "vscode":
      return <Code2 {...props} />;
    case "codex":
      return <SquareTerminal {...props} />;
    default:
      return <Monitor {...props} />;
  }
}

function groupByCategory(entries: ShortcutEntry[], activeApp: AppId): Array<[string, ShortcutEntry[]]> {
  const groups = new Map<string, ShortcutEntry[]>();

  for (const entry of entries) {
    const groupName = activeApp === "all" ? `${appLabels[entry.app]} / ${entry.category}` : entry.category;
    const existing = groups.get(groupName) ?? [];
    existing.push(entry);
    groups.set(groupName, existing);
  }

  return Array.from(groups.entries());
}

function copyLabel(entry: ShortcutEntry): string {
  return `${appLabels[entry.app]}: ${entry.action} - ${entry.keys.join(" / ")}`;
}

function Sidebar({
  activeApp,
  onAppChange,
  view,
  onViewChange,
  counts
}: {
  activeApp: AppId;
  onAppChange: (app: AppId) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  counts: Record<AppId, number>;
}) {
  const appButtons: AppId[] = ["all", ...appOrder];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Keyboard size={19} />
        </div>
        <div>
          <h1>Shortcut Index</h1>
          <p>{shortcuts.length} entries</p>
        </div>
      </div>

      <nav className="app-filter" aria-label="App filters">
        {appButtons.map((app) => (
          <button
            className={activeApp === app && view === "shortcuts" ? "app-button active" : "app-button"}
            key={app}
            onClick={() => {
              onViewChange("shortcuts");
              onAppChange(app);
            }}
            type="button"
          >
            <span className="app-button-main">
              <AppIcon app={app} />
              <span>{appLabels[app]}</span>
            </span>
            <span className="count">{counts[app]}</span>
          </button>
        ))}
      </nav>

      <button
        className={view === "settings" ? "settings-nav active" : "settings-nav"}
        onClick={() => onViewChange("settings")}
        type="button"
      >
        <Settings size={18} />
        <span>Settings</span>
      </button>
    </aside>
  );
}

function ResultRow({
  entry,
  copiedId,
  onCopy
}: {
  entry: ShortcutEntry;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const shortcutId = `${entry.app}-${entry.category}-${entry.action}-shortcut`;
  const actionId = `${entry.app}-${entry.category}-${entry.action}-action`;

  return (
    <article className={`result-row app-accent-${entry.app}`}>
      <div className="result-main">
        <div className="result-title-line">
          <span className="app-chip">
            <AppIcon app={entry.app} />
            {appLabels[entry.app]}
          </span>
          <h3>{entry.action}</h3>
        </div>
        <p>{entry.description}</p>
        <div className="tag-row">
          {entry.tags.slice(0, 5).map((tag) => (
            <span className="tag" key={`${entry.action}-${tag}`}>
              {tag}
            </span>
          ))}
          {entry.sourceUrl ? (
            <a className="source-link" href={entry.sourceUrl} rel="noreferrer" target="_blank" title="Open source">
              <ExternalLink size={14} />
            </a>
          ) : null}
        </div>
      </div>

      <div className="result-side">
        <Keycaps combos={entry.keys} />
        <div className="row-actions">
          <button
            className="icon-button"
            onClick={() => onCopy(entry.keys.join(" / "), shortcutId)}
            title="Copy shortcut"
            type="button"
          >
            {copiedId === shortcutId ? <Check size={17} /> : <Keyboard size={17} />}
          </button>
          <button
            className="icon-button"
            onClick={() => onCopy(copyLabel(entry), actionId)}
            title="Copy action"
            type="button"
          >
            {copiedId === actionId ? <Check size={17} /> : <Copy size={17} />}
          </button>
        </div>
      </div>
    </article>
  );
}

function SettingsPanel({
  payload,
  onUpdate
}: {
  payload: SettingsPayload;
  onUpdate: (settings: Partial<SettingsPayload["settings"]>) => Promise<void>;
}) {
  const [hotkeyDraft, setHotkeyDraft] = useState(payload.settings.hotkey);

  useEffect(() => {
    setHotkeyDraft(payload.settings.hotkey);
  }, [payload.settings.hotkey]);

  const themeOptions: Array<{ value: ThemePreference; label: string; icon: JSX.Element }> = [
    { value: "system", label: "System", icon: <Laptop size={16} /> },
    { value: "light", label: "Light", icon: <Sun size={16} /> },
    { value: "dark", label: "Dark", icon: <Moon size={16} /> }
  ];

  return (
    <section className="settings-screen">
      <div className="screen-heading">
        <div>
          <p className="eyebrow">Preferences</p>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="settings-section">
        <div className="setting-copy">
          <h3>Global hotkey</h3>
          <p>{payload.hotkeyStatus.message}</p>
        </div>
        <div className="hotkey-control">
          <input
            aria-label="Global hotkey"
            onChange={(event) => setHotkeyDraft(event.target.value)}
            spellCheck={false}
            value={hotkeyDraft}
          />
          <button
            className="primary-button"
            disabled={hotkeyDraft.trim() === payload.settings.hotkey}
            onClick={() => onUpdate({ hotkey: hotkeyDraft.trim() })}
            type="button"
          >
            Save
          </button>
        </div>
      </div>

      <div className="settings-section">
        <div className="setting-copy">
          <h3>Launch at login</h3>
          <p>Start Shortcut Index when macOS signs in.</p>
        </div>
        <label className="switch">
          <input
            checked={payload.settings.launchAtLogin}
            onChange={(event) => onUpdate({ launchAtLogin: event.target.checked })}
            type="checkbox"
          />
          <span />
        </label>
      </div>

      <div className="settings-section">
        <div className="setting-copy">
          <h3>Theme</h3>
          <p>Choose the renderer color scheme.</p>
        </div>
        <div className="segmented" role="group">
          {themeOptions.map((option) => (
            <button
              aria-pressed={payload.settings.theme === option.value}
              className={payload.settings.theme === option.value ? "segment active" : "segment"}
              key={option.value}
              onClick={() => onUpdate({ theme: option.value })}
              type="button"
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function App() {
  const [query, setQuery] = useState("");
  const [activeApp, setActiveApp] = useState<AppId>("all");
  const [view, setView] = useState<ViewMode>("shortcuts");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [payload, setPayload] = useState<SettingsPayload>(defaultPayload);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void shortcutApi()
      .getSettings()
      .then((nextPayload) => setPayload(nextPayload));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = payload.settings.theme;
  }, [payload.settings.theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        void shortcutApi().hideWindow();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setView("shortcuts");
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return shortcutApi().onShowView((nextView) => {
      setView(nextView);
      if (nextView === "shortcuts") {
        window.setTimeout(() => searchRef.current?.focus(), 0);
      }
    });
  }, []);

  const counts = useMemo(() => {
    const next: Record<AppId, number> = {
      all: shortcuts.length,
      macos: 0,
      chrome: 0,
      zsh: 0,
      ghostty: 0,
      vscode: 0,
      codex: 0
    };

    for (const entry of shortcuts) {
      next[entry.app] += 1;
    }

    return next;
  }, []);

  const results = useMemo(() => {
    return shortcuts
      .filter((entry) => activeApp === "all" || entry.app === activeApp)
      .map((entry) => ({
        entry,
        score: scoreShortcut(entry, query)
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }

        const appDelta = appOrder.indexOf(a.entry.app) - appOrder.indexOf(b.entry.app);
        if (appDelta !== 0) {
          return appDelta;
        }

        return `${a.entry.category} ${a.entry.action}`.localeCompare(`${b.entry.category} ${b.entry.action}`);
      })
      .map((item) => item.entry);
  }, [activeApp, query]);

  const groupedResults = useMemo(() => groupByCategory(results, activeApp), [activeApp, results]);

  const handleCopy = async (text: string, id: string) => {
    await shortcutApi().copyText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1200);
  };

  const handleSettingsUpdate = async (settings: Partial<SettingsPayload["settings"]>) => {
    const nextPayload = await shortcutApi().updateSettings(settings);
    setPayload(nextPayload);
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeApp={activeApp}
        counts={counts}
        onAppChange={setActiveApp}
        onViewChange={setView}
        view={view}
      />

      <main className="content">
        <div className="window-actions">
          <button className="window-close" onClick={() => shortcutApi().hideWindow()} title="Close" type="button">
            <X size={17} />
          </button>
        </div>

        {view === "shortcuts" ? (
          <>
            <section className="search-header">
              <div>
                <p className="eyebrow">{appLabels[activeApp]}</p>
                <h2>{query ? `${results.length} matches` : "Shortcut Search"}</h2>
              </div>
              <label className="search-box">
                <Search size={18} />
                <input
                  autoFocus
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search action, key, app, or tag"
                  ref={searchRef}
                  value={query}
                />
              </label>
            </section>

            <section className="results" aria-live="polite">
              {groupedResults.length > 0 ? (
                groupedResults.map(([group, entries]) => (
                  <div className="result-group" key={group}>
                    <div className="group-heading">
                      <h3>{group}</h3>
                      <span>{entries.length}</span>
                    </div>
                    <div className="result-list">
                      {entries.map((entry) => (
                        <ResultRow
                          copiedId={copiedId}
                          entry={entry}
                          key={`${entry.app}-${entry.category}-${entry.action}-${entry.keys.join("-")}`}
                          onCopy={handleCopy}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Search size={28} />
                  <h3>No matches</h3>
                </div>
              )}
            </section>
          </>
        ) : (
          <SettingsPanel onUpdate={handleSettingsUpdate} payload={payload} />
        )}
      </main>
    </div>
  );
}
