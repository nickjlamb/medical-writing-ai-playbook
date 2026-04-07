---
title: "Extract Key Messages from Evidence"
sidebarTitle: "Extract Key Messages"
description: "Identify and articulate evidence-supported key messages from clinical and scientific sources."
icon: "key"
---

## Purpose

Identify and articulate the key messages supported by a piece of clinical or scientific evidence — structured in a way that can inform content development, messaging frameworks, or stakeholder communications.

## Best used when

- Developing a messaging framework or key message platform for a product or therapeutic area
- Preparing for a content planning meeting where you need to articulate what the evidence supports
- Building a briefing document that connects evidence to communication objectives
- Reviewing new data and identifying what it adds to the existing evidence story

## Do not use when

- You need formally approved promotional claims — key messages extracted here are starting points for development, not approved claims
- The evidence is preliminary or unpublished and the messaging implications require strategic discussion before documentation
- The content will go directly into regulated materials without further development and MLR review

## Inputs

- Full text of the source paper, CSR summary, or data package
- Context on the intended use of the key messages (e.g., HCP communications, internal briefing, payer value story)
- Any existing messaging framework or approved claims for reference
- Therapeutic area context and competitive landscape (if relevant to message framing)

## Recommended workflow

1. **Review the source evidence** — Read the paper or data source yourself. Understand the study, its strengths, and its limitations before asking AI to extract messages.
2. **Provide the full source text and context** — Give the AI the complete source material and specify the intended audience and purpose for the messages.
3. **Generate candidate key messages** — Use the prompt pattern to produce a first set of evidence-based messages.
4. **Review each message against the source** — Verify that every key message is directly supported by the evidence. Check for overstatement, selective emphasis, or unsupported interpretation.
5. **Refine and prioritise** — Edit the messages for accuracy, clarity, and relevance to the project objectives. Remove or flag any messages that go beyond what the evidence supports.
6. **Cross-reference with existing messaging** — If an approved messaging framework exists, check alignment and identify genuinely new messages.
7. **Verify with RefCheckr** — Run the final messages through RefCheckr to confirm source support.

## Where AI helps

- Pulling out candidate messages from a dense 15-page paper in minutes — giving the writer and strategist a structured starting set to evaluate rather than starting from scratch
- Drafting message statements in a consistent format (message + supporting data point + evidence strength + qualifiers) across multiple sources
- Generating 2–3 alternative framings of the same finding so the team can compare and select the strongest evidence-supported version
- Organising messages by theme (efficacy, safety, PROs, practical considerations) to map quickly against an existing messaging framework or content matrix

## Where human judgement is essential

- **Determining which messages matter.** AI will extract everything. The medical writer and strategy team decide which messages are relevant, important, and appropriate for the specific project.
- **Assessing message strength.** Not all data points make strong messages. The writer must judge whether the evidence is robust enough to support a given message.
- **Framing for the audience.** The same finding may need different framing for HCPs, payers, and patients. This is a strategic and editorial decision.
- **Ensuring compliance.** Key messages that will inform promotional content must be reviewed for compliance before use.
- **Contextualising within the evidence landscape.** AI does not know what competitors claim or what the existing evidence base looks like unless told.

## Suggested tools

| Tool | Role in this workflow |
|---|---|
| [PubCrawl](/tools/pubcrawl) | Optional — identify related publications and build the evidence base before extracting messages |
| [RefCheckr](/tools/refcheckr) | Verify that extracted key messages are supported by the cited source |

## Prompt pattern

```
You are a medical writing assistant specialising in evidence-based messaging. Your task is to extract key messages from the following source document.

For each key message:
1. State the message clearly in one sentence
2. Cite the specific data point or finding that supports it (include numbers, endpoints, and statistical results)
3. Note the strength of the supporting evidence (e.g., primary endpoint, secondary endpoint, subgroup analysis, post-hoc)
4. Flag any qualifiers or limitations that should accompany the message

Organise messages into these categories where applicable:
- Efficacy
- Safety and tolerability
- Patient-reported outcomes / quality of life
- Mechanism / pharmacology
- Practical considerations (dosing, administration, etc.)

Rules:
- Base messages only on the provided source. Do not include information from outside the source material.
- Do not overstate findings. If the data shows non-inferiority, do not frame it as superiority. If a result is from a subgroup, say so.
- Include relevant safety messages, not just efficacy highlights.
- Flag any message where the supporting evidence is exploratory or hypothesis-generating.

Source document:
[INSERT FULL TEXT]

Intended use for these messages: [SPECIFY — e.g., HCP slide deck, internal briefing, messaging framework development]
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Overstated messages | High | High — a message states "Treatment X demonstrated superior efficacy" when the trial was designed and powered for non-inferiority. This error, if it enters a messaging framework, contaminates every downstream deliverable. | Review every message against the specific data point cited. Ask: does the evidence actually say this, or does it say something narrower? |
| Cherry-picked findings | Medium | High — AI foregrounds a striking subgroup result (e.g., 40% improvement in patients \<65) while omitting that the overall population result was modest | Require at least one safety/tolerability message and one limitations message for every set of efficacy messages |
| Conflated endpoints | Medium | High — AI merges a primary and secondary endpoint into a single message, making both sound like primary results | Verify each message is attributed to the correct endpoint, analysis type, and population |
| Missing context | Medium | Medium — a message about response rates omits that this was in treatment-experienced patients, making it sound like a first-line result | Check every message for population, subgroup, comparator, and analysis-type qualifiers |
| Promotional framing | Medium | High — AI uses language like "best-in-class" or "transformative" that would immediately be flagged in MLR | Review language for promotional signals before messages are shared with brand or strategy teams. Run through MedCheckr if the messages will inform promotional content. |

## Human review checklist

- [ ] Every key message is directly supported by a specific, cited finding in the source
- [ ] No message overstates the evidence (e.g., non-inferiority framed as superiority)
- [ ] Subgroup and post-hoc findings are clearly identified as such
- [ ] Safety and tolerability messages are included and fairly represent the data
- [ ] Limitations and qualifiers are noted for each message
- [ ] Messages are appropriate for the stated intended use
- [ ] No messages introduce information not present in the source
- [ ] Messages do not use promotional language unless intended for a promotional context and subject to MLR review
- [ ] If an existing messaging framework exists, new messages are consistent or flagged as additions

## Example output characteristics

Good key message output from this workflow should:

- Contain 5–15 key messages, depending on the richness of the source
- Be structured by category (efficacy, safety, PROs, etc.)
- Include specific data points for each message, not just qualitative statements
- Clearly distinguish between primary endpoint results, secondary endpoints, and exploratory findings
- Include at least one safety or tolerability message
- Note limitations or required qualifiers alongside messages
- Use professional, evidence-based language — not promotional superlatives

## Next steps

- [Build a Content Outline](/workflows/build-content-outline) — structure a deliverable around your key messages
- [Verify Claims Against References](/workflows/verify-claims-against-references) — confirm every message is supported by the cited source
- [Adapt for Different Audiences](/workflows/adapt-for-different-audiences) — reframe messages for different stakeholders

---

**Risk tier:** Medium
**Review requirement:** Enhanced review with source cross-check
**Workflow version:** 1.0
