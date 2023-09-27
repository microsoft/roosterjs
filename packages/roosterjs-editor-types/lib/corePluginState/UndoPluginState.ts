import type NodePosition from '../interface/NodePosition';
import type Snapshot from '../interface/Snapshot';
import type UndoSnapshotsService from '../interface/UndoSnapshotsService';

/**
 * The state object for UndoPlugin
 */
export default interface UndoPluginState {
    /**
     * Snapshot service for undo, it helps handle snapshot add, remove and retrieve
     */
    snapshotsService: UndoSnapshotsService<Snapshot>;

    /**
     * Whether restoring of undo snapshot is in progress.
     */
    isRestoring: boolean;

    /**
     * Whether there is new content change after last undo snapshot is taken
     */
    hasNewContent: boolean;

    /**
     * If addUndoSnapshot() is called nested in another one, this will be true
     */
    isNested: boolean;

    /**
     * Position after last auto complete. Undo autoComplete only works if the current position matches this one
     */
    autoCompletePosition: NodePosition | null;
}
