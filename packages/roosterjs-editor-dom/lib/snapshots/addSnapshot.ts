import clearProceedingSnapshots from './clearProceedingSnapshots';
import { Snapshots } from 'roosterjs-editor-types';

/**
 * Add a new snapshot to the given snapshots data structure
 * @param snapshots The snapshots data structure to add new snapshot into
 * @param snapshot The snapshot to add
 */
export default function addSnapshot(snapshots: Snapshots, snapshot: string) {
    if (snapshots.currentIndex < 0 || snapshot != snapshots.snapshots[snapshots.currentIndex]) {
        clearProceedingSnapshots(snapshots);
        snapshots.snapshots.push(snapshot);
        snapshots.currentIndex++;
        snapshots.totalSize += snapshot.length;

        let removeCount = 0;
        while (
            removeCount < snapshots.snapshots.length &&
            snapshots.totalSize > snapshots.maxSize
        ) {
            snapshots.totalSize -= snapshots.snapshots[removeCount].length;
            removeCount++;
        }

        if (removeCount > 0) {
            snapshots.snapshots.splice(0, removeCount);
            snapshots.currentIndex -= removeCount;
        }
    }
}
