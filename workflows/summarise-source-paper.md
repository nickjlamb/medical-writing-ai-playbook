---
title: "Summarise a Source Paper"
sidebarTitle: "Summarise a Paper"
description: "Generate a structured summary from a published clinical or scientific paper for use in downstream medical writing work."
icon: "file-text"
id: "summarise-source-paper"
slug: "summarise-source-paper"
type: "workflow"
version: "1.0"
status: "published"
stage: "source-analysis"
risk_tier: "low"
review_requirement: "standard"
deliverable_types:
  - "summary"
  - "briefing-document"
audiences:
  - "internal"
  - "hcp-specialist"
tools:
  - id: "posterlens"
    role: "supporting"
  - id: "general-llm"
    role: "primary"
related_workflows:
  - "extract-key-messages"
  - "build-content-outline"
related_prompts:
  - "source-analysis-prompts"
related_principles:
  - "source-grounding"
  - "human-in-the-loop"
created: "2026-04-06"
updated: "2026-04-06"
---

## Purpose

Generate a structured summary of a published clinical or scientific paper that accurately captures the study design, key findings, and conclusions — ready for use as a foundation for further medical writing work.

## Best used when

- Starting a new project and need to rapidly digest source literature
- Preparing a literature review or evidence summary for a briefing document
- Creating internal summaries for account teams or client stakeholders who need a quick overview of a paper
- Building a reference library summary for a therapeutic area

## Do not use when

- The paper contains highly complex statistical analyses that require specialist interpretation (e.g., network meta-analyses, Bayesian frameworks) — summarise the design and top-line results, but flag the analysis for expert review
- You need a critical appraisal of the study methodology — this workflow summarises what the paper says, not whether the study was well designed
- The output will be used directly as a promotional or regulatory document without further development and review

## Inputs

- Full text of the published paper (PDF or text)
- Any specific focus areas or sections of interest (e.g., "focus on the safety results" or "primary endpoint only")
- Target summary length and format requirements (e.g., structured abstract, narrative summary, bullet-point overview)

## Recommended workflow

1. **Read the paper yourself first** — At minimum, read the abstract, results, and conclusions. You need to understand what the paper says before you can evaluate an AI summary of it.
2. **Provide the full text to the AI** — Do not rely on the AI's training data knowledge of the paper. Provide the actual text.
3. **Use the prompt pattern below** — Specify the output format and any focus areas.
4. **Review the AI summary against the paper** — Check every factual claim, data point, and conclusion against the original.
5. **Correct and refine** — Fix any inaccuracies, fill gaps, adjust emphasis, and refine the language for your specific purpose.
6. **Final review** — Confirm the summary is accurate, complete for its purpose, and appropriately sourced.

## Where AI helps

- Getting from a 12-page published paper to a structured 500-word summary draft in 2–3 minutes instead of 30–45
- Consistently extracting and organising the standard elements (design, population, endpoints, results, conclusions) even across papers with different reporting structures
- Producing a working draft that frees the writer to focus on verification, emphasis, and contextualisation rather than blank-page drafting

## Where human judgement is essential

- **Assessing what matters most in the paper.** AI will summarise everything with equal weight unless directed otherwise. The medical writer decides what to emphasise based on the project context.
- **Verifying accuracy of data points.** AI can misrepresent numbers, swap comparators, or conflate study arms. Every data point must be checked.
- **Contextualising the findings.** The summary may need to reflect how this paper fits within the broader evidence landscape — AI does not have that context unless provided.
- **Deciding what to omit.** A summary is, by definition, selective. The medical writer decides what is essential and what can be left out for the specific audience and purpose.

## Suggested tools

| Tool | Role in this workflow |
|---|---|
| [PubCrawl](/tools/pubcrawl) | Optional — find and retrieve the source paper if you are starting from an indication or research question rather than a specific reference |
| [PosterLens](/tools/posterlens) | If the source is a scientific poster rather than a paper, use PosterLens to extract structured content before summarising |

## Prompt pattern

```
You are a medical writing assistant. Your task is to summarise the following published paper into a structured summary.

Structure your summary with these sections:
- Citation (authors, journal, year)
- Study design and objective
- Population (key inclusion criteria, sample size)
- Primary endpoint and results
- Key secondary endpoints and results
- Safety findings
- Authors' conclusions
- Limitations noted by the authors

Rules:
- Base your summary only on the content of the provided paper. Do not add information from other sources.
- Reproduce data points (p-values, confidence intervals, hazard ratios, percentages) exactly as stated in the paper.
- If a finding is from a subgroup or post-hoc analysis, state this explicitly.
- Do not interpret the results beyond what the authors state.
- If you are uncertain about any data point, flag it with [VERIFY].

Paper text:
[INSERT FULL TEXT]
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Incorrect data points | Medium | High — a transposed HR (0.67 vs 0.76) or wrong p-value propagates into every downstream deliverable built from this summary | Open the source paper's results table and verify every numerical value side by side |
| Merged study arms | Medium | High — AI combines drug arm and comparator results, or merges ITT and per-protocol populations into one statement | Check that each result is attributed to the correct arm, population, and analysis type |
| Omitted safety data | Medium | High — a summary that foregrounds efficacy and omits or minimises AE data creates an unbalanced picture that carries through to client deliverables | Explicitly cross-check that safety findings from the paper's safety section are present and proportionate in the summary |
| Overstated conclusions | Low–Medium | Medium — AI states the drug "significantly improved outcomes" when the paper reports a trend or a secondary endpoint result | Compare every conclusion statement against the authors' own Discussion and Conclusions sections |
| Hallucinated context | Low | Medium — AI adds a sentence about disease prevalence or standard of care from its training data, not from the paper | Read the summary with the paper's Introduction section open. Flag any context that is not sourced from the provided text. |

## Human review checklist

- [ ] All data points (p-values, CIs, HRs, ORs, percentages, sample sizes) match the source paper
- [ ] Study design is correctly described
- [ ] Population and key inclusion/exclusion criteria are accurate
- [ ] Primary endpoint result is correct and attributed to the right analysis (ITT, mITT, PP)
- [ ] Secondary endpoints are accurately summarised
- [ ] Safety data is present and not minimised
- [ ] Conclusions match the authors' stated conclusions
- [ ] No unsourced claims or AI-generated background information
- [ ] Subgroup and post-hoc results are clearly labelled as such
- [ ] Summary length and format meet the project requirements

## Example output characteristics

A good summary from this workflow should:

- Be 400–800 words for a standard structured summary (adjustable based on requirements)
- Follow the specified section structure consistently
- Contain only information from the provided paper
- Reproduce numerical data exactly as stated in the source
- Clearly distinguish between primary, secondary, and exploratory endpoints
- Include safety findings proportionate to their prominence in the paper
- Use professional medical writing language without promotional framing
- Flag any areas of uncertainty with [VERIFY] markers

## Next steps

After summarising a source paper, these workflows are the natural next steps:

- [Extract Key Messages](/workflows/extract-key-messages) — identify the evidence-supported messages from your summary
- [Build a Content Outline](/workflows/build-content-outline) — structure a deliverable from the summary and key messages
- [Final Human Review](/workflows/final-human-review) — QC checklist before the summary is used in a deliverable

---

**Risk tier:** Low
**Review requirement:** Standard medical writing review
**Workflow version:** 1.0
