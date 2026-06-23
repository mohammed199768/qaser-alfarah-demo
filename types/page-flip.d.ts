declare module "page-flip" {
  export class PageFlip {
    constructor(element: HTMLElement, settings: object);
    clear(): void;
    destroy(): void;
    loadFromHTML(elements: HTMLElement[]): void;
    updateFromHtml(elements: HTMLElement[]): void;
    getFlipController(): unknown | undefined;
    getUI(): { destroy(): void } | undefined;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    on(event: string, callback: (event: unknown) => void): void;
    off(event: string): void;
  }
}
