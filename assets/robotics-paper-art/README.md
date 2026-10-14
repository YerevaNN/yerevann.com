# Robotics publication illustrations

Thirty individual schematic thumbnails for the robotics research page, matching
the molecule thumbnails' pale background, white panels, and purple, teal, coral,
and gold palette. Each WebP has an editable SVG companion. `manifest.json` maps
the artwork to the full publication title, paper links, and accessible description.

These are conceptual diagrams, not experimental results or reproductions of paper
figures. The numerical appearance of signal maps, feature bars, and point clouds
is illustrative; no axes, scores, or performance claims are attached to them.

Inspiration came from the abstracts and figure captions in 22 available PDFs:
the two NeurIPS 2026 author preprints; COSMOS-ReID, ShipCross-ID, mCLIP, and
HOSS-Bench; the three aerial-navigation workshop manuscripts; the CITS RF
alignment manuscript; GeoCrossBench; satellite-specific pretraining; local ViT
representations; in-context spurious correlations; the DATA-FM data-selection
manuscript; and arXiv papers 2507.19653, 2508.03736, 2412.09507, 2402.17336,
2306.12673, 2304.11396, and 2007.05335. Remaining thumbnails use the publication
descriptions already present on the website. No private manuscripts are included
in the published assets.

To regenerate, install Pillow and run `scripts/build_robotics_paper_art.py` from
the repository root. The renderer uses the Windows Arial fonts. The SVGs use
Arial with a sans-serif fallback and can be edited independently.
