import { Snapshot, Snapshots, UndoSnapshotsService } from 'roosterjs-editor-types';
import {
    addSnapshotV2,
    canMoveCurrentSnapshot,
    moveCurrentSnapshot,
    clearProceedingSnapshotsV2,
    canUndoAutoComplete,
} from 'roosterjs-editor-dom';

export default class UndoSnapshots implements UndoSnapshotsService<Snapshot> {
    private hijackUndoSnapshotCallback: undefined | ((snapshot: Snapshot) => void);

    constructor(private snapshots: Snapshots<Snapshot>, private onChange: () => void) {}

    public isUndoSnapshotServiceV2(): true {
        return true;
    }

    public startHijackUndoSnapshot(callback: (snapshot: Snapshot) => void) {
        this.hijackUndoSnapshotCallback = callback;
    }

    public stopHijackUndoSnapshot() {
        this.hijackUndoSnapshotCallback = undefined;
    }

    public canMove(delta: number): boolean {
        return canMoveCurrentSnapshot(this.snapshots, delta);
    }

    public move(delta: number): Snapshot {
        const result = moveCurrentSnapshot(this.snapshots, delta);
        this.onChange();
        return result;
    }

    public addSnapshot(snapshot: Snapshot, isAutoCompleteSnapshot: boolean) {
        if (this.hijackUndoSnapshotCallback) {
            this.hijackUndoSnapshotCallback(snapshot);
        } else {
            addSnapshotV2(this.snapshots, snapshot, isAutoCompleteSnapshot);
            this.onChange();
        }
    }

    public clearRedo() {
        clearProceedingSnapshotsV2(this.snapshots);
        this.onChange();
    }

    public getSnapshots() {
        return this.snapshots.snapshots;
    }

    public getCurrentIndex() {
        return this.snapshots.currentIndex;
    }

    public getAutoCompleteIndex() {
        return this.snapshots.autoCompleteIndex;
    }

    public canUndoAutoComplete() {
        return canUndoAutoComplete(this.snapshots);
    }
}
