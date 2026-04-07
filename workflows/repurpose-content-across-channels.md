---
title: "Repurpose Content Across Channels"
sidebarTitle: "Repurpose Content"
description: "Adapt approved content from one format or channel to another while maintaining accuracy."
icon: "repeat"
---

## Purpose

Adapt existing, reviewed medical communications content from one format or channel to another — maintaining accuracy and source grounding while adjusting structure, length, and presentation for the target channel's requirements.

## Best used when

- You have an approved piece of content (e.g., a slide deck) and need to create versions for other channels (e.g., a leave piece, email, website module)
- Working on a multi-channel campaign and need to generate consistent content across formats from a single approved source
- Repurposing a publication summary into a client-facing briefing, social media content plan, or training material
- Adapting congress highlights into multiple deliverable formats

## Do not use when

- The source content has not been reviewed or approved — repurpose only from verified content
- The target channel has significantly different regulatory requirements and you have not accounted for the compliance implications
- The repurposing requires adding new data, claims, or messaging not present in the source — that is a new content development task
- The source is a rough draft or working document — repurpose from a stable, reviewed version

## Inputs

- Source content (reviewed and approved for at least one channel)
- Target channel specification (format, length, structure, audience)
- Channel-specific requirements (e.g., character limits for social media, module structure for websites, slide-count limits for presentations)
- Regulatory context for the target channel (promotional, non-promotional, educational)
- Any channel-specific style guides or templates

## Recommended workflow

1. **Start with approved source content** — The foundation must be verified. Repurposing amplifies accuracy — and amplifies errors.
2. **Define the target channel precisely** — Specify format, length, structure, and any constraints.
3. **Identify what changes** — Determine what needs to adapt (length, structure, depth, visual emphasis) and what must stay the same (claims, data points, references, safety information).
4. **Generate the repurposed version** — Use LLMentor or the prompt pattern below.
5. **Review for accuracy** — Verify that repurposing has not changed the meaning of any claims.
6. **Review for channel fit** — Confirm the output genuinely works for the target channel (not just a shortened or lengthened version of the original).
7. **Compliance check** — If the target channel has different regulatory requirements, review accordingly.
8. **Cross-check against source** — Confirm no new claims have been introduced and no important content has been lost.

## Where AI helps

- Rapidly reformatting content for different channel structures
- Condensing long-form content into shorter formats while preserving key messages
- Expanding concise content (e.g., key messages) into longer formats with appropriate structure
- Generating multiple channel versions from a single source for comparison

## Where human judgement is essential

- **Content selection for shorter formats.** When condensing, the writer must decide what is essential and what can be cut — AI will make arbitrary choices.
- **Channel-appropriate framing.** A slide deck has a different narrative rhythm than a leave piece. A website module has different structure than an email. The writer ensures the content works in its new format.
- **Regulatory implications of channel change.** Repurposing from a scientific publication to a promotional channel, or from an HCP format to a patient format, changes the compliance context. This is a human decision.
- **Maintaining brand and campaign consistency.** Repurposed content must align with the broader campaign narrative and brand guidelines.

## Suggested tools

| Tool | Role in this workflow |
|---|---|
| LLMentor | Adapting content depth and complexity for different channel audiences |

## Prompt pattern

```
You are a medical communications content adaptation assistant. Your task is to repurpose the following content for a different channel.

Source content:
[INSERT APPROVED SOURCE CONTENT]

Source channel: [SPECIFY — e.g., HCP slide deck, 20 slides]
Target channel: [SPECIFY — e.g., two-page leave piece, email newsletter for HCPs, website content module]

Target channel requirements:
- Format: [SPECIFY]
- Length: [SPECIFY]
- Structure: [SPECIFY any required sections or format constraints]
- Audience: [SPECIFY if different from source]

Rules:
- Preserve all factual claims exactly as they appear in the source. Do not rephrase in ways that change the meaning.
- Retain all safety information present in the source. Do not cut safety content to save space.
- Maintain reference citations for all claims.
- If the target format requires condensing, prioritise: key efficacy messages, safety information, and the study context.
- Do not add information that is not in the source content.
- Flag any areas where condensing has required significant content reduction with [REVIEW — content reduced].
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Meaning drift through condensing | High | High — a 20-slide deck states "Treatment X met the primary endpoint of ACR50 at Week 12 (p\<0.001)." The condensed leave piece version reads "Treatment X showed significant improvement in joint symptoms." These are not equivalent claims. The condensed version loses the specific endpoint, timepoint, and statistical threshold. | Cross-check every clinical claim in the repurposed version against the approved source. Condensing is where meaning drift is most likely and hardest to catch because the repurposed text reads smoothly. |
| Safety information dropped | Medium | High — a 2-page leave piece derived from a 20-slide deck drops the 3 safety slides entirely to fit the format. The result is an efficacy-only document that would fail fair balance review. | Safety information must be present in every repurposed version. If the format constrains length, compress the safety content — do not remove it. |
| Channel-inappropriate content | Medium | Medium — AI converts slide deck bullet points into prose for a leave piece, but the result reads like expanded bullet points, not a cohesive narrative suitable for a print piece | Have someone familiar with the target channel review the output. A leave piece, email, and website module each have different conventions. |
| New claims introduced | Low | High — during repurposing, AI adds a sentence about mechanism of action or treatment guidelines that was not in the approved source deck | Verify that every statement in the repurposed version traces to the approved source content. New information requires new approval. |
| Reference loss | Medium | Medium — reference superscripts are dropped during reformatting, leaving claims unreferenced in the new version | Check that every referenced claim in the source retains its citation in the repurposed version. Unreferenced claims in promotional content are an MLR rejection risk. |

## Human review checklist

- [ ] All factual claims in the repurposed version match the approved source content
- [ ] Safety information is present and proportionate
- [ ] Reference citations are retained for all claims
- [ ] No new information or claims have been introduced
- [ ] The content genuinely fits the target channel format (not just a shortened/lengthened version)
- [ ] Length and structure meet the target channel requirements
- [ ] Regulatory and compliance requirements for the target channel are met
- [ ] The repurposed version is consistent with the broader campaign or programme
- [ ] Any significant content reductions are flagged for review

## Example output characteristics

Good repurposed content from this workflow should:

- Clearly derive from the source content but feel native to the target channel
- Preserve all key messages and claims from the source
- Include safety information appropriate to the format
- Meet the structural and length requirements of the target channel
- Retain reference citations
- Read naturally in its new format — not like a forced adaptation
- Be immediately usable as a near-final draft for the target channel (after review)

## Next steps

- [Check Promotional Compliance](/workflows/check-promotional-compliance) — if the target channel changes the regulatory context
- [Verify Claims Against References](/workflows/verify-claims-against-references) — confirm claims survived the repurposing
- [Final Human Review](/workflows/final-human-review) — QC the repurposed version before use

---

**Risk tier:** Medium
**Review requirement:** Enhanced review with source cross-check; compliance review if the channel changes the regulatory context
**Workflow version:** 1.0
