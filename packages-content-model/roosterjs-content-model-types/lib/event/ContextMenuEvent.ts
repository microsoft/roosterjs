import type { BasePluginDomEvent } from './BasePluginDomEvent';

/**
 * This interface represents a PluginEvent wrapping native ContextMenu event
 */
export interface ContextMenuEvent extends BasePluginDomEvent<'contextMenu', MouseEvent> {
    /**
     * A callback array to let editor retrieve context menu item related to this event.
     * Plugins can add their own getter callback to this array,
     * items from each getter will be separated by a splitter item represented by null
     */
    items: any[];
}
