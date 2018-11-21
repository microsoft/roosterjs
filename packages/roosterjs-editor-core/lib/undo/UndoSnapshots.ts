// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAXSIZELIMIT = 10000000;

export interface UndoSnapshotsService<T> {
    canMove: (delta: number) => boolean;
    move: (delta: number) => T;
    addSnapshot: (snapshot: T) => void;
    clearRedo: () => void;
}

export interface SnapshotUtils<T> {
    areSnapshotsEqual(snapshot1: T, snapshot2: T): boolean;
    getSnapshotSize(snapshot: T): number;
}

export default class UndoSnapshots<T> implements UndoSnapshotsService<T> {
    private snapshots: T[];
    private totalSize: number;
    private currentIndex: number;

    constructor(private utils: SnapshotUtils<T>, private maxSize: number = MAXSIZELIMIT) {
        this.snapshots = [];
        this.totalSize = 0;
        this.currentIndex = -1;
    }

    public canMove(delta: number): boolean {
        let newIndex = this.currentIndex + delta;
        return newIndex >= 0 && newIndex < this.snapshots.length;
    }

    public move(delta: number): T {
        if (this.canMove(delta)) {
            this.currentIndex += delta;
            return this.snapshots[this.currentIndex];
        } else {
            return null;
        }
    }

    public addSnapshot(snapshot: T) {
        if (this.currentIndex < 0 || !this.utils.areSnapshotsEqual(snapshot, this.snapshots[this.currentIndex])) {
            this.clearRedo();
            this.snapshots.push(snapshot);
            this.currentIndex++;
            this.totalSize += this.utils.getSnapshotSize(snapshot);

            let removeCount = 0;
            while (removeCount < this.snapshots.length && this.totalSize > this.maxSize) {
                this.totalSize -= this.utils.getSnapshotSize(this.snapshots[removeCount]);
                removeCount++;
            }

            if (removeCount > 0) {
                this.snapshots.splice(0, removeCount);
                this.currentIndex -= removeCount;
            }
        }
    }

    public clearRedo() {
        if (this.canMove(1)) {
            let removedSize = 0;
            for (let i = this.currentIndex + 1; i < this.snapshots.length; i++) {
                removedSize += this.utils.getSnapshotSize(this.snapshots[i]);
            }
            this.snapshots.splice(this.currentIndex + 1);
            this.totalSize -= removedSize;
        }
    }
}
