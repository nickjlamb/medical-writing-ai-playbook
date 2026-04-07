---
title: "Final Human Review Before Use"
sidebarTitle: "Final Review"
description: "Structured final review process for AI-assisted deliverables before submission or publication."
icon: "clipboard-check"
---

## Purpose

Provide a structured final review process for any AI-assisted medical communications deliverable before it is submitted, shared, or published — ensuring accuracy, completeness, compliance, and quality meet the required standards.

## Best used when

- Any AI-assisted deliverable is nearing completion and needs final QC
- Content has been through development workflows and is ready for sign-off
- You are the named reviewer responsible for approving AI-assisted content
- Preparing content for MLR review, client submission, or publication

## Do not use when

- The content is still in early development — this is a final review, not an editorial review
- You are the only person who has seen the content — final review should ideally be performed by someone other than the primary author
- You do not have access to the source materials — you cannot verify accuracy without the sources

## Inputs

- The deliverable to be reviewed (near-final version)
- All source materials used in its development
- The workflow documentation showing how the content was developed (which AI tools were used, which workflows were followed)
- Any approved messaging framework, claims matrix, or brief
- The applicable review checklist (from the workflow card or the [review checklist template](/templates/review-checklist-template))

## Recommended workflow

1. **Read the deliverable in full** — Before checking details, read the entire piece to assess overall quality, flow, and coherence.
2. **Check the workflow trail** — Review which workflows and AI tools were used. This tells you where to focus your verification effort.
3. **Verify accuracy against sources** — Use RefCheckr and manual checking to confirm that every claim, data point, and conclusion is supported by the cited sources.
4. **Run compliance pre-screening** — For promotional or compliance-sensitive content, use MedCheckr as one input to your compliance assessment.
5. **Complete the review checklist** — Work through the applicable checklist systematically. Do not skip sections.
6. **Assess AI-specific risks** — Specifically check for hallucinated content, meaning drift, unsourced claims, and the other failure modes documented in the relevant workflow cards.
7. **Make corrections** — Fix any issues found. Document changes.
8. **Final sign-off** — If the deliverable meets all requirements, sign off. If not, return for revision with specific feedback.

## Where AI helps

AI plays a supporting role in this workflow, not a primary one. Final review is fundamentally a human activity. AI can support it by:

- Running automated reference verification (RefCheckr) as one input to the accuracy check
- Running automated compliance signal scanning (MedCheckr) as one input to the compliance assessment
- Generating a structured comparison between the deliverable and source materials to support manual verification

## Where human judgement is essential

This entire workflow is a human judgement exercise. Specifically:

- **Overall quality assessment.** Does the deliverable meet the expected standard for its type and audience? AI cannot make this judgement.
- **Contextual accuracy.** Are claims used appropriately in context, not just technically accurate? A data point can be correct but misleading if used in the wrong context.
- **Completeness.** Is anything missing that should be there? AI checks what is present — a human assesses what is absent.
- **Appropriateness.** Is the tone, depth, and framing right for the audience, channel, and purpose?
- **Compliance sign-off.** Is the content ready for the next stage of review (MLR, client review, publication)?
- **Accountability.** The reviewer who signs off is accountable for the deliverable's quality, regardless of how it was produced.

## Suggested tools

| Tool | Role in this workflow |
|---|---|
| RefCheckr | Supporting tool — automated reference accuracy check as one input to the review |
| MedCheckr | Supporting tool — automated compliance signal scan for promotional content |

## Prompt pattern

The final human review workflow is primarily manual. However, AI can support the process:

```
You are a medical writing QC assistant. Your task is to help me review the following deliverable against its source materials.

Deliverable:
[INSERT DELIVERABLE TEXT]

Source materials:
[INSERT SOURCE TEXTS]

Please check:
1. Does every factual claim in the deliverable have support in the source materials?
2. Are all data points (numbers, statistics, endpoints) accurately reproduced?
3. Are there any statements in the deliverable that appear to go beyond what the sources support?
4. Are qualifiers present in the sources (subgroup, post-hoc, exploratory, specific population) preserved in the deliverable?
5. Is safety information present and proportionate to the efficacy content?

For each issue found, quote the relevant text from the deliverable and explain the concern.

Note: This is a support tool for my review. I will verify all findings manually.
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Review fatigue | Medium | High — a reviewer QCs five AI-generated summaries in one session. By the fourth, they are scanning for flow rather than verifying data points. An incorrect confidence interval passes through and enters a client slide deck. | Use the structured checklist for every review — do not rely on reading for "feel." Limit AI-assisted QC to 3 documents per session. Alternate AI-assisted reviews with other tasks. |
| Over-reliance on automated tools | Medium | High — RefCheckr returns no flags on a manuscript summary. The reviewer concludes reference accuracy is confirmed and moves on. In fact, one claim cites the wrong reference entirely — a mismatch the tool did not detect because it checks claims against cited references, not whether the right reference was cited. | Automated tools are one layer of the review. They catch pattern-level issues. Contextual accuracy, reference selection, and completeness require human assessment. |
| Incomplete source access | Low–Medium | High — the reviewer has the paper's abstract but not the full text. They cannot verify a subgroup result cited in the deliverable. They pass it, assuming it is correct. It is not. | Before starting final review, confirm you have full-text access to every cited reference. If a reference is unavailable, flag the supported claims as unverified and resolve before sign-off. |
| Confirmation bias | Medium | Medium — the reviewer wrote the brief and has been involved in the project for weeks. They expect the content to be correct and read to confirm rather than to challenge. AI-generated errors that "look right" pass through unchallenged. | Approach final review as adversarial verification. Assume errors are present and your job is to find them. Where possible, have someone other than the primary author perform final QC. |
| Accountability gap | Low | High — a deliverable was AI-assisted by one writer, edited by another, and reviewed by a third. No one is clearly accountable for the final content. When a data error is found post-delivery, responsibility is unclear. | Document the reviewer name, review date, and review outcome. The sign-off reviewer is accountable, regardless of who produced the draft. |

## Human review checklist

### Accuracy
- [ ] Every factual claim is supported by the cited source
- [ ] All numerical data matches the source exactly
- [ ] Study design, populations, and endpoints are correctly described
- [ ] Conclusions match the authors' stated conclusions
- [ ] No hallucinated content, data, or citations

### Completeness
- [ ] All key messages from the brief are addressed
- [ ] Safety information is present and proportionate
- [ ] Limitations are noted where appropriate
- [ ] Qualifiers are preserved (subgroup, post-hoc, exploratory)

### Compliance (where applicable)
- [ ] Claims are within the approved messaging framework
- [ ] Fair balance is maintained
- [ ] No off-label implications
- [ ] References are correctly cited
- [ ] Prescribing information requirements are met

### Quality
- [ ] Language is appropriate for the specific audience and channel (not just generically "professional")
- [ ] Structure and narrative flow support the deliverable's objective — a reader should follow the logic without needing to backtrack
- [ ] Length meets the brief requirements and is proportionate across sections (efficacy does not dominate at the expense of safety or context)
- [ ] Medical terminology is used correctly, consistently, and at the right level for the audience
- [ ] No grammatical, spelling, or formatting errors — including reference numbering, table formatting, and figure callouts

### AI-specific checks
- [ ] Sections that used AI assistance are identified and specifically reviewed
- [ ] No unsourced content from AI training data
- [ ] No meaning drift from AI transformation or adaptation
- [ ] No merged findings from different sources or study arms
- [ ] Automated verification results (RefCheckr, MedCheckr) have been reviewed and acted on

### Documentation
- [ ] AI tools and workflows used are documented
- [ ] Changes made during review are tracked
- [ ] Review outcome is recorded
- [ ] Reviewer identity and date are documented

## Example output characteristics

The output of this workflow is not a content deliverable — it is a review decision:

- **Approved** — The deliverable meets all accuracy, completeness, compliance, and quality requirements. Documented with reviewer name and date.
- **Approved with minor changes** — Small corrections identified and made. Changes documented. Deliverable proceeds.
- **Returned for revision** — Significant issues identified. Specific, actionable feedback provided. Deliverable returned to the writer.
- **Rejected** — Fundamental accuracy or compliance issues. Full rework required. Specific reasons documented.

A good final review process should result in documented evidence that the deliverable was systematically checked against sources, reviewed for compliance where applicable, and assessed for overall quality — with a named individual accountable for the outcome.

## Related workflows

This review workflow applies to every AI-assisted deliverable. The most common paths leading here:

- [Verify Claims Against References](/workflows/verify-claims-against-references) — reference accuracy check before final review
- [Check Promotional Compliance](/workflows/check-promotional-compliance) — compliance pre-screening before final review
- [Create a Plain Language Summary](/workflows/create-plain-language-summary) — PLS requires expert final review before publication

---

**Risk tier:** Critical — this workflow is the final quality gate
**Review requirement:** This IS the review. The reviewer must be qualified for the content type and risk tier.
**Workflow version:** 1.0
