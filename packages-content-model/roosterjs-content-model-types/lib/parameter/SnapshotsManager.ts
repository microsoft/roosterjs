import type { Snapshot } from './Snapshot';

/**
 * Represent an interface to provide functionalities to manager undo snapshots
 */
export interface SnapshotsManager {
    /**
     * Whether there is now content changed after last snapshot was taken
     */
    hasNewContent: boolean;

    /**
     * Check whether can move current undo snapshot with the given step
     * @param step The step to check, can be positive, negative or 0
     * @returns True if can move current snapshot with the given step, otherwise false
     */
    canMove(step: number): boolean;

    /**
     * Move current snapshot with the given step if can move this step. Otherwise no action and return null
     * @param step The step to move
     * @returns If can move with the given step, returns the snapshot after move, otherwise null
     */
    move(step: number): Snapshot | null;

    /**
     * Add a new undo snapshot
     * @param snapshot The snapshot to add
     */
    addSnapshot(snapshot: Snapshot, isAutoCompleteSnapshot: boolean): void;

    /**
     * Clear all undo snapshots after the current one
     */
    clearRedo(): void;

    /**
     * Whether there is a snapshot added before auto complete and it can be undone now
     */
    canUndoAutoComplete(): boolean;
}
