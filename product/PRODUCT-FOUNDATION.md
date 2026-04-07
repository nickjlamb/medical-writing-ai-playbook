# Product Foundation: Medical Writing AI Playbook

A free, open playbook for integrating AI into medical writing workflows safely and responsibly. The playbook establishes authority in AI-assisted medical writing and drives traffic to the PharmaTools.AI tool ecosystem.

---

## Positioning

The Medical Writing AI Playbook is a free professional resource — not a gated product, not a subscription service, not a SaaS platform. Every workflow, principle, prompt pattern, and tool page is publicly accessible.

**Why free:** The playbook's value is in adoption and authority. Medical writers, agencies, and pharma teams who use these workflows encounter PharmaTools.AI tools at the specific workflow steps where they solve real problems. The playbook is the top of the funnel. The tools are the product.

**What the playbook does:**
- Establishes PharmaTools.AI as the credible voice in AI-assisted medical writing
- Drives organic traffic through high-value, searchable workflow content
- Creates natural discovery points for RefCheckr, MedCheckr, Patiently AI, LLMentor, PLS Generator, and PosterLens
- Provides a framework that agencies and pharma teams can adopt — building familiarity with the tool ecosystem through daily workflow use

**What the playbook does not do:**
- Gate content behind logins or paywalls
- Require subscriptions, accounts, or billing
- Position itself as a product to be sold

---

## 1. Information Architecture

### Site map

```
/                                   → Homepage (landing + value prop)
/start                              → Start Here (role-based onboarding paths)
/principles                         → Principles overview
/principles/human-in-the-loop       → Individual principle pages
/principles/source-grounding
/principles/risk-levels
/principles/review-and-accountability
/workflows                          → Workflow library (filterable grid)
/workflows/summarise-source-paper   → Individual workflow cards
/workflows/extract-key-messages
/workflows/[slug]                   → ...all workflow cards
/prompts                            → Prompt library
/prompts/source-analysis            → Prompt collection pages
/prompts/outlining
/prompts/adaptation
/prompts/review
/tools                              → Tool directory
/tools/refcheckr                    → Individual tool pages
/tools/[slug]                       → ...all tool pages
/guides                             → Guides and how-tos (future — Phase 2+)
/case-studies                       → Anonymised case studies (future — Phase 2+)
```

### Page hierarchy

```
Level 0: Homepage
Level 1: Start Here | Principles | Workflows | Prompts | Tools
Level 2: Individual pages within each section
```

Flat structure. No one drills three levels deep in a docs site.

### Design notes

- **Workflows are the central entry point.** The site should make it possible to land on any workflow card from search, from the workflow grid, or from a cross-link — and immediately understand what it is, who it is for, and how to use it.
- **Principles are the credibility layer.** Read once, referenced thereafter. Prominent in navigation but not the primary landing path.
- **Tools are discovery points for PharmaTools.AI.** Someone searching for "AI reference checking medical writing" should land on a workflow card that shows RefCheckr in context — solving a real problem at a specific workflow step.
- **Prompts are utility content.** They drive return visits, bookmarking, and sharing. Easy to find, easy to copy.
- **Every page is publicly accessible.** No login walls, no "unlock this content" CTAs, no gated tiers.

---

## 2. Homepage

### Headline

> AI workflows for medical writing. Structured. Source-grounded. Human-reviewed.

### Subheadline

> A free, open playbook for integrating AI into med comms workflows — from source paper to MLR-ready deliverable. Built for medical writers, agencies, and pharma teams by PharmaTools.AI.

### Supporting copy (below the fold)

> **10 workflow cards** covering the full content development pipeline — summarisation, messaging, outlining, adaptation, compliance, and review.
>
> **4 design principles** defining where AI helps and where humans must lead.
>
> **20+ prompt patterns** for source-grounded, reviewable output.
>
> **6 purpose-built tools** mapped to the specific workflow steps where they add value.
>
> Free. Open. No login required.

### Homepage sections

1. **Hero** — Headline, subheadline, two CTAs: "Browse Workflows" and "Start Here"
2. **How it works** — Three-step visual: Choose a workflow → Follow the process → Review with confidence
3. **Workflow grid** — Show all 10 workflow cards with title, risk tier badge, and one-line purpose. Link directly to each card.
4. **Principles summary** — Four cards, one per principle, with a one-sentence summary and link
5. **Tools strip** — Six tool logos/icons with name and one-line description. Each links to the tool page. Tagline: "Purpose-built tools for the steps where general AI falls short."
6. **Who this is for** — Three columns: Freelance medical writers | Med comms agencies | Pharma teams. One paragraph each.
7. **Footer** — Navigation, PharmaTools.AI link, contact

---

## 3. Navigation Structure

### Primary navigation (top bar)

```
Workflows    Principles    Prompts    Tools    Start Here
```

### Secondary navigation (contextual sidebar on workflow pages)

```
Workflows:
├── By workflow stage
│   ├── Source analysis
│   ├── Content development
│   ├── Adaptation & repurposing
│   ├── Verification & compliance
│   └── Final review
├── By risk tier
│   ├── Low
│   ├── Medium
│   ├── High
│   └── Critical
└── By role
    ├── Medical writers
    ├── Agency teams
    └── Pharma stakeholders
```

### Footer navigation

```
Playbook             PharmaTools.AI       Company
─────────            ──────────────       ─────────
Workflows            RefCheckr            About
Principles           MedCheckr            Contact
Prompts              Patiently AI         Terms
Tools                LLMentor             Privacy
Start Here           PLS Generator
                     PosterLens
```

### Breadcrumbs

Every page: `Home > Section > Page`

Example: `Home > Workflows > Verify Claims Against References`

### Cross-linking patterns

Each workflow card links to:
- **Related workflows** — next logical step in the pipeline
- **Related prompts** — prompt patterns used in this workflow
- **Related tools** — PharmaTools.AI tools that integrate at specific steps, with direct links to tool pages and external product pages
- **Same risk tier** — other workflows at the same risk level

Each tool page links to:
- **Primary workflows** — where this tool is the main tool for the task
- **Supporting workflows** — where this tool adds value as a secondary check
- **Try it →** — external link to the tool on PharmaTools.AI

---

## 4. Tags and Filters for Workflow Cards

### Tag taxonomy

Each workflow card carries metadata across five dimensions:

#### Workflow stage
- `source-analysis` — working with raw source materials
- `content-development` — building new content from sources
- `adaptation` — transforming content for different audiences or channels
- `verification` — checking accuracy and compliance
- `review` — final QC and sign-off

#### Risk tier
- `low`
- `medium`
- `high`
- `critical`

#### Deliverable type
- `summary`
- `key-messages`
- `outline`
- `slide-deck`
- `leave-piece`
- `plain-language-summary`
- `congress-report`
- `training-material`
- `briefing-document`
- `promotional-content`
- `compliance-report`

#### Audience
- `hcp-specialist`
- `hcp-generalist`
- `patient`
- `payer`
- `internal` (account teams, strategists, client services)
- `regulatory`

#### Tool integration
- `refcheckr`
- `medcheckr`
- `patiently-ai`
- `llmentor`
- `pls-generator`
- `posterlens`
- `general-llm`

### Tag assignments

| Workflow | Stage | Risk | Deliverable types | Audience | Tools |
|---|---|---|---|---|---|
| Summarise a source paper | source-analysis | low | summary, briefing-document | internal, hcp-specialist | posterlens, general-llm |
| Extract key messages | source-analysis | medium | key-messages | internal | refcheckr, general-llm |
| Build a content outline | content-development | low | outline, slide-deck, leave-piece | internal | general-llm |
| Adapt for different audiences | adaptation | medium | summary, slide-deck, leave-piece, training-material | hcp-specialist, hcp-generalist, patient, payer | llmentor, patiently-ai |
| Create a plain language summary | content-development | high | plain-language-summary | patient | patiently-ai, pls-generator |
| Verify claims against references | verification | high | compliance-report | regulatory | refcheckr |
| Check promotional compliance | verification | high | compliance-report, promotional-content | regulatory | medcheckr, refcheckr |
| Repurpose across channels | adaptation | medium | slide-deck, leave-piece, briefing-document, training-material | hcp-specialist, hcp-generalist, internal | llmentor |
| Congress/poster summary | source-analysis | medium | congress-report, summary | internal, hcp-specialist | posterlens |
| Final human review | review | critical | all | all | refcheckr, medcheckr |

### Filter UI (Phase 2)

The workflow library page (`/workflows`) should support:

1. **Faceted filters** — select tags per dimension. Results narrow with each selection.
2. **Quick-filter buttons** — pre-set combinations:
   - "Low-risk workflows to try today"
   - "Workflows for promotional content"
   - "Workflows that use RefCheckr"
   - "Congress coverage workflows"
3. **Role-based views** — "I am a..." selector that pre-filters for freelance writers, agency teams, or pharma stakeholders.

For Version 1, the workflow library page can be a static grid with visual risk tier badges and one-line descriptions. Filtering is a Phase 2 enhancement.

---

## 5. Data Model

### Purpose

This data model allows the markdown files to power the docs site now and a searchable web app later. Each markdown file maps to a record. YAML frontmatter provides structured metadata; the body provides content.

### Core entities

#### Workflow

```yaml
---
id: "summarise-source-paper"
title: "Summarise a Source Paper"
slug: "summarise-source-paper"
type: "workflow"
version: "1.0"
status: "published"                    # published | draft | archived

# Classification
stage: "source-analysis"               # source-analysis | content-development | adaptation | verification | review
risk_tier: "low"                       # low | medium | high | critical
review_requirement: "standard"         # standard | enhanced | expert | critical

# Tags (arrays)
deliverable_types:
  - "summary"
  - "briefing-document"
audiences:
  - "internal"
  - "hcp-specialist"
tools:
  - id: "posterlens"
    role: "supporting"                 # primary | supporting | optional
  - id: "general-llm"
    role: "primary"

# Relationships
related_workflows:
  - "extract-key-messages"
  - "build-content-outline"
related_prompts:
  - "source-analysis-prompts"
related_principles:
  - "source-grounding"
  - "human-in-the-loop"

# Metadata
created: "2026-04-06"
updated: "2026-04-06"
author: "pharmatools"
---
```

#### Principle

```yaml
---
id: "source-grounding"
title: "Source Grounding"
slug: "source-grounding"
type: "principle"
summary: "Every claim traces to a specific source document."
---
```

#### Prompt

```yaml
---
id: "structured-paper-summary"
title: "Structured Paper Summary"
slug: "structured-paper-summary"
type: "prompt"
collection: "source-analysis"          # source-analysis | outlining | adaptation | review
risk_tier: "low"
deliverable_types:
  - "summary"
tools:
  - "general-llm"
related_workflows:
  - "summarise-source-paper"
---
```

#### Tool

```yaml
---
id: "refcheckr"
title: "RefCheckr"
slug: "refcheckr"
type: "tool"
tagline: "Checks claims against cited references"
primary_workflows:
  - "verify-claims-against-references"
supporting_workflows:
  - "extract-key-messages"
  - "final-human-review"
external_url: "https://pharmatools.ai/refcheckr"
---
```

### Relationships

```
Workflow ←→ Workflow          (related_workflows — bidirectional)
Workflow  → Prompt            (related_prompts)
Workflow  → Tool              (tools, with role: primary/supporting)
Workflow  → Principle         (related_principles)
Prompt    → Workflow          (related_workflows)
Prompt    → Tool              (tools)
Tool      → Workflow          (primary_workflows, supporting_workflows)
Tool      → External URL      (external_url — link to PharmaTools.AI product)
```

### Search index (Phase 2+)

| Field | Source | Weight |
|---|---|---|
| title | frontmatter | highest |
| purpose | first section of body | high |
| tags (all dimensions) | frontmatter | high |
| prompt patterns (code blocks) | body | medium |
| checklist items | body | medium |
| full body text | body | low |

### Query patterns to support

1. "What workflow should I use?" — Filter by deliverable type + audience
2. "Show me everything for congress coverage" — Tag search
3. "Which workflows use RefCheckr?" — Tool filter
4. "What is high-risk?" — Risk tier filter
5. "Give me the prompt for summarising a paper" — Prompt search by collection
6. "What review checklist do I need for a promotional piece?" — Deliverable type + review stage

---

## 6. Tool Discovery Strategy

The playbook drives traffic to PharmaTools.AI tools through contextual integration, not advertising. Tools appear where they solve problems, not where there is space for a banner.

### How tools surface in the playbook

#### Within workflow cards

Every workflow card has a "Suggested tools" section that names the relevant PharmaTools.AI tools with a specific role description:

> | Tool | Role in this workflow |
> |---|---|
> | RefCheckr | Primary tool — systematic claim-to-reference comparison |

These are not generic tool mentions. They describe what the tool does at that specific workflow step and why a general-purpose LLM is not sufficient for that task.

#### On tool pages

Each tool page (`/tools/refcheckr`, `/tools/medcheckr`, etc.) includes:

- **What it does** — one paragraph, specific to the med comms context
- **The problem it solves** — framed as a real workflow problem (e.g., MLR rejection cycles, congress time pressure)
- **Where it fits in the playbook** — table linking to primary and supporting workflows
- **How to use it in a workflow** — step-by-step integration
- **What it does not do** — honest boundaries
- **Try it →** — external link to the tool on PharmaTools.AI

#### Cross-linking pattern

```
Workflow card mentions tool → links to tool page
Tool page lists workflows → links back to workflow cards
Tool page includes "Try it →" → links to PharmaTools.AI product page
```

This creates a natural discovery loop: a medical writer finds a workflow through search → encounters a tool at a specific step → reads the tool page → tries the tool.

#### In prompt patterns

Prompt patterns reference tools where relevant:

> "After generating candidate key messages, run the final set through RefCheckr to confirm source support."

This positions the tool as a natural next step, not a separate product to evaluate.

### Future enhancements

- **Embedded demos** — interactive previews of tool output within workflow cards (Phase 3+)
- **Case studies** — anonymised examples showing tool use in real projects (Phase 2+)
- **Direct integration** — run RefCheckr or MedCheckr from within a workflow step on the docs site (Phase 4)

---

## 7. Future Revenue Opportunities

The playbook itself is free. Revenue comes from the PharmaTools.AI tool ecosystem and optional professional services that build on the playbook's framework.

### Tool ecosystem (primary revenue)

The playbook drives adoption of PharmaTools.AI tools. Revenue is generated through the tools themselves — their pricing, licensing, and usage models — not through the playbook.

### Optional services (future, not Version 1)

| Service | What it is | Who it is for |
|---|---|---|
| Agency training programme | Workshop-based training on AI-assisted medical writing workflows, tailored to the agency's project types and SOPs | Med comms agencies adopting AI across their teams |
| Enterprise workflow integration | Consulting engagement to embed playbook workflows into an organisation's existing QC, project management, and content approval systems | Pharma companies and large agencies with established SOPs |
| AI adoption consulting | Advisory service for pharma medical affairs, publications, or training teams evaluating AI use across their content operations | Pharma teams building an AI strategy for medical content |
| Custom workflow development | Building organisation-specific workflow cards, prompt patterns, and review checklists for deliverable types not covered in the public playbook | Agencies or pharma teams with specialised content needs |

These services are positioned as optional professional engagements — available to organisations that want hands-on support, not required to use the playbook. They should be mentioned on the PharmaTools.AI website, not on the playbook site itself. The playbook establishes the authority; the services capitalise on it.

---

## 8. Roadmap

### Phase 1 — Documentation site (Version 1 launch)

Deploy the playbook as a static docs site. All content publicly accessible. No login, no gating, no billing.

| Task | Details |
|---|---|
| Deploy docs site | Docusaurus, MkDocs, Mintlify, or Astro — static site from markdown files |
| Publish 10 workflow cards | Full workflow cards with frontmatter metadata |
| Publish 4 principles | Human-in-the-loop, source grounding, risk levels, review and accountability |
| Publish prompt library | 4 prompt collection pages with 20+ patterns |
| Publish 6 tool pages | One page per PharmaTools.AI tool with workflow integration and external links |
| Publish Start Here page | Role-based onboarding paths for freelancers, agencies, pharma teams |
| Internal cross-linking | Every workflow links to related workflows, prompts, tools, and principles |
| Tool discovery links | Every tool mention links to the tool page; every tool page links to PharmaTools.AI |
| Basic site search | Built-in docs site search (most static site generators include this) |
| SEO foundations | Meta descriptions, Open Graph tags, structured data for workflow cards |

### Phase 2 — Workflow discovery

| Task | Details |
|---|---|
| Filterable workflow grid | Tag-based filtering on the workflow library page |
| Role-based entry points | "I am a..." selector on the Start Here page |
| Start Here interactive guide | "What are you writing? Who is it for?" → recommended workflow and risk tier |
| Guides section | Agency SOP integration guide, reviewer training guide, client transparency guide |
| Case studies | 2–3 anonymised examples of AI-assisted workflows in real med comms projects |

### Phase 3 — Interactive workflow assistant

| Task | Details |
|---|---|
| Workflow selector tool | Choose your task, deliverable type, and audience → recommended workflow sequence with risk tier |
| Risk tier assessment | Interactive tool: describe your content → assigned risk tier with review requirements |
| Prompt recommender | Based on selected workflow, surface the relevant prompt patterns with copy-to-clipboard |
| Tool recommender | Based on selected workflow, surface the relevant PharmaTools.AI tools with "Try it →" links |

### Phase 4 — Tool integration

| Task | Details |
|---|---|
| Embedded tool previews | Interactive demos of RefCheckr, MedCheckr, etc. within workflow cards |
| API connections | Run PharmaTools.AI tools directly from workflow steps on the docs site |
| Workflow-to-tool handoff | Seamless transition from a workflow card to the relevant tool with context pre-populated |

---

## 9. Version 1 Launch Pages

### Minimal page set for launch

| Page | Source file | Notes |
|---|---|---|
| Homepage | New — not a markdown file | Landing page with hero, workflow grid, principles summary, tool strip |
| Start Here | New — based on README "Start here" section | Role-based paths: freelancer, agency, pharma |
| **Principles (4 pages)** | | |
| Human-in-the-loop | `principles/human-in-the-loop.md` | |
| Source grounding | `principles/source-grounding.md` | |
| Risk levels | `principles/risk-levels.md` | |
| Review and accountability | `principles/review-and-accountability.md` | |
| **Workflows (10 pages)** | | |
| Summarise a source paper | `workflows/summarise-source-paper.md` | |
| Extract key messages | `workflows/extract-key-messages.md` | |
| Build a content outline | `workflows/build-content-outline.md` | |
| Adapt for different audiences | `workflows/adapt-for-different-audiences.md` | |
| Create a plain language summary | `workflows/create-plain-language-summary.md` | |
| Verify claims against references | `workflows/verify-claims-against-references.md` | |
| Check promotional compliance | `workflows/check-promotional-compliance.md` | |
| Repurpose across channels | `workflows/repurpose-content-across-channels.md` | |
| Congress/poster summary | `workflows/prepare-congress-or-poster-summary.md` | |
| Final human review | `workflows/final-human-review.md` | |
| **Prompts (4 pages)** | | |
| Source analysis prompts | `prompts/source-analysis-prompts.md` | |
| Outlining prompts | `prompts/outlining-prompts.md` | |
| Adaptation prompts | `prompts/adaptation-prompts.md` | |
| Review prompts | `prompts/review-prompts.md` | |
| **Tools (6 pages)** | | |
| RefCheckr | `tools/refcheckr.md` | |
| MedCheckr | `tools/medcheckr.md` | |
| Patiently AI | `tools/patiently-ai.md` | |
| LLMentor | `tools/llmentor.md` | |
| PLS Generator | `tools/pls-generator.md` | |
| PosterLens | `tools/posterlens.md` | |

**Total: 26 pages** (1 homepage + 1 Start Here + 4 principles + 10 workflows + 4 prompt pages + 6 tool pages)

All content exists in the repo. The homepage and Start Here page need to be created from existing README content.

---

## 10. Next 5 Workflow Cards (Post-Launch)

These workflow cards should be added after Version 1 launches, prioritised by traffic potential and tool discovery value.

| Priority | Workflow | Risk tier | Why add it | Tool discovery |
|---|---|---|---|---|
| 1 | **Draft a medical education slide deck** | Low–Medium | Highest-volume agency deliverable. Strong search potential ("AI medical slide deck," "AI medical education content"). Demonstrates the full source → outline → draft pipeline. | LLMentor (audience adaptation for different HCP levels) |
| 2 | **Write a briefing document from source literature** | Low | Common first task when new data drops. Agencies and medical affairs teams search for this. Combines multiple source analysis workflows into a single deliverable. | PosterLens (if sources include posters), RefCheckr (verify claims in the briefing) |
| 3 | **Generate an annotated reference list** | Low | High utility, low risk, easy to adopt. Writers search for ways to speed up reference annotation at project kickoff. Good entry point for writers new to AI workflows. | RefCheckr (verify annotations match reference content) |
| 4 | **Pre-populate an MLR submission package** | Medium–High | High-value workflow for agencies. Directly surfaces RefCheckr and MedCheckr as essential tools for the submission preparation step. Strong commercial signal. | RefCheckr (claim-to-reference mapping), MedCheckr (pre-submission compliance scan) |
| 5 | **Develop training materials from approved content** | Low–Medium | Frequent agency task. Training decks, e-learning modules, and field team materials are all derived from approved scientific content. Natural fit for LLMentor audience adaptation. | LLMentor (adapt approved content for training audiences) |

### Selection rationale

These five were chosen based on:
- **Search volume potential** — terms medical writers and agency teams actually search for
- **Tool discovery value** — each workflow naturally surfaces at least one PharmaTools.AI tool
- **Adoption curve** — workflows 1–3 are low-risk entry points; workflows 4–5 are higher-value workflows for more committed users
- **Coverage gaps** — these fill the pipeline stages not covered by the initial 10 (education content, briefing documents, reference management, MLR preparation, training materials)

---

*This document is the product foundation for the Medical Writing AI Playbook. It defines the Version 1 launch scope and future direction. The playbook is a free, open professional resource that establishes authority and drives tool discovery for PharmaTools.AI.*
