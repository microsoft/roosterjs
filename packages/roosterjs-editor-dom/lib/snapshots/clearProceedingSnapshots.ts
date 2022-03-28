import canMoveCurrentSnapshot from './canMoveCurrentSnapshot';
import { Snapshot, Snapshots } from 'roosterjs-editor-types';

/**
 * Clear all snapshots after the current one
 * @param snapshots The snapshots data structure to clear
 */
export default function clearProceedingSnapshots(snapshots: Snapshots<string>): void;

/**
 * Clear all snapshots after the current one
 * @param snapshots The snapshots data structure to clear
 */
export default function clearProceedingSnapshots<T>(
    snapshots: Snapshots<T>,
    getLength: (snapshot: T) => number
): void;

/**
 * Clear all snapshots after the current one
 * @param snapshots The snapshots data structure to clear
 */
export default function clearProceedingSnapshots<T>(
    snapshots: Snapshots<T>,
    getLength?: (snapshot: T) => number
) {
    getLength = getLength || (str => (<string>(<any>str))?.length || 0);
    if (canMoveCurrentSnapshot(snapshots, 1)) {
        let removedSize = 0;
        for (let i = snapshots.currentIndex + 1; i < snapshots.snapshots.length; i++) {
            removedSize += getLength(snapshots.snapshots[i]);
        }
        snapshots.snapshots.splice(snapshots.currentIndex + 1);
        snapshots.totalSize -= removedSize;
        snapshots.autoCompleteIndex = -1;
    }
}

/**
 * Clear all snapshots after the current one
 * @param snapshots The snapshots data structure to clear
 */
export function clearProceedingSnapshotsV2(snapshots: Snapshots<Snapshot>) {
    clearProceedingSnapshots(snapshots, s => s.html?.length || 0);
}
