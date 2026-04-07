---
title: "Create a Plain Language Summary"
sidebarTitle: "Plain Language Summary"
description: "Produce accessible patient-facing summaries from clinical and scientific source materials."
icon: "heart-pulse"
---

## Purpose

Produce a clear, accessible summary of clinical or scientific information for patients, carers, or the general public — accurately representing the evidence in language that non-specialists can understand and act on.

## Best used when

- Developing lay summaries of clinical trial results (e.g., for EU CTR compliance or sponsor transparency initiatives)
- Creating patient-facing summaries of published studies for disease awareness or education
- Preparing plain language content for patient advocacy organisations or support groups
- Translating medical information into accessible formats for health literacy purposes

## Do not use when

- The content requires formal regulatory review before any draft is produced (start with the regulatory team's requirements)
- The source material is still being interpreted by the clinical team — only summarise settled, reviewed findings
- The content will be used as medical advice — plain language summaries inform, they do not advise
- The PLS must meet specific regulatory templates (e.g., ICH E6-compliant lay summaries) — start from the template, not from a general AI-generated draft

## Inputs

- Source document: published paper, clinical study report, results summary, or approved technical summary
- Target reading level or health literacy standard (if specified)
- PLS format requirements (structure, length, required sections)
- Any regulatory or sponsor-specific template requirements
- Context on the target audience (e.g., patients with the condition, general public, carers)

## Recommended workflow

1. **Identify requirements** — Determine the format, structure, reading level, and any regulatory template requirements before starting.
2. **Review the source material** — Read the source document yourself. Understand the findings, including safety data and limitations, before generating a PLS draft.
3. **Generate a first draft** — Use PLS Generator, Patiently AI, or the prompt pattern below.
4. **Review for accuracy** — Every clinical claim, data point, and conclusion must be verified against the source. This is the highest-priority review step.
5. **Review for readability** — Assess whether the language is genuinely accessible. Technical terms that were simplified must still be medically accurate.
6. **Review for completeness** — Ensure safety information, limitations, and balanced representation of results are present.
7. **Expert review** — A qualified medical professional must review the PLS before it is used.
8. **Lay reader testing (recommended)** — Where possible, test the summary with representative members of the target audience.

## Where AI helps

- Translating dense clinical language into plain terms rapidly
- Structuring PLS content into standard formats
- Producing a first draft that captures the main findings in accessible language
- Suggesting simplified explanations for complex medical concepts (e.g., randomisation, placebo, confidence intervals)

## Where human judgement is essential

- **Accuracy of simplified claims.** Simplification can change meaning. "The drug worked for most patients" is not the same as "The primary endpoint was met with statistical significance." A medical writer must verify that every simplified statement remains true.
- **Safety information balance.** PLS must fairly represent both benefits and risks. AI may underweight safety data if the source emphasises efficacy.
- **Appropriate scope.** Deciding what to include in a lay summary — and what to leave out — requires judgement about what the target audience needs and can understand.
- **Regulatory compliance.** PLS for clinical trial disclosure must meet specific requirements. The writer and regulatory team are responsible for compliance, not the AI.
- **Sensitivity and tone.** Patient-facing content about serious conditions requires empathy and care in language. AI may not strike the right tone for sensitive topics like disease progression, treatment failure, or adverse events.

## Suggested tools

| Tool | Role in this workflow |
|---|---|
| PLS Generator | Primary tool for generating structured plain language summary drafts |
| Patiently AI | Simplifying specific medical explanations within the PLS |

## Prompt pattern

```
You are a medical writing assistant specialising in plain language summaries. Your task is to create a plain language summary of the following clinical study for a non-specialist audience.

Target audience: [SPECIFY — e.g., patients with Type 2 diabetes, general public, carers of patients with Alzheimer's disease]
Reading level: [SPECIFY — e.g., 8th grade reading level, suitable for adults with average health literacy]
Format: [SPECIFY — e.g., structured with headings: Why was this study done? Who took part? What happened during the study? What were the results? What do the results mean?]

Source document:
[INSERT SOURCE TEXT]

Rules:
- Write in clear, simple language. Avoid medical jargon. Where a medical term must be used, explain it in plain language.
- Accurately represent the study findings. Do not overstate or understate results.
- Include information about side effects and safety findings. Do not focus only on positive results.
- Include the study limitations as described by the authors.
- Do not provide medical advice or recommendations.
- Do not include information that is not in the source document.
- Use short sentences and short paragraphs.
- Explain what the study measured and why, not just the results.
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Oversimplified claims | High | High — source states "Treatment X met the primary endpoint of ACR20 response at Week 24 (p\<0.001 vs placebo)." PLS says "The treatment worked." These have different meanings. The patient reads unwarranted certainty. | Expert review of every clinical claim. For each simplified statement, ask: is this still true? Does it preserve the scope and certainty of the original? |
| Minimised safety data | Medium | High — PLS devotes 400 words to efficacy and two sentences to side effects. A patient reading this gets a distorted benefit-risk picture. | Count the proportion of safety content relative to efficacy content. Safety should be a clearly labelled, substantive section — not a footnote. |
| False reassurance | Medium | High — PLS states "Most patients felt better on the treatment" when the study measured a biomarker, not patient-reported outcomes. Patients conflate a lab result with how they will feel. | Check that simplified descriptions of outcomes accurately reflect what was measured. Do not translate biomarker endpoints into patient-experience language unless the data supports it. |
| Inappropriate scope | Medium | Medium — PLS includes detailed pharmacokinetic data that patients cannot interpret or act on | Review content selection against what the target audience genuinely needs and can understand. Pharmacology details rarely belong in a PLS. |
| Jargon persistence | Medium | Low–Medium — terms like "randomised," "placebo-controlled," or "hazard ratio" appear without explanation | Read the PLS as if you are a patient with no medical training. Every technical term should be explained or replaced. Test with lay readers if possible. |
| Missing regulatory elements | Medium | High — a PLS intended for EU CTR disclosure omits the required "Why was this study done?" section or fails to include the EudraCT number | Cross-check every section heading and required element against the applicable regulatory template before submission. |

## Human review checklist

- [ ] All clinical claims are accurate when compared against the source document
- [ ] Data points (numbers, percentages, timeframes) are correctly represented
- [ ] Safety information is included and fairly represents the data
- [ ] Study limitations are noted
- [ ] Language is genuinely accessible to the target audience
- [ ] Medical terms are explained or avoided
- [ ] No medical advice or treatment recommendations are given
- [ ] No unsourced information has been added
- [ ] The PLS is balanced — it does not read as promotional or overly positive
- [ ] Format meets any regulatory or sponsor-specific requirements
- [ ] Reading level is appropriate (consider using readability testing tools)
- [ ] Tone is respectful and sensitive to the audience

## Example output characteristics

A good plain language summary from this workflow should:

- Be 500–1500 words depending on the study complexity and format requirements
- Use short sentences (average 15–20 words) and short paragraphs
- Follow the specified structure with clear, question-based or descriptive headings
- Explain what the study was about and why it was done before presenting results
- Present results in simple terms, using both numbers and plain language descriptions
- Include side effects and safety information in a clearly labelled section
- State what the results mean and what they do not mean
- Not include recommendations, advice, or calls to action
- Be something a patient or carer could read and understand without medical training

## Next steps

- [Verify Claims Against References](/workflows/verify-claims-against-references) — confirm simplified claims still match the source
- [Final Human Review](/workflows/final-human-review) — expert QC before the PLS is published or submitted

---

**Risk tier:** Medium–High
**Review requirement:** Expert review by medical writer and medical professional; lay reader testing recommended
**Workflow version:** 1.0
