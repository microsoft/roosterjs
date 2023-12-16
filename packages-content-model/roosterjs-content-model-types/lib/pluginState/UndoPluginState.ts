import type { SnapshotsManager } from '../parameter/SnapshotsManager';

/**
 * The state object for UndoPlugin
 */
export interface UndoPluginState {
    /**
     * Snapshot service for undo, it helps handle snapshot add, remove and retrieve
     */
    snapshotsManager: SnapshotsManager;

    /**
     * Whether restoring of undo snapshot is in progress.
     */
    isRestoring: boolean;

    /**
     * If addUndoSnapshot() or formatContentModel() is called nested in another one, this will be true
     */
    isNested: boolean;

    /**
     * Container after last auto complete. Undo autoComplete only works if the current position matches this one
     */
    posContainer: Node | null;

    /**
     * Offset after last auto complete. Undo autoComplete only works if the current position matches this one
     */
    posOffset: number | null;

    /**
     * Last key user pressed
     */
    lastKeyPress: string | null;
}
