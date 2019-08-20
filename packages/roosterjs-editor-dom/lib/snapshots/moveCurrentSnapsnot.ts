import canMoveCurrentSnapshot from './canMoveCurrentSnapshot';
import { Snapshots } from 'roosterjs-editor-types';

/**
 * Move current snapshot with the given step if can move this step. Otherwise no action and return null
 * @param snapshots The snapshots data structure to move
 * @param step The step to move
 * @returns If can move with the given step, returns the snapshot after move, otherwise null
 */
export default function moveCurrentSnapsnot(snapshots: Snapshots, step: number): string {
    if (canMoveCurrentSnapshot(snapshots, step)) {
        snapshots.currentIndex += step;
        return snapshots.snapshots[snapshots.currentIndex];
    } else {
        return null;
    }
}
