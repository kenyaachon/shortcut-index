# Shortcut Index

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

If you struggle to remember keyboard shortcuts, try this offline Electron menu-bar app for quickly searching shortcuts across macOS, major browsers, zsh, Ghostty, VS Code, Claude Code, Codex CLI, Microsoft Office, Google Docs editors, and Apple iWork apps.

## Credit

Codex created this app.

![Anime-style Codex mascot for Shortcut Index](docs/images/codex-credit.png)

## Usage

Use the sidebar to filter by app, then search by action, key, app name, or tag. Each shortcut card shows the action, keybinding, tags, a source link, and copy controls.

![Shortcut search filtered to Codex CLI keyboard shortcuts](docs/images/shortcut-search.png)

Open Settings to change the global hotkey, launch-at-login behavior, app visibility, and theme preference.

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

## License

Shortcut Index is released under the [MIT License](LICENSE).

## Data Sources

- macOS keyboard shortcuts: https://support.apple.com/en-us/102650
- Chrome keyboard shortcuts: https://support.google.com/chrome/answer/157179
- Arc common browser shortcuts: https://support.google.com/chrome/answer/157179
- Firefox keyboard shortcuts: https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly
- Safari keyboard shortcuts: https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac
- Microsoft Edge keyboard shortcuts: https://support.microsoft.com/en-US/edge/keyboard-shortcuts-in-microsoft-edge
- Opera keyboard shortcuts: https://help.opera.com/en/latest/shortcuts/
- Orion common browser shortcuts: https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac
- Zen Browser common browser shortcuts: https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly
- VS Code keybindings: https://code.visualstudio.com/docs/configure/keybindings
- Ghostty keybindings: https://ghostty.org/docs/config/keybind/reference
- zsh line editor: https://zsh.sourceforge.io/Doc/Release/Zsh-Line-Editor.html
- Claude Code interactive mode: https://code.claude.com/docs/en/interactive-mode
- Codex CLI features: https://developers.openai.com/codex/cli/features
- Excel keyboard shortcuts: https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-excel-1798d9d5-842a-42b8-9c99-9b7213f0040f
- Word keyboard shortcuts: https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2
- PowerPoint keyboard shortcuts: https://support.microsoft.com/en-us/office/use-keyboard-shortcuts-to-create-powerpoint-presentations-ebb3d20e-dcd4-444f-a38e-bb5c5ed180f4
- Google Docs keyboard shortcuts: https://support.google.com/docs/answer/179738
- Google Sheets keyboard shortcuts: https://support.google.com/docs/answer/181110
- Google Slides keyboard shortcuts: https://support.google.com/docs/answer/1696717
- Numbers keyboard shortcuts: https://support.apple.com/guide/numbers/keyboard-shortcuts-tana45192591/mac
- Pages keyboard shortcuts: https://support.apple.com/guide/pages/keyboard-shortcuts-tanc0ffef022/mac
- Keynote keyboard shortcuts: https://support.apple.com/guide/keynote/keyboard-shortcuts-tanfde4a3e6d/mac

The app intentionally ships with curated local JSON data. It does not scrape application menus or require Accessibility permissions in v1.
