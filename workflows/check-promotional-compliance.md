---
title: "Check Promotional Compliance"
sidebarTitle: "Compliance Check"
description: "Pre-screen content for promotional compliance signals before formal MLR review."
icon: "shield"
---

## Purpose

Pre-screen medical communications content for language patterns and claim structures that may raise promotional compliance concerns — helping medical writers identify and address potential issues before content reaches formal MLR (Medical, Legal, Regulatory) review.

## Best used when

- Preparing promotional or semi-promotional content for MLR submission
- Self-checking a draft before sending it for internal review
- Reviewing content that has been adapted or repurposed and may have introduced compliance-sensitive language
- Training or onboarding writers who are building familiarity with promotional compliance standards

## Do not use when

- You need formal regulatory or legal clearance — this workflow is a pre-screening support tool, not a compliance determination
- The content is clearly non-promotional and not subject to advertising code review
- You are relying on this check as a substitute for MLR review — it is not
- You do not have access to the applicable advertising code or regulatory framework for the target market

## Inputs

- The document or content to be reviewed
- The applicable regulatory or advertising code context (e.g., ABPI Code, IFPMA Code, FDA promotional regulations)
- The approved prescribing information, SmPC, or USPI for the product (for reference claims)
- Any approved messaging framework or claims matrix
- The intended channel and audience for the content

## Recommended workflow

1. **Prepare a near-final draft** — Compliance pre-screening is most valuable on content that is close to submission. Running it on rough drafts generates noise.
2. **Identify the applicable code and context** — Know which advertising code or regulatory framework applies. Different markets have different requirements.
3. **Run MedCheckr** — Submit the content for automated compliance signal scanning.
4. **Review flagged items in context** — Assess each flag against the applicable code and the approved messaging framework. Not every flag is a genuine issue.
5. **Cross-check claims against references** — Use the [Verify claims against references](/workflows/verify-claims-against-references) workflow or RefCheckr to confirm that claims are supported.
6. **Revise as needed** — Address genuine compliance concerns in the content.
7. **Document changes** — Record what was flagged, what was changed, and why.
8. **Proceed to formal MLR review** — Submit the revised content through your standard approval process. This pre-screening supports MLR — it does not replace it.

## Where AI helps

- Scanning text for superlative and comparative language that may require substantiation
- Identifying potential off-label implications or suggestions
- Flagging areas where fair balance may be insufficient
- Detecting language patterns commonly flagged in MLR review (e.g., unqualified superiority claims, emotive language, implied guarantees)
- Highlighting inconsistencies between claims and cited references

## Where human judgement is essential

- **Interpreting flags.** Not every flagged item is a problem. A superlative may be appropriate if substantiated. A comparative claim may be acceptable if referenced. The reviewer must assess each flag in context.
- **Applying the correct code.** Advertising codes differ by market, audience, and content type. The human reviewer must know which rules apply.
- **Assessing fair balance.** Whether the balance of efficacy and safety information is appropriate depends on the specific content, audience, and context. This is an expert judgement.
- **Determining off-label risk.** Whether a statement implies off-label use depends on the approved indication, the context, and the audience. AI can flag potential issues, but a qualified reviewer must assess them.
- **Final compliance sign-off.** Compliance is signed off by qualified professionals (medical, legal, regulatory). This workflow supports their work — it does not replace their authority.

## Suggested tools

| Tool | Role in this workflow |
|---|---|
| MedCheckr | Primary tool — automated compliance signal detection |
| RefCheckr | Supporting tool — verify that promotional claims are supported by cited references |

## Prompt pattern

```
You are a medical communications compliance review assistant. Your task is to pre-screen the following content for potential promotional compliance issues.

Content to review:
[INSERT CONTENT]

Product: [SPECIFY]
Approved indication(s): [SPECIFY]
Target audience: [SPECIFY — e.g., oncologists, general practitioners]
Intended channel: [SPECIFY — e.g., detail aid, leave piece, HCP website, conference stand]

Review the content for:
1. Superlative or comparative claims that may require substantiation
2. Language that implies efficacy or outcomes beyond what is supported by the cited references
3. Potential off-label implications or suggestions
4. Areas where safety information may be insufficient relative to efficacy claims (fair balance)
5. Emotive or promotional language that may not be appropriate for the content type
6. Claims that appear to extend beyond the approved indication
7. Unqualified statements that may need hedging or qualification based on the evidence

For each issue found:
- Quote the relevant text
- Describe the potential concern
- Suggest what type of revision may be needed
- Rate the concern: LOW / MEDIUM / HIGH

Rules:
- Flag potential issues for human review. Do not make definitive compliance determinations.
- Consider the content type and audience when assessing — language appropriate for a scientific publication may not be appropriate for a promotional piece.
- If you cannot determine whether something is an issue without access to the full reference, flag it for verification.
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Over-reliance on pre-screening | Medium | High — a team runs MedCheckr, gets a clean result, and reduces their own compliance review effort. MLR catches an off-label implication the tool missed. The team loses credibility with the MLR committee. | State explicitly in project documentation and team briefings: pre-screening informs your review; it does not replace it. A clean scan means the tool found nothing — not that nothing is there. |
| False sense of security | Medium | High — a writer submits a detail aid for MLR after a clean MedCheckr scan without doing their own read-through. MLR returns it with 8 comments. The pre-screening missed contextual issues the tool was never designed to catch. | Always complete your own compliance review after pre-screening. Use MedCheckr results as a checklist of additional items to verify, not as a pass/fail gate. |
| False positives | High | Low — MedCheckr flags 20 items on a leave piece, including flagging appropriate use of "demonstrated" and "significant" that are fully substantiated. The writer wastes time reviewing valid language. | Expect false positives. Calibrate your team's expectations: a flag is a prompt to check, not a finding. With experience, reviewers learn which flag types to prioritise. |
| Market-specific gaps | Medium | Medium — content is intended for a market governed by the PMCPA Code. The pre-screen catches general patterns but misses a UK-specific fair balance requirement. | Always specify the applicable code when running pre-screening. Have a reviewer with market-specific expertise assess the results. |
| Evolving regulations | Low | Medium — a new ABPI Code clause took effect last quarter. The pre-screening tool does not reflect the update. A recently prohibited phrasing passes undetected. | Check compliance results against the current published code, not against the tool's training data. Subscribe to code updates from the relevant body. |

## Human review checklist

- [ ] All flagged items have been assessed in context by a qualified reviewer
- [ ] Superlative and comparative claims are substantiated by cited references
- [ ] Fair balance of efficacy and safety information is appropriate for the content type and audience
- [ ] No off-label implications or suggestions are present
- [ ] Claims are consistent with the approved indication(s)
- [ ] Language is appropriate for the content type and channel
- [ ] Prescribing information or SmPC references are included where required
- [ ] The content is consistent with any approved messaging framework or claims matrix
- [ ] Changes made during pre-screening are documented
- [ ] The content is ready for formal MLR review

## Example output characteristics

Good compliance pre-screening output from this workflow should:

- Identify 3–15 potential issues per typical promotional piece (fewer indicates a clean draft or possibly insufficient screening)
- Categorise each issue clearly with the relevant text quoted
- Provide actionable guidance on what type of revision may address the concern
- Distinguish between high-priority issues (e.g., potential off-label claim) and lower-priority style concerns
- Not make definitive compliance rulings — always framed as flags for human review
- Include a note that formal MLR review is still required

## Next steps

- [Verify Claims Against References](/workflows/verify-claims-against-references) — confirm claims are supported before MLR submission
- [Final Human Review](/workflows/final-human-review) — complete QC before the deliverable enters the approval queue

---

**Risk tier:** High
**Review requirement:** Expert review by compliance-qualified reviewer; formal MLR review required before use
**Workflow version:** 1.0

---

**Important note:** This workflow and the tools it references do not provide legal, regulatory, or compliance advice. They are designed to help medical writers identify potential issues earlier in the content development process. Formal compliance determination is the responsibility of qualified Medical, Legal, and Regulatory professionals.
