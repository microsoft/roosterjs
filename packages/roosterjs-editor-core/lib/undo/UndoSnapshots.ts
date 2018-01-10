// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAXSIZELIMIT = 10000000;

/**
 * The UndoSnapshots data structure
 */
export default class UndoSnapshots {
    private snapshots: string[];
    private totalSize: number;
    private currentIndex: number;

    /**
     * Create an instance of UndoSnapshots
     * @param maxSize The maximum stack size
     */
    constructor(private maxSize: number = MAXSIZELIMIT) {
        this.snapshots = [];
        this.totalSize = 0;
        this.currentIndex = -1;
    }

    /**
     * Whether can move forward or backward nunmber of steps
     * @param delta The number of steps to move, positive means moving to next snapshots
     * negative means moving to previous snapshots
     * @returns True if we can move, false otherwise
     */
    public canMove(delta: number): boolean {
        let newIndex = this.currentIndex + delta;
        return newIndex >= 0 && newIndex < this.snapshots.length;
    }

    /**
     * Move forward or backward number of steps
     * @param delta The number of steps to move, positive means moving to next snapshots
     * negative means moving to previous snapshots
     * @returns The snapshot after moving, null if we can not do the move
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
     * Add a snapshot to the stack
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
     * Clear the redo stack
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
