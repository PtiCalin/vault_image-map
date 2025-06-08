import { Menu, Plugin } from 'obsidian';
import ImagePanel from './panel';

/**
 * Sets up an image context menu that opens {@link ImagePanel}.
 */
export default class ImageContextMenu {
  plugin: Plugin;

  /**
   * Create a new context menu helper.
   *
   * @param plugin - Owning plugin instance
   */
  constructor(plugin: Plugin) {
    this.plugin = plugin;
  }

  /**
   * Register the DOM event that adds the context menu entry.
   */
  init() {
    this.plugin.registerDomEvent(document, 'contextmenu', (evt: MouseEvent) => {
      const target = evt.target as HTMLElement | null;
      if (!target) return;

      // Only handle right-clicks on images in preview
      if (target.tagName.toLowerCase() === 'img') {
        const menu = new Menu();
        menu.addItem((item: any) => {
          item.setTitle('Edit Image Map').onClick(() => {
            new ImagePanel(this.plugin.app, this.plugin, target as HTMLImageElement).open();
          });
        });
        menu.showAtMouseEvent(evt);
      }
    });
  }
}
