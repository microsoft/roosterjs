import canMoveCurrentSnapshot from './canMoveCurrentSnapshot';
import { Snapshots } from 'roosterjs-editor-types';

/**
 * Clear all snapshots after the current one
 * @param snapshots The snapshots data structure to clear
 */
export default function clearProceedingSnapshots(snapshots: Snapshots) {
    if (canMoveCurrentSnapshot(snapshots, 1)) {
        let removedSize = 0;
        for (let i = snapshots.currentIndex + 1; i < snapshots.snapshots.length; i++) {
            removedSize += snapshots.snapshots[i].length;
        }
        snapshots.snapshots.splice(snapshots.currentIndex + 1);
        snapshots.totalSize -= removedSize;
    }
}
