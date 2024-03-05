import type { EntityState } from '..';
import type { BasePluginEvent } from './BasePluginEvent';

/**
 * Undo snapshot event when a custom logical root is used (logicalRoot != physicalRoot)
 * This event is triggered when an undo snapshot is taken
 * Plugins can handle this event to include entity state to include in the snapshot
 */
export interface SnapshotLogicalRootEvent extends BasePluginEvent<'snapshotLogicalRoot'> {
    /**
     * The logical root at the time the snapshot is taken
     */
    logicalRoot: HTMLElement;

    /**
     * A reference to an array of entity states that will be included in the snapshot
     * Plugins can add to this array to include information they wish to use to restore entities on undo later
     */
    entityStates: EntityState[];
}
