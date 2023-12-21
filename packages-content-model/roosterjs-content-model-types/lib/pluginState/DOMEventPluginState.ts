/**
 * The state object for DOMEventPlugin
 */
export interface DOMEventPluginState {
    /**
     * Whether editor is in IME input sequence
     */
    isInIME: boolean;

    /**
     * Scroll container of editor
     */
    scrollContainer: HTMLElement;

    /**
     * Whether mouse up event handler is added
     */
    mouseUpEventListerAdded: boolean;

    /**
     * X-coordinate when mouse down happens
     */
    mouseDownX: number | null;

    /**
     * X-coordinate when mouse down happens
     */
    mouseDownY: number | null;
}
