# Shortcut Index Future Ideas PRD

## Summary

Shortcut Index is already useful as an offline, searchable shortcut reference. The next product direction should make it more personal, faster to operate from the keyboard, and easier to trust as shortcut data changes over time.

## Goals

- Help users find high-value shortcuts faster with less search noise.
- Let users personalize the index around the apps and shortcuts they actually use.
- Keep shortcut data trustworthy by making source quality and verification status visible.
- Preserve the app's offline-first, low-permission model.

## Prioritized Feature Ideas

### 1. Favorites and Recent Shortcuts

Let users star shortcuts and see recently copied shortcuts.

- Add a `Favorites` sidebar filter.
- Add a compact `Recent` section based on copied shortcuts.
- Store favorites and recent history locally.
- Acceptance: a user can star a shortcut, restart the app, and still see it under Favorites.

### 2. Keyboard-First Navigation

Make the app usable without touching the mouse.

- Use arrow keys to move through result cards.
- Use `Enter` to copy the selected shortcut.
- Use number shortcuts to switch app filters.
- Keep focus behavior predictable after opening the global hotkey window.
- Acceptance: a user can open the app, search, select, copy, and close it using only the keyboard.

### 3. Better Key Search Ranking

Make literal key searches more precise.

- Strongly boost exact key matches like `ctrl o`.
- Reduce noisy fuzzy matches for short terms.
- Prefer key matches over tag-only matches when the query looks like a keybinding.
- Acceptance: searching `ctrl o` ranks `Ctrl+O` first, and unrelated `Ctrl+...` shortcuts are lower or absent.

### 4. Custom Shortcuts and Aliases

Let users add personal shortcuts and alternate search terms.

- Add custom shortcut entries from the settings UI.
- Add optional aliases such as `copy response` for Codex `Ctrl+O`.
- Store user data separately from bundled JSON data.
- Acceptance: a user-added shortcut appears in search and survives app restart.

### 5. App Visibility Controls

Let users hide apps they do not care about.

- Add per-app show/hide toggles in Settings.
- Keep hidden apps out of the sidebar and default search results.
- Acceptance: hiding an app removes it from the sidebar without deleting its data.

### 6. Source Confidence and Verification Dates

Make shortcut trustworthiness visible.

- Label entries as official, user-added, inferred, or unverified.
- Add optional `lastVerified` metadata.
- Show source and verification details without cluttering cards.
- Acceptance: a user can tell whether a shortcut came from official docs or a local custom entry.

### 7. Import and Export

Support backup and sharing of custom data.

- Export custom shortcuts, aliases, favorites, and settings to JSON.
- Import the same JSON back into a clean install.
- Acceptance: exported user data can be imported and produces the same custom shortcuts and preferences.

## Lower-Priority Polish

- Add multiple copy formats: keys only, action plus keys, or Markdown row.
- Add a compact overlay mode for very fast lookup.
- Add first-run onboarding that explains the global hotkey, search, copy, and settings.
- Add tray-menu access to favorite or recent shortcuts.

## Non-Goals

- Do not scrape app menus in the background.
- Do not require Accessibility permissions for v1 personalization.
- Do not sync user data through a hosted service.
- Do not expand into a full keyboard remapping tool.

## Open Questions

- Should custom user data be stored in Electron settings, a local JSON file, or both?
- Should favorites and recent history be global, per app, or both?
- Should key-search ranking changes be implemented before custom aliases?
- Should hidden apps still appear when a query exactly matches one of their shortcuts?
