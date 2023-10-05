import type ContextMenuProvider from '../interface/ContextMenuProvider';

/**
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
}
