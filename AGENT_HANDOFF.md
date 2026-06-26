# Agent Handoff

## Non-obvious context

- Official Codex docs were checked on June 26, 2026. The relevant source pages are:
  - https://developers.openai.com/codex/cli/features
  - https://developers.openai.com/codex/cli/slash-commands
- The slash-command page confirmed the curated slash commands used for workflow, session, and tools behavior.
- The CLI features page confirmed the documented TUI shortcuts for clearing the view, copying latest output, queuing follow-up input, draft navigation, prompt-history search, and exiting.
- I did not find current official-doc confirmation for `Ctrl+G` during the docs pass. Treat that binding as inherited from the original plan unless another source confirms it.

## Verification already run

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- Programmatic search checks returned Codex entries for `plan`, `ctrl o`, `review`, `permissions`, and `codex`; `ctrl o` ranked the Codex `Ctrl+O` copy action first.

## Browser state

- A previous Vite process was holding `127.0.0.1:5173`; it was confirmed as this workspace's Vite server and killed.
- Later checks showed `5173` was free before starting Vite.
- Vite can start successfully at `http://127.0.0.1:5173/` when allowed outside the sandbox.
- Browser verification did not complete in this thread because the Browser runtime exposed no active browser backends:
  - `agent.browsers.get("iab")` returned `Browser is not available: iab`.
  - `agent.browsers.list()` returned `[]`.
- If a new thread has `@Browser` active, start Vite on `127.0.0.1:5173`, open that URL, allow the localhost site if prompted, then verify the sidebar filter and the search terms above.
