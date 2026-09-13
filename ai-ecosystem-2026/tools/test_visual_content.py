"""Verify visual conversions retain every source cell and citation."""
import html
import re
import sys
import unittest
from pathlib import Path
from html.parser import HTMLParser
from build_reader import inline, render_markdown, industry_profile
from faithful_visuals import source_table_visual

SOURCE = Path(sys.argv.pop()) if len(sys.argv)>1 else Path('/home/hrant/YerevaNN-fundraising/materials/ai-ecosystem-armenia')
class Parsed(HTMLParser):
    def __init__(self, text):
        super().__init__();self.text=[];self.links=[];self.tags=[];self.feed(text)
    def handle_data(self,text):self.text.append(text)
    def handle_starttag(self,tag,attrs):
        self.tags.append((tag,dict(attrs)))
        if tag=='a':self.links.append(dict(attrs).get('href'))
    def plain(self):return re.sub(r'\s+',' ',' '.join(self.text)).strip()

class VisualContent(unittest.TestCase):
    def test_all_source_cells_and_links_survive(self):
        checked=0
        for file,chapter in [('01-executive-summary.md','01'),('04-education.md','03'),('05-infrastructure-and-compute.md','04')]:
            lines=(SOURCE/file).read_text().splitlines();heading='';table=[]
            for line in lines+['']:
                if line.startswith('## '):heading=line[3:]
                if line.startswith('|'):table.append(line);continue
                if not table:continue
                markup=source_table_visual(table,chapter,heading,inline,SOURCE)
                if markup:
                    result=Parsed(markup)
                    for row in table[2:]:
                        for cell in row.strip('|').split('|'):
                            cell=cell.strip()
                            if chapter=='01' and cell in ['**Research**','**Industry**','**Education**','**Compute**','**Government**','**Community and literacy**']:continue
                            expected=Parsed(inline(cell))
                            if chapter=='01' and cell.startswith('Recurring conferences'):
                                for sentence in re.split(r'(?<=[.!?])\s+',expected.plain()):self.assertIn(sentence,result.plain())
                            else:self.assertIn(expected.plain(),result.plain(),cell)
                            for link in expected.links:self.assertIn(link,result.links)
                    checked+=1
                table=[]
        self.assertEqual(checked,4)
    def test_admissions_pies_and_programs(self):
        body=render_markdown(SOURCE/'04-education.md','03','AI Education',[])
        parsed=Parsed(body)
        self.assertEqual(sum(a.get('class')=='pdf-program-record' for _,a in parsed.tags),16)
        self.assertEqual(sum(a.get('class')=='pdf-admissions-pie' for _,a in parsed.tags),11)
        self.assertIn('90 cumulative admissions across both sectors',parsed.plain())
        self.assertIn('curriculum revision adds a dedicated AI track with 15 specialized courses',parsed.plain())
        self.assertIn('Pie area = applicant pool',parsed.plain())
    def test_urls_are_not_double_escaped(self):
        self.assertEqual(Parsed(inline('[reference](https://example.org/?a=1&b=2)')).links,['https://example.org/?a=1&b=2'])

    def test_industry_research_matches_pdf_policy(self):
        prefix='**[Example](https://example.org)** builds AI tools. **Tags:** `AI`. **Armenia:** Yerevan. **Research:** '
        self.assertNotIn('Research:', industry_profile(prefix+'No.'))
        self.assertNotIn('No.', industry_profile(prefix+'No.'))
        self.assertIn('Published a benchmark.', industry_profile(prefix+'Published a benchmark.'))
        body=render_markdown(SOURCE/'03-industry.md','05','AI Industry',[])
        self.assertNotIn('<strong>Research:</strong> No',body)
        self.assertEqual(body.count('<h4>'),114)

    def test_principal_findings_are_six_numbered_items(self):
        body=render_markdown(SOURCE/'01-executive-summary.md','01','Executive Summary',[])
        ordered=re.findall(r'<ol\b[^>]*>(.*?)</ol>',body,re.S)
        self.assertEqual(len(ordered),1)
        self.assertEqual(ordered[0].count('<li>'),6)

if __name__=='__main__':unittest.main()
