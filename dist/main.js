/*
 * main.ts — Obsidian plugin entry.
 * Depends on the obsidian API.
 * Overlays SVGs on images.
 * Friendly vibes, PtiCalin style.
 */
import { Plugin } from 'obsidian';
import { ImageMap } from './imageMap';
import { EditPanel } from './panel';
import { registerContextMenu } from './contextMenu';
export default class ImageMapPlugin extends Plugin {
    /**
     * Called when the plugin is loaded.
     * Registers a post processor that overlays SVGs on images with the
     * `data-overlay` attribute.
     *
     * @returns {Promise<void>} Resolves when the post processor is registered and styles are injected.
     */
    async onload() {
        this.map = new ImageMap(this.app);
        this.panel = new EditPanel(this.app, this.map);
        this.registerMarkdownPostProcessor(async (el, ctx) => {
            const images = el.querySelectorAll('img[data-overlay]');
            for (const img of Array.from(images)) {
                const overlay = img.getAttribute('data-overlay');
                if (!overlay)
                    continue;
                await this.map.overlayImage(img, overlay, ctx.sourcePath);
            }
        });
        this.map.injectStyles();
        registerContextMenu(this, this.panel);
    }
    /**
     * Injects the CSS styles needed for the overlay container and SVG layer.
     *
     * @returns {void}
     */
    injectStyles() {
        // kept for backward compatibility; delegate to ImageMap
        this.map.injectStyles();
    }
    /**
     * Called when the plugin is unloaded.
     * Removes the styles injected by {@link injectStyles}.
     *
     * @returns {void}
     */
    onunload() {
        this.map.removeStyles();
    }
}
