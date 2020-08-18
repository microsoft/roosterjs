import { Snapshots, UndoSnapshotsService } from 'roosterjs-editor-types';
import {
    addSnapshot,
    canMoveCurrentSnapshot,
    moveCurrentSnapsnot,
    clearProceedingSnapshots,
} from 'roosterjs-editor-dom';

export default class UndoSnapshots implements UndoSnapshotsService {
    constructor(private snapshots: Snapshots, private onChange: () => void) {}

    public canMove(delta: number): boolean {
        return canMoveCurrentSnapshot(this.snapshots, delta);
    }

    public move(delta: number): string {
        const result = moveCurrentSnapsnot(this.snapshots, delta);
        this.onChange();
        return result;
    }

    public addSnapshot(snapshot: string) {
        addSnapshot(this.snapshots, snapshot);
        this.onChange();
    }

    public clearRedo() {
        clearProceedingSnapshots(this.snapshots);
        this.onChange();
    }

    public getSnapshots() {
        return this.snapshots.snapshots;
    }

    public getCurrentIndex() {
        return this.snapshots.currentIndex;
    }
}
