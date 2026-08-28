"""Generate the README diagrams (light + dark) for the Medical Writing AI Playbook.

    python3 scripts/gen_diagrams.py

Writes assets/architecture-{light,dark}.svg and assets/build-{light,dark}.svg.
"""

import os

FONT = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif"
MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace"

THEMES = {
    "light": dict(text="#1f2328", muted="#59636e", border="#d0d7de", panel="#f6f8fa",
                  node="#ffffff", accent="#8250df", accent_soft="#fbf0ff",
                  green="#1a7f37", green_fill="#dafbe1", green_border="#aceebb",
                  edge="#8c959f"),
    "dark": dict(text="#e6edf3", muted="#9198a1", border="#3d444d", panel="#151b23",
                 node="#212830", accent="#ab7df8", accent_soft="#2a2139",
                 green="#3fb950", green_fill="#122117", green_border="#2b5233",
                 edge="#767d86"),
}


def helpers(s, c):
    def txt(x, y, t, size=11, fill=None, weight=None, anchor="start", mono=False,
            style=None, rot=None):
        a = [f'x="{x}"', f'y="{y}"', f'font-size="{size}"', f'fill="{fill or c["text"]}"']
        if weight: a.append(f'font-weight="{weight}"')
        if anchor != "start": a.append(f'text-anchor="{anchor}"')
        if mono: a.append(f'font-family="{MONO}"')
        if style: a.append(f'font-style="{style}"')
        if rot: a.append(f'transform="rotate({rot} {x} {y})"')
        s.append(f'<text {" ".join(a)}>{t}</text>')

    def panel(x, y, w, h, title):
        s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" '
                 f'fill="{c["panel"]}" stroke="{c["border"]}"/>')
        txt(x + 18, y + 26, title, 11, c["muted"], "600")

    def node(cx, y, w, h, title, sub=None, fill=None, stroke=None, tcol=None, mono=False):
        x = cx - w / 2
        s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" '
                 f'fill="{fill or c["node"]}" stroke="{stroke or c["border"]}"/>')
        if sub:
            txt(cx, y + 23, title, 12.5, tcol or c["text"], "600", "middle")
            txt(cx, y + 41, sub, 10.5, c["muted"], anchor="middle", mono=mono)
        else:
            txt(cx, y + h / 2 + 4.5, title, 12.5, tcol or c["text"], "600", "middle")

    def line(pts, marker="a", col=None, dash=False):
        col = col or c["edge"]
        p = " ".join(f"{x},{y}" for x, y in pts)
        d = ' stroke-dasharray="5 4"' if dash else ""
        s.append(f'<polyline points="{p}" fill="none" stroke="{col}" stroke-width="1.5"{d} '
                 f'marker-end="url(#{marker})"/>')
    return txt, panel, node, line


def defs(c):
    return ('<defs>'
            f'<marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
            f'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{c["edge"]}"/></marker>'
            f'<marker id="ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
            f'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{c["green"]}"/></marker>'
            f'<marker id="ap" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
            f'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{c["accent"]}"/></marker>'
            '</defs>')


# ── 1. architecture ───────────────────────────────────────────────
def architecture(c):
    W, H = 1000, 582
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="{FONT}" '
         'role="img" aria-label="How the playbook is organised: five principles govern every '
         'workflow; eighteen workflows run left to right across the content lifecycle — evidence '
         '(5), drafting (6), adaptation (2), validation (3) and delivery (2); and a shared layer '
         'of prompt patterns, templates and tools is reused by every stage. Every workflow card '
         'carries the same five parts: the task, the human verification, the risk tier, the prompt '
         'pattern and the failure modes.">']
    s.append(defs(c))
    txt, panel, node, line = helpers(s, c)

    # principles
    panel(16, 52, 968, 108, "PRINCIPLES &#183; HOW TO DECIDE")
    principles = ["Human-in-the-loop", "Source grounding", "Risk levels",
                  "Review &amp; accountability", "Disclosure &amp; regulation"]
    for i, p in enumerate(principles):
        node(126 + i * 187, 96, 172, 44, p, stroke=c["accent"], tcol=c["accent"])

    line([(500, 162), (500, 206)], "ap", c["accent"])
    txt(512, 190, "govern every workflow", 11, c["accent"], "600")

    # workflows
    panel(16, 208, 968, 152, "WORKFLOWS &#183; WHAT TO DO &#183; 18 IN TOTAL")
    stages = [("Evidence", "5 workflows"), ("Drafting", "6 workflows"),
              ("Adaptation", "2 workflows"), ("Validation", "3 workflows"),
              ("Delivery", "2 workflows")]
    for i, (t, sub) in enumerate(stages):
        node(120 + i * 190, 256, 160, 58, t, sub)
    for gx in (200, 390, 580, 770):
        line([(gx, 285), (gx + 28, 285)])
    txt(500, 344, "the content development lifecycle, start to MLR-ready", 11,
        c["muted"], anchor="middle", style="italic")

    # shared
    line([(500, 404), (500, 364)], "a")
    txt(512, 390, "reused by every stage", 11, c["muted"])
    panel(16, 406, 968, 108, "SHARED &#183; REUSED EVERYWHERE")
    for i, t in enumerate(["Prompt patterns", "Templates", "Tools"]):
        node(185 + i * 315, 450, 290, 44, t)

    # the auditability claim
    txt(500, 546, "Every workflow card carries the same five parts &#8212; the task &#183; the human "
        "verification &#183; the risk tier &#183; the prompt pattern &#183; the failure modes",
        11.5, c["text"], "600", "middle")
    txt(500, 568, "AI for acceleration, not authority. Translation, not invention.",
        12.5, c["accent"], "700", "middle")

    s.append("</svg>")
    return "\n".join(s)


# ── 2. build & ship ───────────────────────────────────────────────
def build_ship(c):
    W, H = 1000, 330
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="{FONT}" '
         'role="img" aria-label="How it builds and ships: MDX content and docs.json are pushed to '
         'main, which triggers two builds in parallel — a Mintlify build that publishes '
         'playbook.pharmatools.ai, and a GitHub Actions workflow that renders the PDF with '
         'Puppeteer and attaches it to GitHub Releases. The site download link passes through a '
         'Cloudflare Worker counter, so the PDF served is always current.">']
    s.append(defs(c))
    txt, panel, node, line = helpers(s, c)

    panel(16, 52, 968, 248, "BUILD &#183; ON EVERY PUSH TO MAIN")

    node(120, 170, 180, 56, "MDX content", "+ docs.json")
    line([(210, 198), (232, 198)])
    node(310, 170, 150, 56, "push to main")

    # fork
    line([(385, 198), (410, 198), (410, 114), (438, 114)])
    line([(385, 198), (410, 198), (410, 244), (438, 244)])

    node(530, 88, 180, 52, "Mintlify build")
    line([(620, 114), (688, 114)], "ag", c["green"])
    node(790, 88, 200, 52, "playbook.pharmatools.ai", None,
         fill=c["green_fill"], stroke=c["green_border"], tcol=c["green"])

    node(530, 216, 180, 56, "GitHub Actions", "build-pdf.yml", mono=True)
    line([(620, 244), (688, 244)], "ag", c["green"])
    node(790, 216, 200, 56, "PDF in Releases", "Puppeteer &#183; build-pdf.mjs",
         fill=c["green_fill"], stroke=c["green_border"], tcol=c["green"], mono=True)

    # download link through the counter
    line([(790, 140), (790, 152)], "a", dash=True)
    node(790, 154, 220, 44, "Cloudflare Worker", "download counter")
    line([(790, 198), (790, 214)], "a", dash=True)

    txt(500, 322, "The PDF rebuilds on every content change &#8212; the download link always serves "
        "current content.", 11.5, c["muted"], anchor="middle", style="italic")

    s.append("</svg>")
    return "\n".join(s)


os.makedirs("assets", exist_ok=True)
for name, pal in THEMES.items():
    for fn, base in ((architecture, "architecture"), (build_ship, "build")):
        p = f"assets/{base}-{name}.svg"
        open(p, "w", encoding="utf-8").write(fn(pal))
        print("wrote", p)
