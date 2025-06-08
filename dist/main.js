import { Plugin } from 'obsidian';
export default class ImageMapPlugin extends Plugin {
    async onload() {
        this.registerMarkdownPostProcessor(async (el, ctx) => {
            const images = el.querySelectorAll('img[data-overlay]');
            for (const img of Array.from(images)) {
                const overlay = img.getAttribute('data-overlay');
                if (!overlay)
                    continue;
                const file = this.app.metadataCache.getFirstLinkpathDest(overlay, ctx.sourcePath);
                if (!file)
                    continue;
                try {
                    const svg = await this.app.vault.read(file);
                    const wrapper = createDiv({ cls: 'image-map-container' });
                    img.parentElement?.insertBefore(wrapper, img);
                    wrapper.appendChild(img);
                    const overlayEl = createDiv({ cls: 'image-map-overlay' });
                    overlayEl.innerHTML = svg;
                    wrapper.appendChild(overlayEl);
                }
                catch (err) {
                    console.error('Image Map Plugin: Cannot load overlay', overlay, err);
                }
            }
        });
        this.injectStyles();
    }
    injectStyles() {
        const style = document.createElement('style');
        style.id = 'image-map-style';
        style.textContent = `
.image-map-container { position: relative; display: inline-block; }
.image-map-container img { display: block; }
.image-map-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
`;
        document.head.appendChild(style);
    }
    onunload() {
        document.getElementById('image-map-style')?.remove();
    }
}
