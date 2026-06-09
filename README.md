# yerevann.com

Static prerendered export of the YerevaNN website captured from https://www.yerevann.com on 2026-06-08.

The pages are saved as GitHub Pages-ready static HTML. Each route contains the rendered DOM and generated CSS captured from the live site; the Softr rendering runtime was stripped so the pages do not rerender from a CMS at runtime. Images used by the site are copied into `assets/` and referenced locally.

## Pages

- `/` - Home
- `/about` - About
- `/donate` - Donate
- `/internship` - Internship
- `/forge-ai` - Forge AI
- `/ai-for-robotics` - AI for Robotics
- `/ai-for-molecule-generation` - AI for Molecule Generation
- `/a-guide-to-deep-learning` - A Guide to Deep Learning

## Local preview

Serve the repository root with any static server, for example:

```powershell
python -m http.server 8000
```

Then open http://localhost:8000.

The site is intended for GitHub Pages with the custom domain in `CNAME`.
