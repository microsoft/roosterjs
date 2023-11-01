/**
 * @internal
 * An extended Editor plugin interface which supports providing context menu items
 */
export interface ContextMenuProvider<T> {
    /**
     * Get context menu items
     * @param target HTML Node that user is operating on
     * @returns An array of context menu items, or null if there is no menu item need to show
     */
    getContextMenuItems: (target: Node) => T[] | null;
}

/**
 * @internal
 * The state object for DOMEventPlugin
 */
export interface ContentModelDOMEventPluginState {
    /**
     * Whether editor is in IME input sequence
     */
    isInIME: boolean;

    /**
     * Scroll container of editor
     */
    scrollContainer: HTMLElement;

    /**
     * Context menu providers, that can provide context menu items
     */
    contextMenuProviders: ContextMenuProvider<any>[];

    /**
     * When set to true, onFocus event will not trigger reselect cached range
     */
    skipReselectOnFocus?: boolean;
}
