import { Modal } from 'obsidian';
/**
 * Simple modal panel used to edit image map regions.
 */
export class EditPanel extends Modal {
    constructor(app, map) {
        super(app);
        this.map = map;
    }
    /** Opens the panel for a specific image. */
    openFor(target) {
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
