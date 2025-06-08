/**
 * Manages SVG overlays and coordinate mapping for images.
 */
export class ImageMap {
    constructor(app) {
        this.app = app;
    }
    /**
     * Applies an SVG overlay to the given image element.
     */
    async overlayImage(img, overlay, sourcePath) {
        const file = this.app.metadataCache.getFirstLinkpathDest(overlay, sourcePath);
        if (!file)
            return;
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
    /** Injects required CSS for overlays. */
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
    /** Removes previously injected CSS styles. */
    removeStyles() {
        document.getElementById('image-map-style')?.remove();
    }
}
