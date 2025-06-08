import { App, Modal } from 'obsidian';

/**
 * Simple modal panel displayed when the user activates the image context menu.
 */
export default class ImagePanel extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h2', { text: 'Image Panel' });
    contentEl.createEl('p', { text: 'You opened the image panel from the context menu.' });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
