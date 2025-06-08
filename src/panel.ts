import { App, Modal } from 'obsidian';
import { ImageMap } from './imageMap';

/**
 * Simple modal panel used to edit image map regions.
 */
export class EditPanel extends Modal {
  private target?: HTMLImageElement;

  constructor(app: App, private map: ImageMap) {
    super(app);
  }

  /** Opens the panel for a specific image. */
  openFor(target: HTMLImageElement) {
    this.target = target;
    this.open();
  }

  onOpen() {
    this.titleEl.setText('Image Map Editor');
    this.contentEl.createEl('p', { text: 'Editing UI not yet implemented.' });
  }

  onClose() {
    this.contentEl.empty();
    this.target = undefined;
  }
}
