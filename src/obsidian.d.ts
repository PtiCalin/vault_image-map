declare module 'obsidian' {
  export class Plugin {
    app: any;
    registerMarkdownPostProcessor(...args: any[]): void;
    registerDomEvent(...args: any[]): void;
    registerEvent(...args: any[]): void;
    addCommand(...args: any[]): void;
  }

  export class Modal {
    app: any;
    contentEl: HTMLElement & {
      empty(): void;
      createEl(tag: string, options?: any): HTMLElement;
    };
    constructor(app: any);
    open(): void;
  }

  export class Menu {
    addItem(cb: any): void;
    showAtMouseEvent(evt: MouseEvent): void;
  }

  export class Notice {
    constructor(message: string, timeout?: number);
  }

  export type App = any;
}

declare function createDiv(param?: { cls?: string }): HTMLDivElement;
