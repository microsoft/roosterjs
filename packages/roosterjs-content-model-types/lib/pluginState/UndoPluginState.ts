import type { SnapshotsManager } from '../parameter/SnapshotsManager';
import type { DOMInsertPoint } from '../selection/DOMSelection';

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
     * Insert point after last auto complete. Undo autoComplete only works if the current position matches this one
     */
    autoCompleteInsertPoint: DOMInsertPoint | null;

    /**
     * Last key user pressed
     */
    lastKeyPress: string | null;
}
