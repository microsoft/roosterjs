import type { ContextMenuProvider, EditPluginState } from 'roosterjs-editor-types';

/**
 * Core plugin state for Content Model Editor
 */
export interface ContentModelCorePluginState {
    /**
     * Plugin state of EditPlugin
     */
    readonly edit: EditPluginState;

    /**
     * Context Menu providers
     */
    readonly contextMenuProviders: ContextMenuProvider<any>[];
}
