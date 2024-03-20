import type { BasePluginEvent } from './BasePluginEvent';

/**
 * Fired when the logical root changes
 */
export interface LogicalRootChangedEvent extends BasePluginEvent<'logicalRootChanged'> {
    /**
     * The new logical root element
     */
    logicalRoot: HTMLDivElement;
}
