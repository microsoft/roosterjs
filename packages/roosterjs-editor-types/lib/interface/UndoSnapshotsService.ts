/**
 * Represent an interface to provide functionalities for Undo Snapshots
 */
export default interface UndoSnapshotsService<T = string> {
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
    move(step: number): T | null;

    /**
     * Add a new undo snapshot
     * @param snapshot The snapshot to add
     * @param isAutoCompleteSnapshot Pass true if this undo snapshot can be undone using Backspace key (auto complete)
     * @param force @optional Pass true to bypass the content check so even the html content is not changed, we will still add an undo snapshot.
     * By default there will be a check and ignore undo snapshot whose html is identical with the previous one
     */
    addSnapshot(snapshot: T, isAutoCompleteSnapshot: boolean, force?: boolean): void;

    /**
     * Clear all undo snapshots after the current one
     */
    clearRedo(): void;

    /**
     * Whether there is a snapshot added before auto complete and it can be undone now
     */
    canUndoAutoComplete(): boolean;
}
