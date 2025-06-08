import { Menu } from 'obsidian';
/**
 * Registers a custom context menu item for images.
 */
export function registerContextMenu(plugin, panel) {
    const handler = (event) => {
        const target = event.target;
        if (target instanceof HTMLImageElement) {
            const menu = new Menu();
            menu.addItem((item) => {
                item.setTitle('Edit Image Map').onClick(() => {
                    panel.openFor(target);
                });
            });
            menu.showAtPosition({ x: event.pageX, y: event.pageY });
            event.preventDefault();
        }
    };
    plugin.registerDomEvent(document, 'contextmenu', handler);
}
