import type { ContextMenuPluginState } from './ContextMenuPluginState';
import type { EditPluginState } from 'roosterjs-editor-types';

/**
 * Core plugin state for Content Model Editor
 */
export interface ContentModelCorePluginState {
    /**
     * Plugin state of EditPlugin
     */
    readonly edit: EditPluginState;

    /**
     * Plugin state of ContextMenuPlugin
     */
    readonly contextMenu: ContextMenuPluginState;
}
