#!/usr/bin/env python3
"""Build the public, static AI Ecosystem reader from the report working tree.

Only the explicit PUBLIC_CHAPTERS and PUBLIC_ASSETS below are copied.  This is
deliberately not a generic directory exporter: research ledgers, reviewer
material, credentials, and unpublished source notes never enter the site.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

PUBLIC_CHAPTERS = [
    ("01-executive-summary.md", "01", "Executive Summary", "summary"),
    ("02-research-academia.md", "02", "AI Research", "research"),
    ("04-education.md", "03", "AI Education", "education"),
    ("05-infrastructure-and-compute.md", "04", "AI Infrastructure and Compute", "infrastructure"),
    ("03-industry.md", "05", "AI Industry", "industry"),
    ("06-government-support-and-coordination.md", "06", "The Role of Government", "government"),
    ("07-ai-community.md", "07", "AI Community", "community"),
    ("ai-literacy.md", "08", "AI Literacy", "literacy"),
    ("08-gaps-challenges-outlook.md", "09", "Overall Assessment", "assessment"),
]

PUBLIC_ASSETS = {
    "ysu-supercomputer-center-print.jpg", "eleveight-ai-factory-print.jpg",
    "firebird-facility-print.jpg", "generation-ai-graduation-print.jpg",
    "datafest-yerevan-2025-print.jpg", "ai-conf-armenia-2026-print.jpg",
    "pydata-pycon-yerevan-2026-print.jpg", "yandex-hall-ml-opentalk-print.jpg",
    "hack-armenia-2026-print.jpg",
}

PHOTOS = {
    "Yerevan State University": ("ysu-supercomputer-center-print.jpg", "YSU supercomputer center", "Office of the Prime Minister of Armenia", "https://www.primeminister.am/en/press-release/item/2026/01/13/Nikol-Pashinyan-13-01#"),
    "Eleveight AI": ("eleveight-ai-factory-print.jpg", "Inside the Eleveight AI factory", "Armenian British Business Chamber", "https://www.abbc.am/news/eleveight-ai-presents-the-region-s-first-nvidia-blackwell-b300-ai-factory"),
    "Firebird AI": ("firebird-facility-print.jpg", "Firebird AI factory near Hrazdan", "Firebird AI", "https://firebird.ai/"),
    "Generation AI High School Program": ("generation-ai-graduation-print.jpg", "Students at the first Generation AI graduation ceremony", "Armenpress", "https://armenpress.am/en/article/1248622"),
    "DataFest Yerevan": ("datafest-yerevan-2025-print.jpg", "A live demonstration at DataFest Yerevan 2025", "DataFest Yerevan", "https://www.linkedin.com/posts/datafest-yerevan_datafestyerevan-datafest2025-activity-7391085254662565888-M94y"),
    "AI Conf Armenia": ("ai-conf-armenia-2026-print.jpg", "AI Conf Armenia 2026 at Yerevan State University", "Geek.am", "https://geek.am/tech/17395"),
    "PyData Yerevan": ("pydata-pycon-yerevan-2026-print.jpg", "PyData & PyCon Yerevan 2026", "PyData & PyCon Yerevan", "https://pycon.am/"),
    "Yandex Hall machine-learning meetups": ("yandex-hall-ml-opentalk-print.jpg", "An ML OpenTalk at Yandex Hall, June 2026", "Daniil Primak / Yandex Armenia", "https://disk.yandex.ru/d/6Xo4dlLpVfe40A"),
    "Hack Armenia": ("hack-armenia-2026-print.jpg", "Participants and organizers at Hack Armenia 2026", "Public Radio of Armenia", "https://en.armradio.am/2026/08/10/hack-armenia-24-hour-hackathon-brings-together-ai-specialists-to-develop-practical-solutions/"),
}

LOCAL_LINK = re.compile(r"\]\((?!https?://|mailto:|#)([^)]+)\)")
LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")


def slug(text: str) -> str:
    value = re.sub(r"<[^>]+>", "", text).lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "section"


def stable_id(chapter: str, kind: str, title: str, ordinal: int) -> str:
    # Heading IDs are human-readable. Semantic-block IDs are content-addressed
    # so an unrelated paragraph insertion does not renumber every later block.
    if kind == "section":
        return f"{chapter}-{kind}-{slug(title)}"
    token = hashlib.sha256(title.encode("utf-8")).hexdigest()[:12]
    return f"{chapter}-{kind}-{token}"


def inline(text: str) -> str:
    escaped = html.escape(text, quote=False)

    def link(match: re.Match[str]) -> str:
        label, href = match.group(1), match.group(2)
        href = html.escape(href, quote=True)
        external = " target=\"_blank\" rel=\"noopener noreferrer\" data-external-link" if href.startswith(("http://", "https://")) else ""
        return f'<a href="{href}"{external}>{label}</a>'

    escaped = LINK.sub(link, escaped)
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"(?<!\*)\*([^*]+)\*", r"<em>\1</em>", escaped)
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    return escaped


def table_html(lines: list[str]) -> str:
    rows = []
    for line in lines:
        cells = [inline(cell.strip()) for cell in line.strip().strip("|").split("|")]
        if not all(re.fullmatch(r"[:\- ]+", re.sub(r"<[^>]*>", "", cell)) for cell in cells):
            rows.append(cells)
    if not rows:
        return ""
    head, *body = rows
    return "<div class=\"table-scroll\"><table><thead><tr>" + "".join(f"<th>{cell}</th>" for cell in head) + "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>" for row in body) + "</tbody></table></div>"


def visual_block(block_id: str, chapter_no: str, markup: str, entries: list[dict], title: str) -> str:
    """Add a PDF-derived visual as a semantic, trackable reader block."""
    entries.append({"id": block_id, "type": "report_visual", "title": title, "chapter_id": chapter_no})
    return f'<section class="report-visual reading-block" data-block-id="{block_id}" aria-label="{html.escape(title, quote=True)}">{markup}</section>'


def admission_card(name: str, year: str, applicants: int | None, accepted: int | None, note: str = "") -> str:
    if applicants is None or accepted is None:
        metric = '<div class="admission-pie admission-na" aria-hidden="true">n/c</div><p class="admission-values"><b>n/c</b><br>Non-comparable snapshot</p>'
    else:
        ratio = round(accepted / applicants * 100, 1)
        metric = f'<div class="admission-pie" style="--accepted:{ratio}%" role="img" aria-label="{accepted} accepted, {applicants - accepted} not admitted, out of {applicants} applicants"><span>{ratio:g}%</span></div><p class="admission-values"><b>{applicants} → {accepted}</b><br>Applicants → accepted</p>'
    note_html = f'<p class="admission-note">{html.escape(note)}</p>' if note else ""
    return f'<article class="admission-card"><div><h4>{html.escape(name)}</h4><p class="admission-year">{html.escape(year)}</p>{metric}</div>{note_html}</article>'


def report_visuals(chapter_no: str, entries: list[dict]) -> str:
    """Recreate the report's PDF-only data visuals in accessible responsive HTML."""
    if chapter_no == "01":
        return visual_block("01-block-glance", chapter_no, '''<p class="visual-kicker">Executive overview</p><h2>Armenia at a glance</h2><div class="glance-grid"><article><b>Research</b><p><strong>23</strong> active research groups; <strong>103</strong> named publications cited.</p></article><article><b>Industry</b><p><strong>112</strong> organizations profiled across products, services, and internal teams.</p></article><article><b>Education</b><p><strong>487</strong> Generation AI admissions; <strong>460</strong> undergraduate and <strong>88</strong> master's admissions with usable data.</p></article><article><b>Compute</b><p><strong>6,736</strong> publicly documented data-center GPUs at YSU, Eleveight AI, and Firebird.</p></article><article><b>Government</b><p>Research funding, public compute, school coordination, commercial-compute access, and emerging public-service AI.</p></article><article><b>Community</b><p>Conferences, reading groups, meetups, summer schools, and specialist online groups.</p></article></div><p class="literacy-strip"><b>AI literacy - using AI tools</b><span>AI literacy is about learning to use AI tools, not developing AI systems.</span></p>''', entries, "Armenia at a glance")
    if chapter_no == "02":
        return visual_block("02-block-research-distribution", chapter_no, '''<p class="visual-kicker">Research landscape</p><h2>23 active research groups</h2><div class="research-distribution" role="img" aria-label="Six academic AI groups, eight industrial AI groups, and nine groups using AI in other fields"><div class="research-total"><strong>23</strong><span>active research groups</span></div><div class="research-segments"><span style="--size:26.1"><b>6</b> Academic AI</span><span style="--size:34.8"><b>8</b> Industrial AI</span><span style="--size:39.1"><b>9</b> AI in other fields</span></div></div><p class="visual-footnote"><strong>103</strong> named publications cited. Counts reflect this chapter; repeated titles are counted once.</p>''', entries, "Research group distribution")
    if chapter_no == "03":
        undergraduate = "".join([
            admission_card("YSU - Applied Statistics and Data Science", "2026", 100, 55),
            admission_card("YSU - Informatics and Applied Mathematics", "2026", 239, 198),
            admission_card("YSU - Data Processing in Physics and AI", "2026", 40, 30),
            admission_card("AUA - Data Science", "2025", 141, 117),
            admission_card("AUA - Computer Science", "2025", 187, 122),
            admission_card("UFAR - Computer Science", "2026", 102, 84),
            admission_card("NPUA - Artificial Intelligence Systems", "2025", 64, 48),
            admission_card("NPUA - Data Science", "2025", 77, 56),
            admission_card("RAU - Applied Mathematics and Informatics", "2026", None, None, "90 cumulative admissions; no comparable final applicant total."),
        ])
        masters = "".join([
            admission_card("YSU - Applied Statistics and Data Science", "2026", 58, 40),
            admission_card("YSU - Data Science in Business", "2026", 33, 25),
            admission_card("UFAR - Master in Artificial Intelligence", "2026", None, None, "23 reported admissions; applicant total unavailable."),
            admission_card("RAU - AI and Robotics", "Current", None, None, "Shared admissions pool."),
            admission_card("RAU - Machine Learning and Data Science", "Current", None, None, "Shared admissions pool."),
            admission_card("RAU - AI in Economics", "Current", None, None, "Shared admissions pool."),
            admission_card("AUA - Computer and Information Science", "2025", 62, 49),
        ])
        return visual_block("03-block-education-scale", chapter_no, f'''<p class="visual-kicker">Latest public figures</p><h2>Annual AI education scale</h2><div class="education-scale"><article><b>High school</b><strong>487</strong><span>Generation AI admissions</span><small>2026-27 Grade 10 intake; STEP.ai intake unpublished</small></article><article><b>Undergraduate</b><strong>767+</strong><span>reported admissions / enrollments</span><small>Includes traditional CS programs, not only AI degrees</small></article><article><b>Master's</b><strong>133+</strong><span>reported admissions / enrollments</span><small>Includes traditional CS programs, not only AI degrees</small></article><article><b>AI-related PhD</b><strong>~2</strong><span>documented defenses</span><small>14 selected examples across 2020-26</small></article><article><b>ACA + ARCS.ai</b><strong>242</strong><span>recorded AI / AI-adjacent enrollments</span><small>ACA 116; ARCS.ai 126 course enrollments; repeats possible</small></article></div><p class="visual-footnote">Measures differ by category and are not additive. Counts are documented scale indicators, not national totals.</p><h2 class="visual-subhead">Undergraduate admissions</h2><p class="visual-legend"><i class="legend-accepted"></i> Accepted <i class="legend-not-admitted"></i> Not admitted <span>Pie area is fixed for mobile readability; each card reports its applicant count separately.</span></p><div class="admission-grid">{undergraduate}</div><h2 class="visual-subhead">Master's admissions</h2><p class="visual-legend"><i class="legend-accepted"></i> Accepted <i class="legend-not-admitted"></i> Not admitted <span>n/c means the published snapshot is not comparable.</span></p><div class="admission-grid">{masters}</div>''', entries, "AI education scale and admissions")
    if chapter_no == "04":
        return visual_block("04-block-infrastructure-snapshot", chapter_no, '''<p class="visual-kicker">Infrastructure snapshot</p><h2>6,736 operational GPUs across three platforms</h2><div class="compute-cards"><article><p>YSU Datacenter</p><strong>80</strong><span>72 NVIDIA H100 + 8 A100</span><div class="capacity-bar"><i style="--capacity:1.2%"></i></div><b>1.2% of operational capacity</b><dl><dt>Status</dt><dd>Operational since Jan 2026</dd><dt>Role</dt><dd>Government-funded compute for Armenian research groups</dd></dl></article><article><p>Eleveight AI</p><strong>512</strong><span>512 NVIDIA B300</span><div class="capacity-bar"><i style="--capacity:7.6%"></i></div><b>7.6% of operational capacity</b><dl><dt>Status</dt><dd>Opened Jun 2026; expansion targets are not included here</dd><dt>Role</dt><dd>Private commercial infrastructure with a planned Armenian allocation</dd></dl></article><article><p>Firebird AI</p><strong>6,144</strong><span>6,144 NVIDIA B200</span><div class="capacity-bar"><i style="--capacity:91.2%"></i></div><b>91.2% of operational capacity</b><dl><dt>Status</dt><dd>Opened Aug 2026; future Vera Rubin target excluded</dd><dt>Role</dt><dd>Hyperscale commercial infrastructure, mostly serving large U.S.-based customers</dd></dl></article></div><p class="visual-footnote">Future deployments are targets and are not included in the operational total.</p>''', entries, "Infrastructure snapshot")
    if chapter_no == "05":
        return visual_block("05-block-industry-overview", chapter_no, '''<p class="visual-kicker">Industry at a glance</p><h2><strong>112</strong> profiled organizations</h2><div class="industry-overview"><section><h3>By primary category</h3><ol class="horizontal-chart"><li><span>AI product companies</span><i style="--value:61%"></i><b>61</b></li><li><span>Consulting / services</span><i style="--value:25%"></i><b>25</b></li><li><span>Internal AI teams</span><i style="--value:26%"></i><b>26</b></li></ol></section><section><h3>Most frequent application areas</h3><ol class="horizontal-chart"><li><span>Computer vision</span><i style="--value:100%"></i><b>21</b></li><li><span>Physical AI</span><i style="--value:57.1%"></i><b>12</b></li><li><span>Recommendation</span><i style="--value:47.6%"></i><b>10</b></li><li><span>Robotics</span><i style="--value:38.1%"></i><b>8</b></li><li><span>Banking</span><i style="--value:33.3%"></i><b>7</b></li><li><span>NLP</span><i style="--value:28.6%"></i><b>6</b></li></ol></section></div><p class="visual-footnote">Primary categories are mutually exclusive; application-area counts can overlap.</p>''', entries, "Industry overview")
    if chapter_no == "06":
        return visual_block("06-block-public-support", chapter_no, '''<p class="visual-kicker">August 2026</p><h2>Public support architecture</h2><div class="support-architecture"><article><h3>Education, Science, Culture and Sport</h3><ul><li>Research grants</li><li>Public research compute</li><li>School-system coordination</li></ul><p><strong>35 AI/ML grants</strong><br>AMD 611.98m disclosed</p></article><article><h3>High-Tech Industry</h3><ul><li>Commercial-compute access</li><li>Industry and startup support</li><li>Public-service AI coordination</li></ul><p><strong>$25m</strong><br>Firebird compute agreement over five years</p></article></div><p class="government-strip"><b>Wider government</b><span>Regulation · targeted AI deployments · international cooperation</span></p><p class="visual-footnote">Lead ministries are complemented by emerging use and governance activity across other public bodies.</p>''', entries, "Public support architecture")
    return ""


def render_markdown(path: Path, chapter_no: str, chapter_title: str, entries: list[dict]) -> str:
    lines = path.read_text(encoding="utf-8").splitlines()
    for number, line in enumerate(lines, 1):
        match = LOCAL_LINK.search(line)
        if match:
            raise ValueError(f"{path.name}:{number} contains a local/non-public link: {match.group(1)}")
    out, buffer, table, list_items = [], [], [], []
    block_ordinal = 0
    duplicate_blocks: dict[str, int] = {}

    def block_id_for(content: str) -> str:
        base = stable_id(chapter_no, "block", content, 0)
        duplicate_blocks[base] = duplicate_blocks.get(base, 0) + 1
        return base if duplicate_blocks[base] == 1 else f"{base}-{duplicate_blocks[base]}"

    def flush_paragraph() -> None:
        nonlocal block_ordinal
        if buffer:
            text = " ".join(part.strip() for part in buffer).strip()
            if text:
                block_ordinal += 1
                block_id = block_id_for(text)
                out.append(f'<p class="reading-block" data-block-id="{block_id}">{inline(text)}</p>')
                entries.append({"id": block_id, "type": "paragraph", "chapter_id": chapter_no})
        buffer.clear()

    def flush_list() -> None:
        nonlocal block_ordinal
        if list_items:
            block_ordinal += 1
            block_id = block_id_for("\n".join(list_items))
            out.append(f'<ul class="reading-block" data-block-id="{block_id}">' + "".join(f"<li>{inline(item)}</li>" for item in list_items) + "</ul>")
            entries.append({"id": block_id, "type": "list", "chapter_id": chapter_no})
        list_items.clear()

    def flush_table() -> None:
        nonlocal block_ordinal
        if table:
            block_ordinal += 1
            block_id = block_id_for("\n".join(table))
            out.append(f'<div class="reading-block" data-block-id="{block_id}">{table_html(table)}</div>')
            entries.append({"id": block_id, "type": "table", "chapter_id": chapter_no})
        table.clear()

    for line in lines + [""]:
        heading = re.match(r"^(#{1,3})\s+(.+?)\s*$", line)
        is_table = line.strip().startswith("|") and line.strip().endswith("|")
        bullet = re.match(r"^\s*[-*]\s+(.+)$", line)
        if heading:
            flush_paragraph(); flush_list(); flush_table()
            level, title = len(heading.group(1)), heading.group(2)
            if level == 1:
                continue
            section_id = stable_id(chapter_no, "section", title, 0)
            tag = "h2" if level == 2 else "h3"
            out.append(f'<{tag} id="{section_id}" tabindex="-1" class="section-heading" data-section-id="{section_id}">{inline(title)} <a class="anchor" href="#{section_id}" aria-label="Link to {html.escape(title, quote=True)}">#</a></{tag}>')
            entries.append({"id": section_id, "type": "heading", "title": title, "chapter_id": chapter_no, "level": level})
            if title in PHOTOS:
                filename, caption, credit, source = PHOTOS[title]
                out.append(f'<figure class="report-photo"><img src="assets/{filename}" alt="{html.escape(caption, quote=True)}" loading="lazy"><figcaption>{html.escape(caption)}. Photo: <a href="{html.escape(source, quote=True)}" target="_blank" rel="noopener noreferrer" data-external-link>{html.escape(credit)}</a></figcaption></figure>')
        elif is_table:
            flush_paragraph(); flush_list(); table.append(line)
        elif bullet:
            flush_paragraph(); flush_table(); list_items.append(bullet.group(1))
        elif not line.strip():
            flush_paragraph(); flush_list(); flush_table()
        else:
            flush_list(); flush_table(); buffer.append(line)

    visuals = report_visuals(chapter_no, entries)
    if visuals:
        out.insert(0, visuals)
    return "\n".join(out)


def build(source: Path, output: Path, base_path: str, pdf: Path | None) -> None:
    if not source.is_dir():
        raise ValueError(f"Report source does not exist: {source}")
    output.mkdir(parents=True, exist_ok=True)
    assets_dir = output / "assets"; assets_dir.mkdir(exist_ok=True)
    snapshot = output / "content"; snapshot.mkdir(exist_ok=True)
    hashes, blocks, chapters, rendered = {}, [], [], []
    for filename, chapter_no, title, theme in PUBLIC_CHAPTERS:
        report_file = source / filename
        if not report_file.exists():
            raise ValueError(f"Missing approved public chapter: {report_file}")
        raw = report_file.read_bytes()
        hashes[filename] = hashlib.sha256(raw).hexdigest()
        shutil.copy2(report_file, snapshot / filename)
        chapter_blocks: list[dict] = []
        body = render_markdown(report_file, chapter_no, title, chapter_blocks)
        chapters.append({"id": chapter_no, "title": title, "theme": theme, "source": filename})
        blocks.extend(chapter_blocks)
        rendered.append(f'<section class="chapter theme-{theme}" id="chapter-{chapter_no}" data-chapter-id="{chapter_no}"><header class="chapter-header"><span>Chapter {chapter_no}</span><h1>{html.escape(title)}</h1></header>{body}</section>')
    asset_hashes = {}
    for asset in PUBLIC_ASSETS:
        asset_path = source / "assets" / asset
        if not asset_path.exists():
            raise ValueError(f"Missing approved image asset: {asset_path}")
        asset_hashes[asset] = hashlib.sha256(asset_path.read_bytes()).hexdigest()
        shutil.copy2(asset_path, assets_dir / asset)
    if pdf:
        if not pdf.exists():
            raise ValueError(f"Approved PDF does not exist: {pdf}")
        shutil.copy2(pdf, output / "AI-Ecosystem-in-Armenia-August-2026.pdf")
    ids = [entry["id"] for entry in blocks]
    duplicates = sorted({item for item in ids if ids.count(item) > 1})
    if duplicates:
        raise ValueError(f"Duplicate stable content IDs: {', '.join(duplicates)}")
    report_version = f"August-2026-{hashlib.sha256(''.join(hashes.values()).encode()).hexdigest()[:12]}"
    manifest = {
        "report_version": report_version,
        "report_label": "August 2026",
        "built_at": datetime.now(timezone.utc).isoformat(),
        "source_hashes": hashes,
        "assets": asset_hashes,
        "chapters": chapters,
        "blocks": blocks,
        "base_path": base_path.rstrip("/") or "/",
    }
    (output / "content-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    nav = "".join(f'<a href="#chapter-{c["id"]}"><small>{c["id"]}</small>{html.escape(c["title"])}</a>' for c in chapters)
    html_page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="A public web edition of The AI Ecosystem in Armenia, prepared by YerevaNN."><title>The AI Ecosystem in Armenia — YerevaNN</title><link rel="icon" href="../assets/yerevann-icon-128.png"><link rel="stylesheet" href="styles.css"></head><body><a class="skip-link" href="#report">Skip to report</a><header class="site-header"><a class="brand" href="../">YerevaNN</a><span>Research report · August 2026</span><button id="contents-toggle" aria-expanded="false" aria-controls="contents">Contents</button></header><div class="reader-shell"><aside id="contents" class="contents" aria-label="Report contents"><div><p class="eyebrow">The AI Ecosystem in Armenia</p><nav>{nav}</nav><button id="pdf-toggle" class="pdf-button">View original-layout PDF</button><p class="analytics-note">We collect minimal anonymous engagement statistics to understand which parts of this report are useful. <a href="#analytics-notice">How it works</a></p></div></aside><main id="report"><section class="cover"><p class="eyebrow">YerevaNN research report</p><h1>The AI Ecosystem<br>in Armenia</h1><p>August 2026</p><p class="intro">A public, mobile-friendly edition. It distinguishes verified current activity from announcements and planned activity.</p></section>{''.join(rendered)}<section id="analytics-notice" class="analytics-notice"><h2>Anonymous engagement analytics</h2><p>This reader uses a random browser-tab session identifier, not a person identifier. It records a content block only after it has been visibly on screen for two continuous seconds in an active tab, and estimates visible time while the tab is active and the reader is not idle. We do not use fingerprinting or retain raw IP addresses in the report analytics. Delivery can be blocked or lost; these figures are estimates of engagement, not proof that a person read a passage.</p></section><section id="pdf-panel" class="pdf-panel" hidden aria-live="polite"><div class="pdf-toolbar"><button id="pdf-close">Return to web edition</button><button id="pdf-prev" aria-label="Previous PDF page">Previous</button><span id="pdf-page">Loading PDF…</span><button id="pdf-next" aria-label="Next PDF page">Next</button><label>Zoom <select id="pdf-zoom"><option value="1">100%</option><option value="1.25">125%</option><option value="1.5">150%</option></select></label></div><div id="pdf-viewer" class="pdf-viewer"></div><p id="pdf-error" class="error" hidden>Could not load the original-layout PDF. The web edition remains available.</p></section></main></div><script>window.READER_CONFIG={{basePath:{json.dumps(base_path.rstrip('/') or '/')},analyticsEndpoint:""}};</script><script src="reader.js" defer></script></body></html>'''
    old_config = f'<script>window.READER_CONFIG={{basePath:{json.dumps(base_path.rstrip("/") or "/")},analyticsEndpoint:""}};</script>'
    new_config = f'<script src="reader-config.js"></script><script>window.READER_CONFIG=Object.assign({{basePath:{json.dumps(base_path.rstrip("/") or "/")},reportVersion:{json.dumps(report_version)}}},window.READER_CONFIG||{{}});</script><script src="tracking-core.js"></script>'
    html_page = html_page.replace(old_config, new_config)
    (output / "index.html").write_text(html_page, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Current report materials directory")
    parser.add_argument("--output", type=Path, default=Path("ai-ecosystem-2026"))
    parser.add_argument("--base-path", default="/ai-ecosystem-2026")
    parser.add_argument("--pdf", type=Path, help="Approved current PDF snapshot to offer in optional PDF mode")
    args = parser.parse_args()
    build(args.source.resolve(), args.output.resolve(), args.base_path, args.pdf.resolve() if args.pdf else None)


if __name__ == "__main__":
    main()
