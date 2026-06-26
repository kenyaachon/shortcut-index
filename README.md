# Shortcut Index

An offline Electron menu-bar app for quickly searching shortcuts across macOS, zsh, Ghostty, VS Code, and Codex CLI.

## Run

```bash
npm install
npm run dev
```

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
- Codex CLI slash commands: https://developers.openai.com/codex/cli/slash-commands

The app intentionally ships with curated local JSON data. It does not scrape application menus or require Accessibility permissions in v1.
