# Contributing

Thanks for wanting to improve the playbook. It is a free professional resource, and the fastest way to make it better is to tell me where it is wrong.

## The most useful thing you can do

**Report content that has gone stale.** Journal policies, regulator positions and tool capabilities change constantly, and this playbook makes specific factual claims about all three. If you know that a journal has changed its AI policy, a regulator has published new guidance, or a tool no longer works the way a page describes — that is the highest-value contribution there is.

[Open an issue →](https://github.com/nickjlamb/medical-writing-ai-playbook/issues/new/choose)

Also welcome:

- Broken links, typos, formatting problems
- Workflow suggestions — a task you run regularly that the playbook does not cover
- Prompt patterns that work well in practice
- Corrections to risk tiers or review requirements that do not match how your organisation actually operates

## How contributions work

The playbook is **editorially owned**. Everything in it has to hold up in front of an MLR reviewer or a journal editor, which means one person needs to be accountable for what it says. So the process is deliberately conversational:

- **Issues are always open.** Corrections, suggestions and questions — no need to ask first.
- **For anything beyond a typo, open an issue before a pull request.** A new workflow card or a substantive rewrite involves editorial decisions about scope, risk tier and house voice. Much better to agree the shape first than to have you write something that then needs reworking.
- **Small PRs are fine unprompted** — a fixed link, a corrected date, a clearer sentence.

I would rather have a two-line issue that turns out to be right than a polished PR that has to be turned down.

## If you are writing a page

House rules, so contributions read as part of the same document:

**Every factual claim gets a source.** Journal policies link to the publisher's own policy page. Regulatory claims link to the regulation or the agency. If a claim cannot be sourced, it does not go in.

**Link out, do not restate.** Policy details change. Cite and link rather than reproducing a table that will be wrong in six months.

**Every workflow card has the same five parts** — the task AI can handle and its boundary, the human verification steps, the risk tier, the prompt pattern, and the failure modes. See any existing card in [`workflows/`](workflows/) for the shape.

**Voice.** British spelling. Plain language over jargon — the reader is an expert medical writer, not an expert in AI. Say what a thing does before you name it. Short sentences do more work than long ones.

**Risk tiers are not decorative.** If you tier a workflow, be able to say what happens when it goes wrong and what review that implies.

**No unsourced time savings.** Estimates on workflow pages are per deliverable and should reflect real practice.

## Running it locally

```bash
git clone https://github.com/nickjlamb/medical-writing-ai-playbook.git
cd medical-writing-ai-playbook
npx mint dev          # live preview at http://localhost:3000
```

The site is [Mintlify](https://mintlify.com). Pages are MDX; navigation lives in `docs.json` — a new page needs adding there or it will not appear in the sidebar.

To rebuild the PDF locally:

```bash
npm ci
npm run build:pdf
```

## Before you open a PR

- [ ] Page added to `docs.json` navigation, if new
- [ ] Every factual claim linked to a primary source
- [ ] Relative links resolve (`.mdx` files, not `.md`)
- [ ] `npx mint dev` renders it without errors
- [ ] Changelog entry added, if the change is substantive
- [ ] British spelling

## Licence

Content contributions are accepted under [CC BY 4.0](LICENSE); code contributions under [MIT](LICENSE-CODE). By opening a pull request you agree your contribution may be published under those terms.

## Anything else

Open an issue, or find me via [PharmaTools.AI](https://pharmatools.ai).
