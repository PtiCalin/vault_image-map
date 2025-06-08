import { Menu } from 'obsidian';
import ImagePanel from './panel';
/**
 * Sets up an image context menu that opens {@link ImagePanel}.
 */
export default class ImageContextMenu {
    constructor(plugin) {
        this.plugin = plugin;
    }
    /**
     * Register the DOM event that adds the context menu entry.
     */
    init() {
        this.plugin.registerDomEvent(document, 'contextmenu', (evt) => {
            const target = evt.target;
            if (!target)
                return;
            // Only handle right-clicks on images in preview
            if (target.tagName.toLowerCase() === 'img') {
                const menu = new Menu();
                menu.addItem((item) => {
                    item.setTitle('Edit Image Map').onClick(() => {
                        new ImagePanel(this.plugin.app, this.plugin, target).open();
                    });
                });
                menu.showAtMouseEvent(evt);
            }
        });
    }
}
