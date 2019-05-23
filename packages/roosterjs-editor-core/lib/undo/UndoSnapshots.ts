import UndoSnapshotsService from '../interfaces/UndoSnapshotsService';

// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAXSIZELIMIT = 1e7;

/**
 * A class to help manage undo snapshots
 */
export default class UndoSnapshots implements UndoSnapshotsService {
    private snapshots: string[];
    private totalSize: number;
    private currentIndex: number;

    constructor(private maxSize: number = MAXSIZELIMIT) {
        this.snapshots = [];
        this.totalSize = 0;
        this.currentIndex = -1;
    }

    /**
     * Check whether can move current undo snapshot with the given step
     * @param step The step to check, can be positive, negative or 0
     * @returns True if can move current snapshot with the given step, otherwise false
     */
    public canMove(delta: number): boolean {
        let newIndex = this.currentIndex + delta;
        return newIndex >= 0 && newIndex < this.snapshots.length;
    }

    /**
     * Move current snapshot with the given step if can move this step. Otherwise no action and return null
     * @param step The step to move
     * @returns If can move with the given step, returns the snapshot after move, otherwise null
     */
    public move(delta: number): string {
        if (this.canMove(delta)) {
            this.currentIndex += delta;
            return this.snapshots[this.currentIndex];
        } else {
            return null;
        }
    }

    /**
     * Add a new undo snapshot
     * @param snapshot The snapshot to add
     */
    public addSnapshot(snapshot: string) {
        if (this.currentIndex < 0 || snapshot != this.snapshots[this.currentIndex]) {
            this.clearRedo();
            this.snapshots.push(snapshot);
            this.currentIndex++;
            this.totalSize += snapshot.length;

            let removeCount = 0;
            while (removeCount < this.snapshots.length && this.totalSize > this.maxSize) {
                this.totalSize -= this.snapshots[removeCount].length;
                removeCount++;
            }

            if (removeCount > 0) {
                this.snapshots.splice(0, removeCount);
                this.currentIndex -= removeCount;
            }
        }
    }

    /**
     * Clear all undo snapshots after the current one
     */
    public clearRedo() {
        if (this.canMove(1)) {
            let removedSize = 0;
            for (let i = this.currentIndex + 1; i < this.snapshots.length; i++) {
                removedSize += this.snapshots[i].length;
            }
            this.snapshots.splice(this.currentIndex + 1);
            this.totalSize -= removedSize;
        }
    }
}
