import type { BasePluginEvent } from './BasePluginEvent';

/**
 * Fired when an undo snapshot is about to be added
 */
export interface BeforeAddUndoSnapshotEvent extends BasePluginEvent<'beforeAddUndoSnapshot'> {
    /**
     * Additional state to be added to the snapshot
     */
    additionalState: { [key: string]: string };
}
