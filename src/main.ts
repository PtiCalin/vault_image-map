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
                `❌ Unable to load overlay "${overlay}". ` +
                  'Please verify the path and ensure the SVG exists. ' +
                  'Reload Obsidian if the issue persists.',
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

    this.injectStyles();

    // Initialize the image context menu
    new ImageContextMenu(this).init();
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
