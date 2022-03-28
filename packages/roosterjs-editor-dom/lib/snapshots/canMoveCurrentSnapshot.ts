import { Snapshots } from 'roosterjs-editor-types';

/**
 * Check whether can move current snapshot with the given step
 * @param snapshots The snapshots data structure to check
 * @param step The step to check, can be positive, negative or 0
 * @returns True if can move current snapshot with the given step, otherwise false
 */
export default function canMoveCurrentSnapshot<T = string>(
    snapshots: Snapshots<T>,
    step: number
): boolean {
    let newIndex = snapshots.currentIndex + step;
    return newIndex >= 0 && newIndex < snapshots.snapshots.length;
}
