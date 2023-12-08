import type { Snapshot } from 'roosterjs-content-model-types';
import type { Snapshots, UndoSnapshotsService } from 'roosterjs-editor-types';

// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAX_SIZE_LIMIT = 1e7;

class UndoSnapshotsServiceImpl implements UndoSnapshotsService<Snapshot> {
    private snapshots: Snapshots<Snapshot>;

    constructor(maxSize: number) {
        this.snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize,
        };
    }

    canMove(step: number): boolean {
        const newIndex = this.snapshots.currentIndex + step;
        return newIndex >= 0 && newIndex < this.snapshots.snapshots.length;
    }

    move(step: number): Snapshot | null {
        if (this.canMove(step)) {
            this.snapshots.currentIndex += step;
            this.snapshots.autoCompleteIndex = -1;
            return this.snapshots.snapshots[this.snapshots.currentIndex];
        } else {
            return null;
        }
    }

    addSnapshot(snapshot: Snapshot, isAutoCompleteSnapshot: boolean): void {
        const currentSnapshot = this.snapshots.snapshots[this.snapshots.currentIndex];
        const isSameSnapshot =
            currentSnapshot &&
            currentSnapshot.html == snapshot.html &&
            !currentSnapshot.entityStates &&
            !snapshot.entityStates;

        if (this.snapshots.currentIndex < 0 || !currentSnapshot || !isSameSnapshot) {
            this.clearRedo();
            this.snapshots.snapshots.push(snapshot);
            this.snapshots.currentIndex++;
            this.snapshots.totalSize += this.getSnapshotLength(snapshot);

            let removeCount = 0;
            while (
                removeCount < this.snapshots.snapshots.length &&
                this.snapshots.totalSize > this.snapshots.maxSize
            ) {
                this.snapshots.totalSize -= this.getSnapshotLength(
                    this.snapshots.snapshots[removeCount]
                );
                removeCount++;
            }

            if (removeCount > 0) {
                this.snapshots.snapshots.splice(0, removeCount);
                this.snapshots.currentIndex -= removeCount;
                this.snapshots.autoCompleteIndex -= removeCount;
            }

            if (isAutoCompleteSnapshot) {
                this.snapshots.autoCompleteIndex = this.snapshots.currentIndex;
            }
        } else if (isSameSnapshot) {
            // replace the currentSnapshot's metadata so the selection is updated
            this.snapshots.snapshots.splice(this.snapshots.currentIndex, 1, snapshot);
        }
    }

    clearRedo(): void {
        if (this.canMove(1)) {
            let removedSize = 0;
            for (
                let i = this.snapshots.currentIndex + 1;
                i < this.snapshots.snapshots.length;
                i++
            ) {
                removedSize += this.getSnapshotLength(this.snapshots.snapshots[i]);
            }

            this.snapshots.snapshots.splice(this.snapshots.currentIndex + 1);
            this.snapshots.totalSize -= removedSize;
            this.snapshots.autoCompleteIndex = -1;
        }
    }

    canUndoAutoComplete(): boolean {
        return (
            this.snapshots.autoCompleteIndex >= 0 &&
            this.snapshots.currentIndex - this.snapshots.autoCompleteIndex == 1
        );
    }

    private getSnapshotLength(snapshot: Snapshot) {
        return snapshot.html?.length ?? 0;
    }
}

/**
 * @internal
 */
export function createUndoSnapshotsService(
    maxSizeLimit: number = MAX_SIZE_LIMIT
): UndoSnapshotsService<Snapshot> {
    return new UndoSnapshotsServiceImpl(maxSizeLimit);
}
