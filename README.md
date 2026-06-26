# Shortcut Index

If you struggle to remember keyboard shortcuts, try this offline Electron menu-bar app for quickly searching shortcuts across macOS, zsh, Ghostty, VS Code, and Codex CLI.

## Credit

Codex created this app.

![Anime-style Codex mascot for Shortcut Index](docs/images/codex-credit.png)

## Usage

Use the sidebar to filter by app, then search by action, key, app name, or tag. Each shortcut card shows the action, keybinding, tags, a source link, and copy controls.

![Shortcut search filtered to Codex CLI keyboard shortcuts](docs/images/shortcut-search.png)

Open Settings to change the global hotkey, launch-at-login behavior, and theme preference.

![Shortcut Index settings screen](docs/images/settings.png)

## Run

This project defaults to Node.js 22.18.0 and npm 10.9.3. If you use `nvm`, run:

```bash
nvm use
npm ci
npm run dev
```

The minimum supported toolchain is declared in `package.json` under `engines`.

## Run in the Background on macOS

For source installs, the repo includes a LaunchAgent helper that can start the Electron dev app in the background when you log in to macOS.

```bash
nvm use
npm ci
npm run background
```

Check whether the LaunchAgent is loaded:

```bash
npm run background:status
```

Stop the background app and unload the LaunchAgent:

```bash
npm run background:stop
```

By default, the helper expects the repo at `~/Developer/shortcut-index` and writes logs to `${TMPDIR}/shortcut-index-dev.log`. Set `SHORTCUT_INDEX_HOME` to use a different repo path, or `SHORTCUT_INDEX_LOG` to use a different log file.

The app also has a Settings toggle named "Launch at login". Use that toggle from the running app when you want Electron to manage the macOS login item for the current app binary.

## Verify

```bash
npm run lint
npm run typecheck
npm run build
npm run package
```

## Data Sources

- macOS keyboard shortcuts: https://support.apple.com/en-us/102650
- VS Code keybindings: https://code.visualstudio.com/docs/configure/keybindings
- Ghostty keybindings: https://ghostty.org/docs/config/keybind/reference
- zsh line editor: https://zsh.sourceforge.io/Doc/Release/Zsh-Line-Editor.html
- Codex CLI features: https://developers.openai.com/codex/cli/features

The app intentionally ships with curated local JSON data. It does not scrape application menus or require Accessibility permissions in v1.
