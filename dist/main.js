/*
 * main.ts — Obsidian plugin entry.
 * Depends on the obsidian API.
 * Overlays SVGs on images.
 * Friendly vibes, PtiCalin style.
 */
import { Plugin } from 'obsidian';
import ImageContextMenu from './contextMenu';
import { parseCoordinates, overlayImage, } from './imageMap';
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
            const images = el.querySelectorAll('img');
            for (const img of Array.from(images)) {
                const overlay = img.getAttribute('data-overlay');
                let externalSvg = '';
                if (overlay) {
                    const file = this.app.metadataCache.getFirstLinkpathDest(overlay, ctx.sourcePath);
                    if (file) {
                        try {
                            externalSvg = await this.app.vault.read(file);
                        }
                        catch (err) {
                            console.error(`🚧 Couldn't load overlay "${overlay}". ` +
                                'Check that the path is correct and the SVG exists in your vault. ' +
                                'Try reloading Obsidian if the problem continues.', err);
                        }
                    }
                }
                const coords = parseCoordinates(img, ctx.frontmatter);
                if (!externalSvg && !coords)
                    continue;
                overlayImage(img, coords, externalSvg);
            }
        });
        // Initialize the image context menu
        new ImageContextMenu(this).init();
    }
}
