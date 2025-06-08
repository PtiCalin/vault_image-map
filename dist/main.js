import { Plugin } from 'obsidian';
export default class ImageMapPlugin extends Plugin {
    /**
     * Called when the plugin is loaded.
     * Registers a post processor that overlays SVGs on images with the
     * `data-overlay` attribute.
     *
     * @returns {Promise<void>} Resolves when the post processor is registered and styles are injected.
     */
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
                    console.error(`❌ Unable to load overlay "${overlay}". ` +
                        'Please verify the path and ensure the SVG exists. ' +
                        'Reload Obsidian if the issue persists.', err);
                }
            }
        });
        this.injectStyles();
    }
    /**
     * Injects the CSS styles needed for the overlay container and SVG layer.
     *
     * @returns {void}
     */
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
    /**
     * Called when the plugin is unloaded.
     * Removes the styles injected by {@link injectStyles}.
     *
     * @returns {void}
     */
    onunload() {
        document.getElementById('image-map-style')?.remove();
    }
}
