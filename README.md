# Apsu Home Page

Front-end take-home assignment: a responsive home page and React component library based on the supplied Figma design.

**Current status:** requirements and development documentation are initialized. Application code, dependencies, and Storybook have not been created. The implementation and submission are not complete.

## Assignment and design

- Required stack: Next.js App Router, React, strict TypeScript, and Tailwind CSS.
- Fidelity targets: 375px and 1440px. Layout integrity is required at every width from 320px to 1920px.
- Dynamic content must have typed future API contracts and conforming mock data.
- Interactive elements need hover, focus, pressed states, and transitions. Stateful components need one Storybook story per state.
- Preserve the full commit history and complete, unedited AI session records under `ai-logs/`.
- [Figma reference](https://www.figma.com/design/DmTQCqCODfpqMmdsZUFCnj/Front-end-Assignment?node-id=0-1)

The source assignment is `Front-End Take-Home Assignment (1).pdf`, page 1, supplied separately in the local workspace. Its requirements are summarized in [requirements](doc/requirements.md).

## Running the project

The evaluator will run the following commands. **They are target commands, not working commands yet:** this repository does not currently contain `package.json`.

```sh
npm install
npm run build
npm run dev
npm run storybook
```

Add the actual Node/npm versions, scripts, ports, and committed lockfile when the application is initialized.

## Repository structure

| Path | Purpose |
| --- | --- |
| `doc/requirements.md` | Assignment requirements, acceptance criteria, and scope boundaries |
| `doc/design.md` | Design inventory, evidence, unresolved questions, and Hero audit |
| `doc/architecture.md` | Proposed code structure, content contracts, and component boundaries |
| `doc/decisions.md` | Significant choices, reasons, alternatives, and optional model handoff workflow |
| `doc/tasks-handoff.md` | Current progress, next task, validation evidence, and handoff |
| `ai-logs/` | Original AI session records and an index explaining their scope |

The application structure is still proposed. Replace this section with the implemented directories and their rationale as code is added.

## Design deviations

No design fix has been implemented yet. Design details have not been verified directly through Figma; connector access failed during initialization. Candidate issues in working notes are not accepted deviations.

Record **every implemented design fix** here, rather than keeping the submission log only in internal documentation.

| ID | Section / source node | Original issue | Implemented change | Why | Verification |
| --- | --- | --- | --- | --- | --- |

## Self-designed interaction states

No interaction states have been implemented yet. Record every self-designed state and its rationale here; link the corresponding Storybook stories once available.

| Component | States / transition | Why | Story / verification |
| --- | --- | --- | --- |

## AI use and session records

| Tool | Contribution | Original session record |
| --- | --- | --- |
| Codex | Initial requirement analysis, documentation, and local Git setup; no application UI code yet | Pending export of this complete session; see [AI log index](ai-logs/README.md) |

Update this table with actual tools and contributions. Claude Code is an optional future tool and has not contributed in this initialization session. Working documents and handoff summaries do not replace original transcripts.

## Validation and known limitations

- PDF requirement extraction and visual inspection: completed during initialization.
- Figma design inspection: pending; the connector returned an edit-access error.
- Application build, responsive checks, and Storybook checks: not run; no application exists yet.
- AI transcript export and public GitHub publication: pending.

See [current handoff](doc/tasks-handoff.md) for the next concrete task.
