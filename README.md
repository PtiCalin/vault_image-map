# 🖼️ Obsidian Image Map Plugin

> _Create interactive regions on your images._

Welcome to the Image Map plugin for Obsidian, built with the VaultOS toolkit.
This repository provides a structured starting point for developing and extending
image mapping features inside your vault.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: WIP](https://img.shields.io/badge/status-WIP-yellow.svg)](WIP)
[![Pull Requests Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./.github/PULL_REQUEST_TEMPLATE.md)
[![GitHub Discussions](https://img.shields.io/badge/💬-Discussions-blueviolet?logo=github)](https://github.com/PtiCalin/image-map-plugin/discussions)
[![Sponsor PtiCalin](https://img.shields.io/badge/Sponsor-💖-f06292.svg?logo=githubsponsors)](https://github.com/sponsors/PtiCalin)

---

## 🧰 Features

- 🔗 Create clickable regions on any image to jump to notes
- 🖱️ Optional tooltips and hover effects for each region
- ⚙️ VaultOS-ready modular structure (`src/` for sources and `dist/` for builds)
- 📦 Rollup build system with `manifest.json`
- 📁 Ready-to-use GitHub Actions and PR templates
- 💬 Discussions and sponsor links for community-driven growth

---

## 🚀 Getting Started

Clone this repository to build or extend the plugin:

```bash
git clone https://github.com/PtiCalin/image-map-plugin.git
cd image-map-plugin
```

### 🛠 Local Setup

```bash
npm install
npm run build
```

### ⚙️ Automated Setup (Codex)

If you're running this repository in a Codex environment, place the commands
above in a `setup.sh` script at the project root:

```bash
#!/usr/bin/env bash
npm install
npm run build
```

Make the script executable with `chmod +x setup.sh`. Codex will run it
automatically when the workspace starts. If network access is restricted,
set `CODEX_ENABLE_NETWORK=1` or request outbound access so `npm install` can
download packages.

After building, copy the contents of `/dist` into your Obsidian vault’s `.obsidian/plugins/` folder.

### ✨ Usage

Add an HTML image tag with a `data-overlay` attribute pointing to an SVG file. The plugin wraps the image in a container and overlays the SVG so you can animate or style it via CSS.

```markdown
<!-- example -->
<img src="my-diagram.png" data-overlay="my-overlay.svg" />
```

Any vectors in `my-overlay.svg` are positioned on top of the image. You can add animations or interactions using regular CSS selectors targeting `.image-map-overlay`.

### 🖱️ Editing an Image Map

1. Right-click an image in preview mode and choose **"Edit Image Map"**.
2. Use the toolbar to draw polygons, rectangles or ellipses over the preview.
3. Click **Save** to store the coordinates to `<image>.map.json` next to the source image.
4. Reload the note to see the overlay applied.

The plugin can also render these shapes automatically from stored coordinates. Either supply a `data-coordinates` attribute containing JSON, or define a matching entry under `imageMaps` in your note's front-matter. On render, the coordinates are converted into `<polygon>`, `<rect>`, or `<ellipse>` elements that layer on top of the image, alongside any external SVG.

---

## 🧱 Folder Structure

```plaintext
src/           → TypeScript plugin source
dist/          → Compiled output used by Obsidian
.github/       → GitHub Actions, PR/issue templates
```
## 🧩 Modules

The plugin is split into several TypeScript modules:
* `main.ts` – entry point that registers the post processor and context menu.
* `contextMenu.ts` – listens for right‑clicks and spawns `panel.ts`.
* `panel.ts` – drawing modal that lets you outline shapes and saves them to a `.map.json` file.
* `imageMap.ts` – utilities for parsing coordinates and generating the SVG overlay.

`main.ts` wires these pieces together: the context menu opens the panel, the panel relies on `imageMap.ts`, and the post processor from `main.ts` overlays any saved shapes in preview.

## 🛠 Commands & Configuration

The plugin currently has no command palette actions or settings.
Use the following HTML attributes to configure each image:

- `data-overlay` – path to an external SVG file to overlay.
- `data-coordinates` – JSON string of shape coordinates.
- `data-map` – key referencing `imageMaps` data in the note front matter.

Example front matter for `data-map`:

```yaml
---
imageMaps:
  my-diagram:
    polygons:
      - "10,10 90,10 50,90"
---
```

```markdown
<img src="diagram.png" data-map="my-diagram" />
```



---

## 🤝 Contributing

We welcome contributions of all kinds!

Use our templates to get started:

- [🐛 Bug Reports](../../issues/new?template=bug.yml)
- [🌟 Feature Requests](../../issues/new?template=feature-request.yml)
- [📦 Pull Requests](./.github/PULL_REQUEST_TEMPLATE.md)

Read our [CONTRIBUTING.md](CONTRIBUTING.md) for more info, or start a conversation in [💬 GitHub Discussions](https://github.com/PtiCalin/image-map-plugin/discussions).

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).  
Use freely, fork creatively — just spread the love.

---

## 💌 Sponsor

If this plugin saved you time or you simply enjoy using it, consider sponsoring:
[**github.com/sponsors/PtiCalin**](https://github.com/sponsors/PtiCalin)

---

Have fun building, and spend less time structuring
