# Downloads

Static files served by Mintlify at `https://playbook.pharmatools.ai/downloads/{filename}`.

## What's here now (working downloads)

| File | Linked from | Format |
|---|---|---|
| `audit-trail-log.csv` | `/templates/ai-audit-trail-log` | CSV — opens in Excel, Google Sheets, Numbers |
| `mlr-ai-review-checklist.md` | `/templates/mlr-ai-review-checklist` | Markdown — works in any editor |
| `pre-submission-qc-checklist.md` | `/templates/pre-submission-qc-checklist` | Markdown |
| `disclosure-language-snippets.md` | `/templates/disclosure-language` | Markdown |

## What to add when ready

The template pages already have download cards configured for these binary formats. Drop the files at the paths below and the links will work without any further code changes.

| File path | Source | Notes |
|---|---|---|
| `downloads/audit-trail-log.xlsx` | Build from `audit-trail-log.csv` | Recommended: add data validation dropdowns for Scope (Drafting / Editing / Translation / Verification / Synthesis / Image generation / Other) and Outcome (Accepted as-is / Accepted with edits / Rejected / Pending). Freeze the header row. |
| `downloads/mlr-ai-review-checklist.docx` | Convert from `mlr-ai-review-checklist.md` (Pandoc: `pandoc -o file.docx file.md`) | Replace `- [ ]` with native Word checkbox content controls for fillable form fields. |
| `downloads/pre-submission-qc-checklist.docx` | Convert from `pre-submission-qc-checklist.md` | Same approach as MLR checklist. |
| `downloads/disclosure-language-snippets.docx` | Convert from `disclosure-language-snippets.md` | Lower priority — copy-paste from the web page works for most users. |
| `downloads/mlr-ai-review-checklist.pdf` | Print from .docx or render Markdown to PDF | Optional, for print-friendly version. |
| `downloads/pre-submission-qc-checklist.pdf` | Same | Optional. |

## Optional: Google Sheets template

For the audit log specifically, a Google Sheets template adds value for teams working in Google Workspace. Workflow:

1. Open `audit-trail-log.csv` in Google Sheets, format as you like (column widths, dropdowns, freeze header).
2. Set sharing to "Anyone with the link can view" — *not* edit.
3. Update the audit-log template page's download Card to add a "Make a copy" link using this URL format: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/copy`
4. Users clicking that URL get prompted to copy the sheet to their own Drive.

## Conventions

- All filenames are lowercase, hyphenated, descriptive.
- Path is always `/downloads/{filename}` — Mintlify serves the directory as-is.
- The template `.mdx` pages link to these via plain `<Card href="/downloads/...">` links.
- When updating the web template, also update the corresponding download. Otherwise they drift.
