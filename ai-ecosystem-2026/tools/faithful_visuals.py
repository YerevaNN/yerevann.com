"""Responsive counterparts of PDF table diagrams, preserving every source cell.

No second, manually curated list of programs or shortened capacity descriptions.
Admission number extraction uses the PDF builder's exact parser.
"""
import ast
import html
import math
import re


def admissions_parser(source):
    tree = ast.parse((source / 'build_report.py').read_text(encoding='utf-8'))
    function = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'admissions_summary')
    scope = {'re': re, 'html': html}
    exec(compile(ast.Module(body=[function], type_ignores=[]), 'pdf-admissions-parser', 'exec'), scope)
    return scope['admissions_summary']


def source_table_visual(lines, chapter, heading, inline, source):
    rows = [[cell.strip() for cell in line.strip().strip('|').split('|')] for line in lines]
    rows = [r for r in rows if not all(re.fullmatch(r'[:\- ]+', cell) for cell in r)]
    if not rows:
        return None
    if chapter == '01' and rows[0][0] == 'Dimension':
        values = {r[0].replace('**',''): r[1] for r in rows[1:]}
        community = re.split(r'(?<=[.!?])\s+', values['Community and literacy'], maxsplit=1)
        cards = [(key.upper(), values[key]) for key in ['Research','Industry','Education','Compute','Government']]
        cards.append(('COMMUNITY', community[0]))
        content = ''.join(f'<article class="glance-{title.lower()}"><h3>{title}</h3><p>{inline(body)}</p></article>' for title,body in cards)
        literacy = community[1] if len(community)>1 else ''
        return f'<div class="pdf-glance-grid">{content}</div><div class="pdf-literacy-strip"><b>AI LITERACY — USING AI TOOLS</b><span>{inline(literacy)}</span></div>'
    if chapter == '04' and rows[0][0] == 'Platform':
        data=[]
        for name,capacity,status,role in rows[1:]:
            count=sum(int(re.search(r'\d[\d,]*',part).group().replace(',','')) for part in capacity.split('+'))
            data.append((name,capacity,status,role,count))
        total=sum(r[-1] for r in data)
        cards=''.join(f'<article><h3>{inline(name)}</h3><strong class="gpu-count">{count:,}</strong><p>{inline(capacity)}</p><p class="gpu-share">{count/total:.1%} of operational capacity</p><dl><dt>Status</dt><dd>{inline(status)}</dd><dt>Role</dt><dd>{inline(role)}</dd></dl></article>' for name,capacity,status,role,count in data)
        return f'<div class="pdf-total-strip"><strong>{total:,}</strong><span>OPERATIONAL GPUS<br>ACROSS THREE PLATFORMS</span></div><div class="pdf-compute-grid">{cards}</div>'
    if chapter == '03' and rows[0][:2] == ['Institution','Program']:
        summary=admissions_parser(source)
        records=[(r,summary(r[3] if len(r)>3 else '')) for r in rows[1:]]
        show_pies=heading in ['Undergraduate education',"Master's education"]
        largest=max((s[3] for r,s in records if s and s[3] and s[4] is not None and s[4]<=s[3]),default=1)
        content=[]; institution=None
        if show_pies:
            content.append('<p class="pdf-pie-legend"><i></i> Accepted <i></i> Not admitted <span>Pie area = applicant pool; n/c = non-comparable snapshots.</span></p>')
        for row,s in records:
            name,program,description=row[:3];admissions=row[3] if len(row)>3 else ''
            if name!=institution:
                if institution is not None:content.append('</section>')
                content.append(f'<section class="pdf-program-group"><h3>{inline(name)}</h3>');institution=name
            numbers='';pie=''
            if s:
                year,applied,admitted,pool,accepted=s
                numbers=f'<div class="pdf-program-numbers"><span>{year}</span><b>{applied} → {admitted}</b><small>Applicants → admitted</small></div>'
                if show_pies and pool and accepted is not None and accepted<=pool:
                    diameter=max(24,72*math.sqrt(pool/largest))
                    pie=f'<div class="pdf-pie-box"><div class="pdf-admissions-pie" style="--diameter:{diameter:.3f}px;--share:{accepted/pool*100:.6f}%" role="img" aria-label="{accepted} admitted out of {pool} applicants"></div></div>'
            if show_pies and not pie:pie='<div class="pdf-pie-box"><span title="Non-comparable or unavailable applicant and admission totals">n/c</span></div>'
            content.append(f'<article class="pdf-program-record"><div class="pdf-program-body"><header><h4>{inline(program)}</h4>{numbers}</header><p>{inline(description)}</p><div class="pdf-admission-evidence">{inline(admissions)}</div></div>{pie}</article>')
        if institution is not None:content.append('</section>')
        return ''.join(content)
    return None
