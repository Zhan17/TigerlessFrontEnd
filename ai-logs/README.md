# AI session records

The assignment requires complete, unedited AI session records for this project. This index, working notes, decision logs, commit messages, and handoff summaries are **not** substitutes for original transcripts.

## Current coverage

| Session | Tool | Contribution | Original record |
| --- | --- | --- | --- |
| 2026-10-01 → 2026-10-02, session `49a5b82d-24c0-49f7-8a28-b0a36d54120b` | Claude Code (desktop app) | Requirement review, Figma audit, asset sourcing, architecture options, then the whole implementation (scaffold, tokens, icons, component library, data contract, every section, Storybook, tests) and the README / handoff documents | [`claude-code/49a5b82d-24c0-49f7-8a28-b0a36d54120b.jsonl`](claude-code/49a5b82d-24c0-49f7-8a28-b0a36d54120b.jsonl) (the session transcript as stored by Claude Code) and [`claude-code/49a5b82d-24c0-49f7-8a28-b0a36d54120b/`](claude-code/49a5b82d-24c0-49f7-8a28-b0a36d54120b/) (large tool outputs and screenshots the transcript refers to) |
| 2026-10-01 | Codex | PDF analysis, documentation design and creation, local Git initialization, collecting raw image assets from Figma | To be added by the user (the session actually used for the project) |

Notes:

- The Claude Code files are copied byte-for-byte from `~/.claude/projects/F--AI-TigerlessTask-Front-End-Task/`; nothing was edited or removed. The session was still running when the copy was taken, so the last few turns may be missing. Last refreshed 2026-10-02 (≈ 79 MB), after the user's local-testing fixes.
- Earlier parts of the session were automatically compacted by Claude Code when the context grew long; the transcript keeps the original turns, and the compaction summaries appear in it as written.

## Archiving

- Save each tool's complete original export unchanged under this directory; preserve its format. Example filenames: `2026-10-01-codex-initialization.<original-extension>` or a per-session folder for a multi-file export.
- Use the tool's available export/session-record capability. Do not invent an export command or claim a summary is an original log.
- Include initialization, implementation, review, and handoff sessions from every AI tool actually used on this project.
- Add a row linking the real file and describing its contribution; update the root README AI-use table as well.
- Do not merge, abridge, rewrite, or replace original exports with generated summaries.
- Confirm suitability for public publication before pushing. If an original record includes secrets or private content, resolve the conflict with the user and assignment owner rather than silently editing an export and calling it unedited.

Future optional Claude Code use must be documented only if it actually occurs.
