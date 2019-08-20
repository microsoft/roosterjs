import { Snapshots } from 'roosterjs-editor-types';
import { UndoSnapshotsService } from 'roosterjs-editor-core';
import {
    addSnapshot,
    canMoveCurrentSnapshot,
    moveCurrentSnapsnot,
    clearProceedingSnapshots,
} from 'roosterjs-editor-dom';

export default class UndoSnapshots implements UndoSnapshotsService {
    constructor(private snapshots: Snapshots) {}

    public canMove(delta: number): boolean {
        return canMoveCurrentSnapshot(this.snapshots, delta);
    }

    public move(delta: number): string {
        return moveCurrentSnapsnot(this.snapshots, delta);
    }

    public addSnapshot(snapshot: string) {
        addSnapshot(this.snapshots, snapshot);
    }

    public clearRedo() {
        clearProceedingSnapshots(this.snapshots);
    }
}
