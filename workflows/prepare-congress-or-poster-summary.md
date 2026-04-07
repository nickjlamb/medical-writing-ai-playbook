---
title: "Prepare a Congress or Poster Summary"
sidebarTitle: "Congress Summary"
description: "Create structured summaries from scientific posters and congress presentations."
icon: "presentation"
---

## Purpose

Create a structured summary of scientific posters or congress presentations — capturing study design, key findings, and clinical relevance in a format suitable for client briefings, internal reports, or further content development.

## Best used when

- Covering a medical congress and need to produce rapid summaries of relevant presentations
- Summarising multiple posters from a congress into a highlights report
- Creating a structured extraction from a poster to use as source material for further med comms work
- Preparing a quick-turnaround congress debrief for clients or internal stakeholders

## Do not use when

- The poster data is embargoed and you do not have permission to process it
- You need a critical appraisal of the study — this workflow summarises what was presented, not whether the study was well conducted
- The poster content is unclear or incomplete and you cannot verify the information presented
- You need to interpret the data in the context of the competitive landscape — that requires a separate strategic analysis

## Inputs

- The scientific poster (image, PDF, or text extraction)
- Any accompanying abstract or oral presentation slides
- Context on the therapeutic area and why this poster is relevant
- Target format for the summary (e.g., one-page brief, structured extraction, narrative summary)
- Audience for the summary (e.g., medical affairs team, client account lead, publications group)

## Recommended workflow

1. **Obtain the poster** — Ensure you have access to the full poster content, not just the abstract.
2. **Extract structured content** — Use PosterLens to extract key information (study design, endpoints, results, conclusions) into a structured format.
3. **Review the extraction** — Verify that PosterLens has accurately captured the poster content. Check data points, population descriptions, and conclusions.
4. **Draft the summary** — Using the structured extraction as source material, draft the summary in the required format. Use AI to assist with structuring and drafting.
5. **Review against the original poster** — Confirm every data point and finding in the summary matches the poster.
6. **Add context** — If required, add brief therapeutic area context based on your knowledge. Clearly distinguish between information from the poster and contextual information.
7. **Final review** — Confirm accuracy, completeness, and appropriateness for the target audience.

## Where AI helps

- Extracting structured data from visually complex poster layouts rapidly
- Organising poster content into a consistent summary format
- Drafting narrative summaries from structured extractions
- Processing multiple posters in sequence for congress coverage

## Where human judgement is essential

- **Assessing clinical significance.** The poster may report statistically significant results that are not clinically meaningful, or vice versa. The medical writer contextualises this.
- **Selecting what to include.** Not every data point on a poster needs to be in the summary. The writer selects based on relevance to the audience and project.
- **Contextualising within the congress.** A poster exists in the context of other presentations, competitor data, and the evolving evidence landscape. This context comes from the writer's expertise.
- **Verifying data extraction.** Posters can be visually complex, with data in figures, tables, and text. The writer must verify that the extraction captured the correct data.

## Suggested tools

| Tool | Role in this workflow |
|---|---|
| [PosterLens](/tools/posterlens) | Primary tool — structured extraction of poster content |
| [PubCrawl](/tools/pubcrawl) | Optional — find related publications or trial registry data alongside the poster |

## Prompt pattern

```
You are a medical writing assistant. Your task is to create a summary of the following scientific poster presentation.

Format the summary with these sections:
- Poster reference (authors, title, congress, poster number)
- Study design and objective
- Key population characteristics
- Primary results
- Secondary / additional results
- Safety findings (if presented)
- Authors' conclusions
- Relevance / significance (brief — what this adds to the field)

Source material:
[INSERT POSTER CONTENT OR POSTERLENS EXTRACTION]

Target audience for this summary: [SPECIFY]
Target length: [SPECIFY — e.g., 300 words, one page, bullet-point format]

Rules:
- Base the summary only on what is presented in the poster. Do not add data from other sources.
- Reproduce data points exactly as presented.
- If safety data is not presented on the poster, note this explicitly rather than omitting the safety section.
- Flag any data points that are unclear or difficult to read in the source with [VERIFY].
- Do not interpret results beyond what the authors state in their conclusions.
```

## Risks and failure modes

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Data extraction errors | Medium | High — a Kaplan-Meier curve on the poster shows median PFS of 11.2 months. The extraction reads it as 12.1 months from the figure. This incorrect number enters a congress highlights report sent to 30 client stakeholders. | Verify every data point from figures and tables against the original poster. Do not trust AI extraction of data from graphical elements without manual confirmation. |
| Missing data from figures | Medium | Medium — a waterfall plot or forest plot contains key results that the extraction tool misses because the data is encoded visually, not in text | Open the original poster and manually check all figures, tables, and footnotes. Data in visual elements is the most common source of extraction gaps. |
| Overinterpretation | Low–Medium | Medium — the poster reports "a numerical trend toward improvement (not statistically significant)." The summary states "improvement was observed." The qualifier vanishes. | Compare every conclusion and result statement in the summary against the poster's Results and Conclusions sections. |
| Missing safety data | Low | Medium — the poster includes a safety table in a lower panel that the extraction overlooks. The summary reports no safety data when data was in fact presented. | Explicitly scan the full poster for safety content: AE tables, safety narratives, discontinuation data, deaths. Note whether safety data was presented, not just whether the extraction captured it. |
| Context confusion | Low | Medium — when summarising 15 posters from a congress, data from Poster #7 leaks into the summary of Poster #8 because the AI processes them in sequence | Summarise one poster at a time in separate sessions. Verify each summary against its specific poster before moving to the next. |

## Human review checklist

- [ ] Poster reference (authors, title, congress, poster number) is correct
- [ ] Study design is accurately described
- [ ] Population characteristics match the poster
- [ ] All data points are verified against the original poster
- [ ] Results from figures and tables are accurately captured
- [ ] Safety data is included (or noted as not presented)
- [ ] Authors' conclusions are correctly represented
- [ ] No data from other posters or sources has been mixed in
- [ ] Summary format and length meet the project requirements
- [ ] Summary is appropriate for the target audience

## Example output characteristics

A good congress or poster summary from this workflow should:

- Be 200–500 words for a single poster (adjustable based on requirements)
- Follow a consistent structure that allows comparison across multiple poster summaries
- Contain exact data points from the poster
- Distinguish between presented results and the authors' interpretation
- Note when safety data was or was not presented
- Be immediately useful for the target audience (client briefing, internal report, further content development)
- Read as a factual summary, not a promotional interpretation

## Next steps

- [Extract Key Messages](/workflows/extract-key-messages) — pull out the key findings from your poster summary
- [Repurpose Across Channels](/workflows/repurpose-content-across-channels) — adapt the summary for different deliverable formats
- [Summarise a Source Paper](/workflows/summarise-source-paper) — if you also have the full publication

---

**Risk tier:** Low–Medium
**Review requirement:** Standard to enhanced review; verify all data points against the original poster
**Workflow version:** 1.0
