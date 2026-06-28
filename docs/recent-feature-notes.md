# Recent Feature Notes

## Summary

Shortcut Index now supports user-selectable app visibility and a larger bundled shortcut catalog. Users can choose which apps appear in the sidebar and search results from Settings, and the app list in Settings scrolls independently so the full settings view stays usable as the catalog grows.

## App Visibility Controls

- Settings includes an Apps section with one toggle per bundled app.
- Enabled apps appear in the sidebar and in default search results.
- Disabled apps stay in bundled data but are hidden from the sidebar and search results.
- The app prevents turning off the final enabled app so search always has at least one source.
- Visibility is stored in `UserSettings.enabledApps` and normalized against `shortcutAppIds`.
- If the currently selected app is disabled, the renderer switches back to `All apps`.

## Scrollable App List

- The Apps section uses an internal scroll area for `.app-toggle-list`.
- The overall Settings panel no longer needs to scroll just to browse app toggles on the normal desktop layout.
- Narrow layouts still allow the full settings panel to scroll as a fallback.
- The sidebar app filter also scrolls independently so Settings remains reachable when many apps are enabled.

## Bundled Office Apps

Nine Office apps were added to the bundled catalog:

- Excel: `excel`
- Word: `word`
- PowerPoint: `powerpoint`
- Google Docs: `google-docs`
- Google Sheets: `google-sheets`
- Google Slides: `google-slides`
- Numbers: `numbers`
- Pages: `pages`
- Keynote: `keynote`

Each app has a curated starter set of 25 Mac-oriented shortcuts. The shortcut data follows the existing `ShortcutEntry` shape: `app`, `category`, `action`, `keys`, `description`, `tags`, and `sourceUrl`.

## Bundled Browser Apps

Seven additional browser apps were added to the bundled catalog:

- Arc: `arc`
- Firefox: `firefox`
- Safari: `safari`
- Microsoft Edge: `edge`
- Opera: `opera`
- Orion: `orion`
- Zen Browser: `zen`

Each browser has a curated starter set of 25 Mac-oriented shortcuts. Brave remains in the broader app catalog but is not actively supported in this batch.

## Implementation Notes

- `src/shared/types.ts` owns the bundled app ID list through `shortcutAppIds`.
- `src/renderer/data/index.ts` imports each app JSON file, defines labels, and appends the entries to `shortcuts`.
- `src/renderer/App.tsx` derives enabled shortcuts from `payload.settings.enabledApps`.
- `src/renderer/components/Keycaps.tsx` includes extra key labels used by the expanded catalog.
- `src/renderer/styles.css` contains the scroll behavior and app accent colors.

## Official Sources

- Arc common browser shortcuts: https://support.google.com/chrome/answer/157179
- Firefox: https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly
- Safari: https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac
- Microsoft Edge: https://support.microsoft.com/en-US/edge/keyboard-shortcuts-in-microsoft-edge
- Opera: https://help.opera.com/en/latest/shortcuts/
- Orion common browser shortcuts: https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac
- Zen Browser common browser shortcuts: https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly
- Excel: https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-excel-1798d9d5-842a-42b8-9c99-9b7213f0040f
- Word: https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2
- PowerPoint: https://support.microsoft.com/en-us/office/use-keyboard-shortcuts-to-create-powerpoint-presentations-ebb3d20e-dcd4-444f-a38e-bb5c5ed180f4
- Google Docs: https://support.google.com/docs/answer/179738
- Google Sheets: https://support.google.com/docs/answer/181110
- Google Slides: https://support.google.com/docs/answer/1696717
- Numbers: https://support.apple.com/guide/numbers/keyboard-shortcuts-tana45192591/mac
- Pages: https://support.apple.com/guide/pages/keyboard-shortcuts-tanc0ffef022/mac
- Keynote: https://support.apple.com/guide/keynote/keyboard-shortcuts-tanfde4a3e6d/mac

## Verification

The feature work was verified with:

```bash
npm run lint
npm run typecheck
npm run build
```

The new JSON data was also checked programmatically to confirm every entry includes the required fields and uses a known app ID.
