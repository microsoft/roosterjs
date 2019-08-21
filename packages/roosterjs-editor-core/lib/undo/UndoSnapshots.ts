import UndoSnapshotsService from '../interfaces/UndoSnapshotsService';
import { Snapshots } from 'roosterjs-editor-types';
import {
    addSnapshot,
    canMoveCurrentSnapshot,
    moveCurrentSnapsnot,
    clearProceedingSnapshots,
    createSnapshots,
} from 'roosterjs-editor-dom';

// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAXSIZELIMIT = 1e7;

/**
 * A class to help manage undo snapshots
 */
export default class UndoSnapshots implements UndoSnapshotsService {
    private snapshots: Snapshots;

    constructor(public readonly maxSize: number = MAXSIZELIMIT) {
        this.snapshots = createSnapshots(maxSize);
    }

    /**
     * Check whether can move current undo snapshot with the given step
     * @param step The step to check, can be positive, negative or 0
     * @returns True if can move current snapshot with the given step, otherwise false
     */
    public canMove(delta: number): boolean {
        return canMoveCurrentSnapshot(this.snapshots, delta);
    }

    /**
     * Move current snapshot with the given step if can move this step. Otherwise no action and return null
     * @param step The step to move
     * @returns If can move with the given step, returns the snapshot after move, otherwise null
     */
    public move(delta: number): string {
        return moveCurrentSnapsnot(this.snapshots, delta);
    }

    /**
     * Add a new undo snapshot
     * @param snapshot The snapshot to add
     */
    public addSnapshot(snapshot: string) {
        addSnapshot(this.snapshots, snapshot);
    }

    /**
     * Clear all undo snapshots after the current one
     */
    public clearRedo() {
        clearProceedingSnapshots(this.snapshots);
    }
}
