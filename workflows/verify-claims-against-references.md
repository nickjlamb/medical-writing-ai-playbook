---
title: "Verify Claims Against References"
sidebarTitle: "Verify Claims"
description: "Systematically check whether claims in a document are accurately supported by cited references."
icon: "search"
---

## Purpose

Systematically check whether the claims made in a medical communications document are accurately supported by the cited references — identifying unsupported claims, numerical errors, overstatements, and missing qualifiers before the document reaches formal review.

## Best used when

- Preparing content for MLR (Medical, Legal, Regulatory) review and want to pre-check referencing accuracy
- Reviewing a document that cites multiple references across many claims
- Checking a document that has been through several rounds of revision where reference accuracy may have drifted
- Conducting QC on a deliverable before client or internal review

## Do not use when

- You do not have access to the full text of the cited references — partial verification creates a false sense of security
- The document is still in early draft stage with placeholder references — verify once references are finalised
- You are trying to find additional references to support a claim — this workflow verifies existing references, it does not search for new ones

## Inputs

- The document to be verified (with clear claim-to-reference mapping)
- Full text of all cited references
- Any approved messaging framework or key message platform (for context on intended claims)

## Recommended workflow

1. **Prepare the document** — Ensure every verifiable claim has a clear reference citation. Number or label claims if the document does not already do so.
2. **Gather all reference materials** — Obtain the full text of every cited reference. Do not rely on abstracts alone.
3. **Run automated verification** — Use RefCheckr to perform a first-pass comparison of claims against references.
4. **Review flagged items** — For each flag, open the cited reference and verify manually whether the claim is supported, unsupported, or partially supported.
5. **Check unflagged items** — Automated tools do not catch everything. Spot-check claims that were not flagged to confirm accuracy.
6. **Correct and annotate** — Fix inaccurate claims, update references, and document the verification outcome.
7. **Re-verify after changes** — If significant changes were made, run the verification again to confirm corrections.

## Where AI helps

- Rapidly scanning large documents with many claim-reference pairs
- Identifying numerical mismatches (wrong p-values, incorrect percentages, swapped comparator arms)
- Flagging claims that use stronger language than the source supports (e.g., claim says "significantly improved" but source reports a non-significant trend)
- Structuring the verification output into a clear, reviewable format

## Where human judgement is essential

- **Assessing context.** A claim may be technically supported by a reference but used in a context that changes its meaning. Only a trained reviewer can catch this.
- **Evaluating partial support.** Sometimes a reference partially supports a claim. The human reviewer must decide whether the support is sufficient or whether the claim needs to be revised.
- **Checking for omission.** Verification tools check whether cited references support made claims. They do not check whether important information from the references has been omitted from the document.
- **Assessing appropriateness of the reference.** The reference may support the claim but may not be the best or most appropriate source. This is an editorial and scientific judgement.

## Suggested tools

| Tool | Role in this workflow |
|---|---|
| RefCheckr | Primary tool — systematic claim-to-reference comparison |

## Prompt pattern

```
You are a medical writing QC assistant. Your task is to verify the following claims against their cited references.

For each claim:
1. State the claim exactly as it appears in the document
2. Identify the cited reference
3. Find the relevant section of the reference that should support the claim
4. Assess whether the reference supports the claim: SUPPORTED / PARTIALLY SUPPORTED / NOT SUPPORTED / CANNOT VERIFY
5. If partially supported or not supported, explain the discrepancy
6. Flag any numerical mismatches (different p-values, percentages, sample sizes, etc.)
7. Flag any claims where the document uses stronger language than the reference

Document claims:
[INSERT DOCUMENT TEXT OR CLAIM LIST WITH REFERENCE NUMBERS]

Reference materials:
[INSERT REFERENCE TEXTS — one per reference, clearly labelled]

Rules:
- Compare claims strictly against the cited reference. Do not use your general knowledge to fill gaps.
- If a reference does not contain information relevant to the claim, mark it as NOT SUPPORTED by this reference.
- Note any qualifiers in the reference that are missing from the claim (e.g., subgroup, post-hoc, exploratory).
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| False negatives (missed errors) | Medium | High — a detail aid states "Treatment X reduced hospitalisations by 35%" citing Reference 3. The actual figure in Reference 3 is 25%. Automated verification does not flag it because the reference does mention hospitalisations. The error enters MLR review and is caught there — wasting a review cycle. | Spot-check 20–30% of unflagged claims manually. Prioritise claims with specific numerical data, comparative language, or endpoint results. |
| False positives (incorrect flags) | Medium | Low — a claim is flagged as unsupported because the tool could not match the paraphrased language to the reference text. The claim is actually fine. | Review each flag in context before making changes. False positives create review work but not patient or compliance risk. |
| Reference text quality | Medium | Medium — a scanned PDF reference has OCR errors in a results table. The tool reads "p=0.0O3" instead of "p=0.003" and flags a mismatch. | Ensure reference PDFs are high-quality, text-searchable copies. Re-scan or obtain publisher PDFs where possible. |
| Context blindness | Medium | High — a claim about response rates is technically supported by the reference, but the document uses it in a comparative context the reference does not support. The tool sees support; the context is misleading. | Human reviewer must assess each claim in the context of the full document narrative, not just as isolated claim-reference pairs. |
| Scope limitations | Low | Medium — verification confirms that claims are supported by cited references. It does not check whether the cited reference is the best available evidence, or whether newer data exists. | Reference selection quality is a separate editorial and scientific judgement — not part of this workflow. |

## Human review checklist

- [ ] All flagged claims have been manually reviewed against the cited reference
- [ ] A sample of unflagged claims has been spot-checked for accuracy
- [ ] Numerical data (p-values, CIs, percentages, sample sizes) has been verified against source
- [ ] Claims use language consistent with the strength of evidence in the source (no overstatement)
- [ ] Qualifiers present in the source are preserved in the claims (subgroup, post-hoc, exploratory, etc.)
- [ ] Safety claims are verified with the same rigour as efficacy claims
- [ ] Any "NOT SUPPORTED" or "PARTIALLY SUPPORTED" flags have been resolved
- [ ] Changes made during verification have been documented
- [ ] The document is ready for formal review with reference accuracy confirmed

## Example output characteristics

Good verification output from this workflow should:

- Cover every verifiable claim in the document
- Provide a clear verdict for each claim (SUPPORTED, PARTIALLY SUPPORTED, NOT SUPPORTED, CANNOT VERIFY)
- Include the specific location in the reference where support was found (or where it was expected but absent)
- Flag numerical discrepancies with exact values from both the document and the reference
- Highlight language strength mismatches (document says "significant," reference says "trend")
- Be structured in a format that allows the reviewer to work through it systematically

## Next steps

- [Check Promotional Compliance](/workflows/check-promotional-compliance) — pre-screen for compliance signals after verifying references
- [Final Human Review](/workflows/final-human-review) — complete the QC process before submission

---

**Risk tier:** High
**Review requirement:** Expert review — verification results must be assessed by a qualified medical writer or reviewer
**Workflow version:** 1.0
