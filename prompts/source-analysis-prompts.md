---
title: "Source Analysis Prompts"
description: "Prompt patterns for extracting, structuring, and summarising clinical and scientific source materials."
icon: "file-search"
---

Prompt patterns for extracting, structuring, and summarising clinical and scientific source materials. Each pattern is designed for a specific source analysis task. Customise the therapeutic area, output format, and focus areas for your project.

---

## 1. Structured Paper Summary

**Use with:** [Summarise a source paper](/workflows/summarise-source-paper)

```
You are a medical writing assistant. Summarise the following published paper into a structured format.

Sections:
- Citation
- Study design and objective
- Population (key criteria, sample size)
- Primary endpoint and results
- Key secondary endpoints and results
- Safety findings
- Authors' conclusions
- Limitations

Rules:
- Use only information from the provided paper
- Reproduce all data points exactly as stated
- Label subgroup or post-hoc results explicitly
- Do not interpret beyond the authors' stated conclusions
- Flag uncertain data points with [VERIFY]

Paper:
[INSERT FULL TEXT]
```

---

## 2. Focused Data Extraction

**Use when:** You need specific data points from a paper, not a full summary.

```
You are a medical writing assistant. Extract the following specific data points from the provided paper.

Data points needed:
- Primary endpoint: definition, result, statistical significance
- Key secondary endpoints: definitions, results, statistical significance
- Safety: most common adverse events (≥5%), serious adverse events, discontinuations due to AEs
- Population: total enrolled, total analysed (ITT and PP if applicable), key demographics

Present the data in a table format where possible. Cite the specific section, table, or figure for each data point.

Rules:
- Extract only what is stated in the paper
- If a requested data point is not reported, state "Not reported"
- Distinguish between ITT, mITT, and per-protocol populations
- Include confidence intervals where reported

Paper:
[INSERT FULL TEXT]
```

---

## 3. Comparative Summary (Two Papers)

**Use when:** Summarising two papers on the same topic or comparing study results.

```
You are a medical writing assistant. Create a comparative summary of the following two papers.

Structure:
- Brief summary of each study (design, population, primary endpoint)
- Comparison table: key endpoints side by side
- Key differences in design, population, or methodology
- Key differences in results
- Authors' conclusions compared

Rules:
- Present each study's results as reported. Do not make cross-study statistical comparisons.
- Note differences in study design that make direct comparison difficult
- Do not state that one study is "better" or "stronger" than the other
- Flag any areas where comparison is not appropriate due to design differences

Paper 1:
[INSERT FULL TEXT]

Paper 2:
[INSERT FULL TEXT]
```

---

## 4. Safety-Focused Extraction

**Use when:** The project requires detailed safety data extraction.

```
You are a medical writing assistant specialising in safety data. Extract and summarise the safety findings from the following paper.

Structure:
- Overall safety population and exposure
- Most common adverse events (present all reported, with frequencies)
- Serious adverse events (with frequencies)
- Adverse events leading to discontinuation
- Deaths (if reported)
- Adverse events of special interest (if identified in the study)
- Authors' safety conclusions

Rules:
- Report all adverse event data as presented. Do not selectively report.
- Include both treatment and comparator arm data
- Include confidence intervals and p-values where reported
- Note the timeframe for safety reporting
- If safety data is limited (e.g., short follow-up), note this

Paper:
[INSERT FULL TEXT]
```

---

## 5. Poster Content Extraction

**Use with:** [Prepare a congress or poster summary](/workflows/prepare-congress-or-poster-summary) and PosterLens

```
You are a medical writing assistant. Extract and structure the key information from the following scientific poster.

Structure:
- Poster reference (authors, title, congress, number)
- Background / rationale
- Study design and objective
- Population
- Key results (efficacy)
- Safety results (if presented)
- Authors' conclusions

Rules:
- Extract only what is on the poster
- If data is presented in figures, extract the key values and note they are from figures
- If safety data is not on the poster, state "Safety data not presented on this poster"
- Flag any data points that are unclear with [VERIFY]

Poster content:
[INSERT POSTER TEXT OR EXTRACTION]
```

---

## Customisation notes

- **Therapeutic area:** Add specific instructions for the relevant TA (e.g., "For oncology, include ORR, PFS, and OS if reported")
- **Output length:** Specify target word count or format constraints
- **Focus areas:** Add or remove sections based on what the project needs
- **Multiple sources:** For literature reviews with many papers, use the Focused Data Extraction pattern for consistency across sources

---

**Related workflows:**
- [Summarise a source paper](/workflows/summarise-source-paper)
- [Extract key messages](/workflows/extract-key-messages)
- [Prepare a congress or poster summary](/workflows/prepare-congress-or-poster-summary)
