import canMoveCurrentSnapshot from './canMoveCurrentSnapshot';
import { Snapshots } from 'roosterjs-editor-types';

/**
 * Move current snapshot with the given step if can move this step. Otherwise no action and return null
 * @param snapshots The snapshots data structure to move
 * @param step The step to move
 * @returns If can move with the given step, returns the snapshot after move, otherwise null
 */
export default function moveCurrentSnapshot<T = string>(
    snapshots: Snapshots<T>,
    step: number
): T | null {
    if (canMoveCurrentSnapshot(snapshots, step)) {
        snapshots.currentIndex += step;
        snapshots.autoCompleteIndex = -1;
        return snapshots.snapshots[snapshots.currentIndex];
    } else {
        return null;
    }
}

/**
 * @deprecated
 * For backward compatibility only
 */
export const moveCurrentSnapsnot = moveCurrentSnapshot;
