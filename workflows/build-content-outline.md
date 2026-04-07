---
title: "Build a First Content Outline"
sidebarTitle: "Build an Outline"
description: "Create a structured content outline organising key messages and source materials into a deliverable framework."
icon: "layout"
---

## Purpose

Create a structured content outline for a medical communications deliverable, organising key messages, source materials, and narrative flow into a framework that a medical writer can develop into a full draft.

## Best used when

- Starting a new deliverable (slide deck, manuscript draft, monograph, training material) and need to establish structure before writing
- Translating a briefing document or messaging framework into a content plan
- Working with multiple source documents and need to organise them into a coherent narrative
- Preparing an outline for client or internal review before committing to a full draft

## Do not use when

- The deliverable has a mandated structure (e.g., CSR sections, regulatory submission templates) — use the required template directly
- You do not yet have clear source materials or key messages — complete the source analysis and message extraction workflows first
- The outline will be treated as a final document without further development

## Inputs

- Key messages or messaging framework (ideally from the [Extract key messages](/workflows/extract-key-messages) workflow)
- Source materials (papers, data packages, briefing documents)
- Deliverable specifications: format, audience, channel, length requirements
- Any existing templates or structural requirements for the deliverable type
- Client or internal briefing document (if available)

## Recommended workflow

1. **Clarify the deliverable requirements** — Confirm the format, audience, purpose, and any structural constraints before generating an outline.
2. **Gather inputs** — Assemble key messages, source materials, and any approved messaging framework.
3. **Provide inputs to the AI** — Include the key messages, audience specification, and format requirements.
4. **Generate a draft outline** — Use the prompt pattern to produce a structured outline.
5. **Review the outline** — Assess the structure, flow, and completeness against the project brief.
6. **Refine** — Adjust section order, add or remove sections, and annotate with specific content notes or source references.
7. **Share for review** — Present the outline to the project team or client for alignment before proceeding to full draft.

## Where AI helps

- Generating a logical structure based on the key messages and deliverable type
- Suggesting section headings and subheadings that follow standard conventions for the content type
- Organising multiple key messages into a coherent narrative sequence
- Producing multiple outline options for comparison (e.g., disease-first vs. product-first structure)

## Where human judgement is essential

- **Narrative strategy.** The order and emphasis of sections reflect strategic choices about how the story should be told. AI can suggest a structure, but the medical writer and strategy team decide the narrative approach.
- **Audience-appropriate depth.** How much detail each section needs depends on the audience and the deliverable's purpose. The writer makes this judgement.
- **Source allocation.** Deciding which source materials support which sections, and whether the evidence is sufficient for each section, requires expert assessment.
- **Alignment with brand or project strategy.** The outline must fit within the broader communications plan, which the AI does not have visibility of unless provided.

## Suggested tools

No specific PharmaTools.AI tools are required for this workflow. The outline is a structural task that relies primarily on the writer's judgement, informed by the key messages and source materials.

## Prompt pattern

```
You are a medical writing assistant. Your task is to create a content outline for the following deliverable.

Deliverable type: [SPECIFY — e.g., HCP slide deck, medical education monograph, publication manuscript, training module]
Target audience: [SPECIFY]
Purpose: [SPECIFY — e.g., communicate Phase III results to oncologists, support payer value discussions]
Approximate length/scope: [SPECIFY]

Key messages to incorporate:
[INSERT KEY MESSAGES]

Structure the outline with:
- Section headings and subheadings
- A one-sentence description of what each section should cover
- Notes on which key messages map to which sections
- Suggested approximate length or number of slides per section (if applicable)

Rules:
- Every section should have a clear purpose. Do not include sections that are structural filler.
- Ensure the outline flows logically — the reader should be able to follow the narrative from section to section.
- Include a section for safety and tolerability unless the deliverable explicitly excludes it.
- Flag any sections where you are uncertain about placement or content.
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Generic structure | Medium | Low–Medium — AI produces a textbook "Background → Methods → Results → Conclusions" structure when the deliverable needs a story-led flow (e.g., unmet need → evidence → clinical impact) | Assess whether the structure matches the deliverable type and narrative strategy. A slide deck for an advisory board needs a different architecture than a monograph. |
| Missing sections | Low | Medium — outline omits a safety section, or does not include a competitive context section that the brief requires | Cross-check every requirement in the project brief against the outline. Verify that all key messages are allocated to at least one section. |
| Illogical flow | Low | Medium — evidence sections appear before the clinical context is established, or the mechanism section follows the efficacy data instead of preceding it | Read the outline as a narrative sequence. Ask: would the audience be able to follow this without backtracking? |
| Over-structured | Medium | Low — AI generates 15 subsections for a 10-slide deck, creating structure that will never translate to the deliverable | Match section count to the deliverable scope. A 10-slide deck needs 5–7 content sections, not 15. |

## Human review checklist

- [ ] Every key message from the brief or messaging framework is allocated to at least one section
- [ ] No key messages are duplicated across multiple sections without purpose
- [ ] The narrative arc makes sense for the target audience (e.g., disease burden → unmet need → evidence → clinical implications for an HCP audience)
- [ ] The structure matches the deliverable format (e.g., slide count for a deck, page allocation for a monograph, module structure for a website)
- [ ] Safety and tolerability have a defined section — not appended as an afterthought
- [ ] No sections exist purely as structural filler (e.g., a "Background" section with no defined content scope)
- [ ] The outline is consistent with the project brief, brand guidelines, and any communications strategy
- [ ] Section lengths are realistic — a 3-slide section in a 10-slide deck should not contain 5 key messages
- [ ] Source materials are sufficient to populate each section — flag any section where evidence gaps exist

## Example output characteristics

A good content outline from this workflow should:

- Contain 5–12 main sections (depending on deliverable type and scope)
- Include clear, specific section headings (not generic labels like "Background")
- Map key messages to specific sections
- Have a logical progression that a reader or viewer can follow
- Include content notes that give a writer enough guidance to start drafting
- Be proportionate — section length guidance should reflect the relative importance of each topic
- Include safety/tolerability as a defined section unless explicitly excluded by the brief

## Next steps

- [Adapt for Different Audiences](/workflows/adapt-for-different-audiences) — create audience-specific versions from your outline
- [Repurpose Across Channels](/workflows/repurpose-content-across-channels) — adapt the deliverable for other formats
- [Final Human Review](/workflows/final-human-review) — QC the completed deliverable before submission

---

**Risk tier:** Low
**Review requirement:** Standard review — outline serves as a planning document, not a final deliverable
**Workflow version:** 1.0
