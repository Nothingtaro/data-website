# Data Portfolio Website

A responsive, zero-dependency portfolio website for presenting data analytics,
machine learning projects, professional experience, and technical notes.

**Live website:** https://nothingtaro.github.io/data-website/

## Features

- Responsive multi-page layout
- Accessible semantic HTML
- Lightweight CSS design system
- Progressive motion with reduced-motion support
- No framework, package manager, or build step
- Ready for GitHub Pages
- Restrictive Content Security Policy with no third-party runtime dependencies

## Project structure

```text
.
|-- index.html
|-- work.html
|-- notes.html
|-- about.html
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   |-- documents/
|   |   |-- thai-food-image-classification-paper.pdf
|   |   `-- dynamic-vehicle-routing-presentation.pdf
|   |-- images/
|   |   `-- chanon-aupattanapanit.jpg
|   `-- js/
|       `-- motion.js
|-- .gitignore
|-- .nojekyll
`-- README.md
```

The local `content/` directory, private documents, and development notes are
excluded. The profile image and two project documents under `assets/` are public.

## Run locally

Open `index.html` in a browser. No installation or build command is required.

For a local HTTP server, you can optionally run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Customize

1. Update the personal details and links in the HTML pages.
2. Replace the profile image in `assets/images/` if needed.
3. Adjust colors, typography, and layout tokens in `assets/css/styles.css`.
4. Update canonical and Open Graph URLs when publishing under a different URL.

## Deployment

This repository is configured for GitHub Pages from the `main` branch. Changes
pushed to `main` are published from the repository root.
