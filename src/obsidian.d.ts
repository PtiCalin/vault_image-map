declare module 'obsidian' {
  export class App {
    metadataCache: {
      getFirstLinkpathDest(path: string, source: string): { path: string } | null;
    };
    vault: {
      read(file: { path: string }): Promise<string>;
    };
    workspace: {
      on(name: string, callback: (...data: any[]) => any): void;
    };
  }

  export class Plugin {
    app: App;
    registerMarkdownPostProcessor(
      callback: (el: HTMLElement, ctx: MarkdownPostProcessorContext) => void,
    ): void;
    registerDomEvent(
      el: EventTarget,
      type: string,
      callback: (ev: any) => any,
    ): void;
  }

  export class Menu {
    addItem(cb: (item: any) => void): void;
    showAtPosition(pos: { x: number; y: number }): void;
  }

  export class Modal {
    titleEl: HTMLElement & { setText(text: string): void };
    contentEl: HTMLElement & {
      createEl(tag: string, options?: any): HTMLElement;
      empty(): void;
    };
    constructor(app: App);
    open(): void;
  }

  export interface MarkdownPostProcessorContext {
    sourcePath: string;
  }
}

declare function createDiv(attrs?: { cls?: string }): HTMLDivElement;
