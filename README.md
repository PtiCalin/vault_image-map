# 🖼️ Obsidian Image Map Plugin

> _Create interactive regions on your images._

Welcome to the Image Map plugin for Obsidian, built with the VaultOS toolkit.
This repository provides a structured starting point for developing and extending
image mapping features inside your vault.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: WIP](https://img.shields.io/badge/status-WIP-yellow.svg)](WIP)
[![Pull Requests Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./.github/PULL_REQUEST_TEMPLATE.md)
[![GitHub Discussions](https://img.shields.io/badge/💬-Discussions-blueviolet?logo=github)](https://github.com/your-username/image-map-plugin/discussions)
[![Sponsor PtiCalin](https://img.shields.io/badge/Sponsor-💖-f06292.svg?logo=githubsponsors)](https://github.com/sponsors/your-username)

---

## 🧰 Features

- 🔗 Create clickable regions on any image to jump to notes
- 🖱️ Optional tooltips and hover effects for each region
- ⚙️ VaultOS-ready modular structure (`src/`, `ops/`, `config/`, `dist/`)
- 📦 Rollup build system with `manifest.json`
- 📁 Ready-to-use GitHub Actions and PR templates
- 💬 Discussions and sponsor links for community-driven growth

---

## 🚀 Getting Started

Clone this repository to build or extend the plugin:

```bash
git clone https://github.com/your-username/image-map-plugin.git
cd image-map-plugin
```

### 🛠 Local Setup

```bash
npm install
npm run build
```

After building, copy the contents of `/dist` into your Obsidian vault’s `.obsidian/plugins/` folder.

### ✨ Usage

Add an HTML image tag with a `data-overlay` attribute pointing to an SVG file. The plugin wraps the image in a container and overlays the SVG so you can animate or style it via CSS.

```markdown
<!-- example -->
<img src="my-diagram.png" data-overlay="my-overlay.svg" />
```

Any vectors in `my-overlay.svg` are positioned on top of the image. You can add animations or interactions using regular CSS selectors targeting `.image-map-overlay`.

---

## 🧱 Folder Structure

```plaintext
src/           → TypeScript plugin source
dist/          → Compiled output used by Obsidian
ops/           → Plugin orchestration logic
config/        → Static metadata and module configs
.github/       → GitHub Actions, PR/issue templates
```

---

## 🤝 Contributing

We welcome contributions of all kinds!

Use our templates to get started:

- [🐛 Bug Reports](./.github/ISSUE_TEMPLATE/bug_report.md)
- [🌟 Feature Requests](./.github/ISSUE_TEMPLATE/feature_request.md)
- [📦 Pull Requests](./.github/PULL_REQUEST_TEMPLATE.md)

Read our [CONTRIBUTING.md](CONTRIBUTING.md) for more info, or start a conversation in [💬 GitHub Discussions](https://github.com/your-username/image-map-plugin/discussions).

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).  
Use freely, fork creatively — just spread the love.

---

## 💌 Sponsor

If this plugin saved you time or you simply enjoy using it, consider sponsoring:
[**github.com/sponsors/your-username**](https://github.com/sponsors/PtiCalin)

---

Have fun building, and spend less time structuring
