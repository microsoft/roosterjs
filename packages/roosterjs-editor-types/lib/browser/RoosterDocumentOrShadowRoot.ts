/**
 * Document or shadow root
 */
export default interface RoosterDocumentOrShadowRoot
    extends DocumentOrShadowRoot,
        DocumentFragment {
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;
    getElementById(elementId: string): HTMLElement | null;

    /**
     * Get current selection
     */
    getSelection: () => Selection | null;

    /**
     * Dispose polyfill functions if any
     */
    dispose?: () => void;
}
