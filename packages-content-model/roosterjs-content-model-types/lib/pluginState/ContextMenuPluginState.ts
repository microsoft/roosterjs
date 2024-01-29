import type { ContextMenuProvider } from '../editor/ContextMenuProvider';

/**
 * The state object for DOMEventPlugin
 */
export interface ContextMenuPluginState {
    /**
     * Context menu providers, that can provide context menu items
     */
    contextMenuProviders: ContextMenuProvider<any>[];
}
