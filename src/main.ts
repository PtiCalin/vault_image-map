/*
 * main.ts — Obsidian plugin entry.
 * Depends on the obsidian API.
 * Overlays SVGs on images.
 * Friendly vibes, PtiCalin style.
 */
import { Plugin } from 'obsidian';
import ImageContextMenu from './contextMenu';
import {
  parseCoordinates,
  shapesToSVG,
  ShapeCoords,
} from './imageMap';

export default class ImageMapPlugin extends Plugin {
  /**
   * Called when the plugin is loaded.
   * Registers a post processor that overlays SVGs on images with the
   * `data-overlay` attribute.
   *
   * @returns {Promise<void>} Resolves when the post processor is registered and styles are injected.
   */
  async onload() {
    this.registerMarkdownPostProcessor(async (el: HTMLElement, ctx: any) => {
      const images = el.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
      for (const img of Array.from(images)) {
        const overlay = img.getAttribute('data-overlay');
        let externalSvg = '';
        if (overlay) {
          const file = this.app.metadataCache.getFirstLinkpathDest(
            overlay,
            ctx.sourcePath,
          );
          if (file) {
            try {
              externalSvg = await this.app.vault.read(file);
            } catch (err) {
              console.error(
                `🚧 Couldn't load overlay "${overlay}". ` +
                  'Check that the path is correct and the SVG exists in your vault. ' +
                  'Try reloading Obsidian if the problem continues.',
                err,
              );
            }
          }
        }

        const coords: ShapeCoords | null = parseCoordinates(
          img,
          ctx.frontmatter,
        );

        if (!externalSvg && !coords) continue;

        const wrapper = createDiv({ cls: 'image-map-container' });
        img.parentElement?.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        const overlayEl = createDiv({ cls: 'image-map-overlay' });
        if (externalSvg) overlayEl.innerHTML = externalSvg;
        if (coords) overlayEl.appendChild(shapesToSVG(coords));
        wrapper.appendChild(overlayEl);
      }
    });

    // Initialize the image context menu
    new ImageContextMenu(this).init();
  }
}
