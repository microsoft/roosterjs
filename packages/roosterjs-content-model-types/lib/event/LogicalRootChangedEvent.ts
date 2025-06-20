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

/**
 * Fired when the logical root is about to be changed
 */
export interface BeforeLogicalRootChangeEvent extends BasePluginEvent<'beforeLogicalRootChange'> {
    /**
     * The logical root element that will no longer be the logical root
     */
    logicalRoot: HTMLDivElement;
}
