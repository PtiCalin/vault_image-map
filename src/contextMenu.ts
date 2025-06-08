import { Plugin, Menu } from 'obsidian';
import { EditPanel } from './panel';

/**
 * Registers a custom context menu item for images.
 */
export function registerContextMenu(
  plugin: Plugin,
  panel: EditPanel,
): void {
  const handler = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
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
