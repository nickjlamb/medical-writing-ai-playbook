# Medical Writing AI Playbook

A structured, workflow-based operating system for using AI in medical writing, med comms, and pharmaceutical content development. Built for people who write, review, and approve medical content for a living.

---

## What this is

This playbook maps where AI fits — and where it does not — across the content development workflows that medical writers, agencies, and pharma teams run every day: from source paper summarisation through to MLR-ready deliverables.

It is not a prompt library. It is not a pitch for automation. It is a working framework built around two principles:

> **AI for acceleration, not authority.**
> **Translation, not invention.**

Each workflow card defines:

- The specific task AI can handle (and the boundaries of that contribution)
- The review and verification steps a medical writer must complete
- The risk tier and what that means for sign-off
- Where purpose-built tools from PharmaTools.AI slot into the process
- Reusable prompt patterns designed for source-grounded, reviewable output

The standard of the deliverable does not change because AI was involved in producing it. The production process changes. The accountability does not.

---

## Who this is for

| Role | How to use this playbook |
|---|---|
| **Freelance medical writers** | Integrate AI into your drafting, summarisation, and QC workflows. Show clients a credible, structured approach to AI-assisted work — not ad hoc prompting |
| **Med comms agencies** | Adopt as an operating framework for AI-assisted content development. Standardise how your team uses AI across accounts, train writers consistently, and give clients visibility into your process |
| **Account leads and strategists** | Understand what AI can realistically deliver at each project stage, where it saves time in the content development timeline, and where it introduces review overhead |
| **Pharma brand, medical, and training teams** | Evaluate agency AI practices against a structured framework. Understand how AI-assisted workflows maintain accuracy and compliance standards in your deliverables |
| **Regulatory and compliance reviewers** | See how AI outputs are bounded, verified, and flagged before they enter your review queue — and what additional checks apply to AI-assisted content |

---

## Design principles

This playbook is built on four principles, each documented in detail in the [`principles/`](principles/) directory:

1. **[Human-in-the-loop decision making](principles/human-in-the-loop.md)** — Every deliverable has a named owner. AI produces draft material; a qualified medical writer or reviewer verifies, edits, and signs off.

2. **[Source grounding](principles/source-grounding.md)** — Every claim traces to a specific source document. No content enters a deliverable from AI training data. If it is not in the source, it is not in the output.

3. **[Risk-aware use](principles/risk-levels.md)** — Summarising a paper and drafting a promotional claim are different tasks with different failure consequences. Three tiers define how much AI contribution is appropriate and what review each tier requires.

4. **[Review and accountability](principles/review-and-accountability.md)** — Structured sign-off protocols, audit trails, and documentation requirements that sit within existing agency QC processes and MLR workflows.

---

## How PharmaTools.AI fits in

This playbook integrates tools from [PharmaTools.AI](https://pharmatools.ai) at specific workflow steps where they solve problems that general-purpose LLMs handle poorly: reference verification, compliance signal detection, patient-friendly content generation, and structured poster extraction.

| Tool | What it does | Where it fits |
|---|---|---|
| [RefCheckr](tools/refcheckr.md) | Checks claims against cited references | Pre-MLR reference verification, QC on multi-reference documents |
| [MedCheckr](tools/medcheckr.md) | Scans for promotional compliance signals | Pre-MLR compliance screening, self-check before submission |
| [Patiently AI](tools/patiently-ai.md) | Translates clinical content into patient-friendly language | Patient-facing content development, health literacy adaptation |
| [LLMentor](tools/llmentor.md) | Adapts content across audience levels | HCP-to-generalist adaptation, multi-stakeholder repurposing |
| [PLS Generator](tools/pls-generator.md) | Generates plain language summaries from clinical sources | EU CTR lay summaries, patient communications, trial disclosure |
| [PosterLens](tools/posterlens.md) | Extracts structured data from scientific posters | Congress coverage, rapid poster-to-summary workflows |

See the [`tools/`](tools/) directory for detailed tool pages.

---

## Start here

### If you are a freelance medical writer

1. Read [risk levels](principles/risk-levels.md) — understand which of your typical deliverables fall into which tier
2. Start with [Summarise a source paper](workflows/summarise-source-paper.md) — it mirrors the work you already do and shows the framework in action
3. Build up to [Extract key messages](workflows/extract-key-messages.md) and [Build a content outline](workflows/build-content-outline.md) — the workflows that save the most time in early-stage content development
4. Run every AI-assisted deliverable through [Final human review](workflows/final-human-review.md) before it leaves your desk
5. Use this playbook to show clients that your AI-assisted work follows a documented, quality-controlled process

### If you are an agency or team lead

1. Read all four [principles](principles/) and assess how they map to your existing SOPs and QC processes
2. Identify which [workflows](workflows/) match your most common project types — publication support, promotional content, congress coverage, training materials
3. Use the [templates](templates/) to standardise how your team documents AI-assisted work across accounts
4. Establish sign-off protocols by risk tier using the [review and accountability](principles/review-and-accountability.md) framework
5. Brief your client services team on how to position AI-assisted workflows to clients — the [risk levels](principles/risk-levels.md) and [compliance workflow](workflows/check-promotional-compliance.md) are the key credibility documents

### If you are a pharma brand, medical, or training team

1. Start with [risk levels](principles/risk-levels.md) — this is the framework for evaluating what level of AI involvement is appropriate for your content types
2. Review the [compliance workflow](workflows/check-promotional-compliance.md) and [verification workflow](workflows/verify-claims-against-references.md) to see how accuracy and compliance are maintained through AI-assisted production
3. Use this playbook to set expectations with agencies about AI use — what you expect to see documented, what review standards apply, and what sign-off looks like
4. The [review and accountability](principles/review-and-accountability.md) framework maps directly to your existing MLR and content approval processes

---

## Workflow index

| # | Workflow | Risk tier | Key tools |
|---|---|---|---|
| 1 | [Summarise a source paper](workflows/summarise-source-paper.md) | Low | PosterLens (for posters) |
| 2 | [Extract key messages](workflows/extract-key-messages.md) | Medium | RefCheckr |
| 3 | [Build a content outline](workflows/build-content-outline.md) | Low | — |
| 4 | [Adapt for different audiences](workflows/adapt-for-different-audiences.md) | Low–Medium | LLMentor |
| 5 | [Create a plain language summary](workflows/create-plain-language-summary.md) | Medium–High | Patiently AI, PLS Generator |
| 6 | [Verify claims against references](workflows/verify-claims-against-references.md) | High | RefCheckr |
| 7 | [Check promotional compliance](workflows/check-promotional-compliance.md) | High | MedCheckr |
| 8 | [Repurpose content across channels](workflows/repurpose-content-across-channels.md) | Medium | LLMentor |
| 9 | [Prepare a congress or poster summary](workflows/prepare-congress-or-poster-summary.md) | Low–Medium | PosterLens |
| 10 | [Final human review](workflows/final-human-review.md) | Critical | RefCheckr, MedCheckr |

---

## Repository structure

```
medical-writing-ai-playbook/
├── README.md
├── principles/
│   ├── human-in-the-loop.md
│   ├── source-grounding.md
│   ├── risk-levels.md
│   └── review-and-accountability.md
├── workflows/
│   ├── summarise-source-paper.md
│   ├── extract-key-messages.md
│   ├── build-content-outline.md
│   ├── adapt-for-different-audiences.md
│   ├── create-plain-language-summary.md
│   ├── verify-claims-against-references.md
│   ├── check-promotional-compliance.md
│   ├── repurpose-content-across-channels.md
│   ├── prepare-congress-or-poster-summary.md
│   └── final-human-review.md
├── templates/
│   ├── workflow-card-template.md
│   ├── prompt-pattern-template.md
│   └── review-checklist-template.md
├── tools/
│   ├── refcheckr.md
│   ├── medcheckr.md
│   ├── patiently-ai.md
│   ├── llmentor.md
│   ├── pls-generator.md
│   └── posterlens.md
└── prompts/
    ├── source-analysis-prompts.md
    ├── outlining-prompts.md
    ├── adaptation-prompts.md
    └── review-prompts.md
```

---

## What this playbook is not

- **Not a replacement for a medical writer.** Every workflow produces draft material that requires trained review. AI moves the starting line forward — it does not move the finish line.
- **Not regulatory or legal guidance.** Compliance workflows pre-screen for common issues. They do not constitute regulatory advice and do not replace MLR review, legal counsel, or regulatory affairs assessment.
- **Not an autonomous content pipeline.** There is no workflow in this playbook where AI output goes directly into a deliverable. Every path includes human verification, editing, and sign-off.
- **Not a generic prompt collection.** Every prompt pattern is designed for a specific med comms task, with defined inputs, source-grounding constraints, and review checkpoints.

---

## Planned workflow cards

The following workflows are in development, selected for their value to agencies managing multi-account, multi-deliverable workloads:

| # | Workflow | Risk tier | Why it matters for agencies |
|---|---|---|---|
| 11 | **Draft a medical education slide deck** | Low–Medium | One of the highest-volume agency deliverables. AI can generate structured slide outlines and speaker notes from key messages and source papers, saving hours of blank-page time per project. |
| 12 | **Write a briefing document from source literature** | Low | Account teams and strategists need rapid briefing docs when new data drops. AI can structure a multi-source briefing from papers and data packages, giving the team a reviewable draft within hours instead of days. |
| 13 | **Generate an annotated reference list** | Low | Annotation of reference libraries is repetitive and time-consuming. AI can produce structured annotations (study design, population, key findings, relevance) from full-text papers, giving writers a working reference summary at project kickoff. |
| 14 | **Pre-populate an MLR submission package** | Medium–High | Preparing the submission package (claims matrix, reference annotations, rationale notes) is a high-effort, high-accuracy task. AI can draft the initial population from the content and references, with the writer verifying every entry before submission. |
| 15 | **Develop training materials from approved content** | Low–Medium | Agencies frequently repurpose approved scientific content into training decks, e-learning modules, or onboarding materials for field teams. AI can restructure approved content into training frameworks with knowledge-check questions and learning objectives. |

---

## Roadmap

This playbook is a free, open, living system. Planned additions:

- Interactive workflow selector: "What are you writing? Who is it for?" → recommended workflow and risk tier
- Anonymised case studies from real med comms projects
- Agency SOP integration guide
- Worked examples showing source input → AI draft → human review → final output

---

## Contributing

This playbook is free and open. If you work in medical writing, med comms, or pharmaceutical communications and want to contribute workflows, prompt patterns, or review checklists, contributions are welcome. All contributions must follow the playbook's principles and use the provided templates.

---

## License

This playbook is provided as a free professional resource. See LICENSE for details.

---

*A free resource from [PharmaTools.AI](https://pharmatools.ai) — practical AI tools for medical writing and pharmaceutical communications.*
