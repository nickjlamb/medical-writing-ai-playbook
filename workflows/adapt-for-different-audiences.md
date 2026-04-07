---
title: "Adapt Content for Different Audiences"
sidebarTitle: "Adapt for Audiences"
description: "Transform medical content across audience levels while preserving factual accuracy and source grounding."
icon: "users"
---

## Purpose

Transform existing medical or scientific content from one audience level to another — adjusting language, complexity, emphasis, and framing while preserving factual accuracy and source grounding.

## Best used when

- You have approved or reviewed content for one audience (e.g., specialists) and need a version for another (e.g., general practitioners, nurses, patients, payers)
- Preparing multi-audience materials from a single evidence base
- Adapting a technical manuscript summary into a client-facing or internal briefing
- Creating tiered content for different stakeholder groups from the same core data

## Do not use when

- The source content has not been reviewed or verified — adapt from approved or verified content only
- The target audience requires content with different regulatory requirements (e.g., HCP to patient) and you have not accounted for the change in compliance context
- The adaptation requires adding new data or claims not present in the source content — that is a new writing task, not an adaptation

## Inputs

- Source content (reviewed, accurate, with clear references)
- Target audience specification — be as specific as possible (e.g., "community pharmacists in primary care" not just "HCPs")
- Context on the target audience's knowledge level, priorities, and information needs
- Any format or length requirements for the adapted version
- Regulatory context for the adapted version (promotional, non-promotional, educational, patient-facing)

## Recommended workflow

1. **Start with verified source content** — Only adapt content that has already been reviewed for accuracy. This workflow transforms, it does not create.
2. **Define the target audience precisely** — Generic audience labels produce generic adaptations. Be specific about who will read this and what they need from it.
3. **Provide the source content and audience specification to the AI** — Include both the content and clear instructions about the target audience.
4. **Generate the adapted version** — Use LLMentor or the prompt pattern below.
5. **Review for meaning preservation** — The most critical check. Has the adaptation changed what the content says, not just how it says it?
6. **Review for audience appropriateness** — Is the language, level of detail, and framing genuinely suitable for the target audience?
7. **Cross-check against source** — Verify that no new claims have been introduced and no important information has been lost.
8. **Compliance review** — If the adapted version has different regulatory requirements from the original, ensure it meets those requirements.

## Where AI helps

- Rapidly adjusting language complexity and terminology for different professional or lay audiences
- Restructuring content emphasis to match audience priorities (e.g., shifting from efficacy-led to practical-considerations-led for nurses)
- Producing multiple audience versions from a single source for comparison and selection
- Suggesting alternative phrasings for complex medical concepts

## Where human judgement is essential

- **Deciding what the audience needs to know.** AI adapts everything. The writer decides what is essential, what can be simplified, and what should be omitted for a specific audience.
- **Assessing meaning preservation.** Simplification can change meaning. Only a subject matter expert can confirm that the simplified version still says what the original intended.
- **Regulatory context.** Adapting content from a scientific to a promotional context, or from HCP to patient, changes the compliance requirements. This is a human decision.
- **Cultural and contextual sensitivity.** Language and framing that works for one audience or market may not work for another. This requires human judgement.

## Suggested tools

| Tool | Role in this workflow |
|---|---|
| LLMentor | Primary tool for audience-level adaptation |
| Patiently AI | When the target audience is patients or carers |

## Prompt pattern

```
You are a medical writing assistant specialising in audience adaptation. Your task is to adapt the following content for a different audience.

Source content:
[INSERT REVIEWED SOURCE CONTENT]

Original audience: [SPECIFY — e.g., oncologists, clinical researchers]
Target audience: [SPECIFY — e.g., general practitioners, primary care nurses, patients with moderate health literacy]

Adaptation requirements:
- Adjust language complexity and terminology for the target audience
- Maintain all factual accuracy — do not change what the content says, only how it says it
- Preserve key data points and findings
- Adjust emphasis to reflect the target audience's priorities and information needs
- [SPECIFY any format or length requirements]

Rules:
- Do not add information that is not in the source content
- Do not remove safety information or important limitations
- If a medical term is simplified, ensure the simplified version is medically accurate
- If the source includes specific data (numbers, statistics), retain them unless the adaptation format explicitly calls for a non-data summary
- Flag any areas where simplification may have changed the meaning with [REVIEW]
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Meaning drift | High | High — source says "Treatment X demonstrated non-inferior efficacy to Treatment Y." GP-facing adaptation reads "Treatment X works as well as Treatment Y." These are not the same claim. | Line-by-line cross-check of every clinical claim in the adapted version against the source. Read for meaning, not just for surface accuracy. |
| Lost qualifiers | High | Medium–High — source states efficacy "in patients with moderate-to-severe disease (PASI ≥12)." Adapted version drops the qualifier. Now the claim appears to cover all patients. | List every qualifier in the source. Check each one is preserved, appropriately rephrased, or explicitly noted as removed with justification. |
| Inappropriate certainty | Medium | High — source uses "may provide benefit" or "showed a trend toward improvement." Adaptation writes "provides benefit" or "improved outcomes." The hedging vanishes. | Compare the certainty level of each claim between source and adapted version. Flag any statement where hedged language has become definitive. |
| Omitted safety information | Medium | High — a 2-page GP summary drops the safety section to save space. The GP receives a one-sided efficacy narrative. | Safety information must be present in every adapted version, regardless of format constraints. If space is limited, compress but do not remove. |
| New claims introduced | Low | High — AI adds a sentence about mechanism of action or treatment guidelines from training data that is not in the source content | Verify that every statement in the adapted version traces to the source. Flag any sentence that sounds like background context — this is where training data leaks in. |

## Human review checklist

- [ ] All factual claims in the adapted version match the source content
- [ ] No new information has been introduced that is not in the source
- [ ] Safety information is preserved and appropriately represented
- [ ] Qualifiers and limitations are retained
- [ ] Language is genuinely appropriate for the target audience (not just slightly simplified)
- [ ] Medical terms that have been simplified remain accurate
- [ ] Data points are correctly reproduced
- [ ] The adapted version meets any regulatory or compliance requirements for the target audience/channel
- [ ] Emphasis and framing are appropriate for the target audience's priorities
- [ ] The adapted version would make sense to a reader from the target audience without access to the original

## Example output characteristics

A good audience adaptation from this workflow should:

- Be recognisably derived from the source content but clearly written for a different reader
- Use terminology appropriate to the target audience's knowledge level
- Preserve all essential factual content, including safety information
- Adjust emphasis to match what the target audience needs most
- Be the right length and format for its intended use
- Not contain any claims or data that cannot be traced to the source content
- Read naturally — not like a mechanical word substitution of the original

## Next steps

- [Create a Plain Language Summary](/workflows/create-plain-language-summary) — if your target audience is patients or carers
- [Repurpose Across Channels](/workflows/repurpose-content-across-channels) — adapt the output for different channel formats
- [Final Human Review](/workflows/final-human-review) — verify the adapted version before use

---

**Risk tier:** Low–Medium (higher when adapting for patients or regulatory-sensitive contexts)
**Review requirement:** Enhanced review with source cross-check
**Workflow version:** 1.0
