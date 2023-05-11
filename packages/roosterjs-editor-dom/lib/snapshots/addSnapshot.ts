import clearProceedingSnapshots from './clearProceedingSnapshots';
import { Snapshot, Snapshots } from 'roosterjs-editor-types';

/**
 * Add a new snapshot to the given snapshots data structure
 * @param snapshots The snapshots data structure to add new snapshot into
 * @param html The snapshot HTML to add
 * @param isAutoCompleteSnapshot Whether this is a snapshot before auto complete action
 */
export default function addSnapshot(
    snapshots: Snapshots<string>,
    html: string,
    isAutoCompleteSnapshot: boolean
): void;

/**
 * Add a new snapshot to the given snapshots data structure
 * @param snapshots The snapshots data structure to add new snapshot into
 * @param snapshot The generic snapshot object to add
 * @param isAutoCompleteSnapshot Whether this is a snapshot before auto complete action
 * @param getLength A callback function to calculate length of the snapshot
 * @param isSame A callback function to check if the given snapshots are the same
 */
export default function addSnapshot<T>(
    snapshots: Snapshots<T>,
    snapshot: T,
    isAutoCompleteSnapshot: boolean,
    getLength: (snapshot: T) => number,
    isSame: (snapshot1: T, snapshot2: T) => boolean
): void;

export default function addSnapshot<T>(
    snapshots: Snapshots<T>,
    snapshot: T,
    isAutoCompleteSnapshot: boolean,
    getLength?: (snapshot: T) => number,
    compare?: (snapshot1: T, snapshot2: T) => boolean
) {
    getLength = getLength || (str => (<string>(<any>str))?.length || 0);
    compare = compare || defaultCompare;

    const currentSnapshot = snapshots.snapshots[snapshots.currentIndex];
    if (snapshots.currentIndex < 0 || !currentSnapshot || !compare(snapshot, currentSnapshot)) {
        clearProceedingSnapshots(snapshots, getLength);
        snapshots.snapshots.push(snapshot);
        snapshots.currentIndex++;
        snapshots.totalSize += getLength(snapshot);

        let removeCount = 0;
        while (
            removeCount < snapshots.snapshots.length &&
            snapshots.totalSize > snapshots.maxSize
        ) {
            snapshots.totalSize -= getLength(snapshots.snapshots[removeCount]);
            removeCount++;
        }

        if (removeCount > 0) {
            snapshots.snapshots.splice(0, removeCount);
            snapshots.currentIndex -= removeCount;
            snapshots.autoCompleteIndex -= removeCount;
        }

        if (isAutoCompleteSnapshot) {
            snapshots.autoCompleteIndex = snapshots.currentIndex;
        }
    } else if (currentSnapshot && compare(snapshot, currentSnapshot)) {
        // replace the currentSnapshot, to update other data such as metadata
        snapshots.snapshots.splice(snapshots.currentIndex, 1, snapshot);
    }
}

/**
 * Add a new snapshot to the given snapshots data structure
 * @param snapshots The snapshots data structure to add new snapshot into
 * @param snapshot The snapshot object to add
 * @param isAutoCompleteSnapshot Whether this is a snapshot before auto complete action
 */
export function addSnapshotV2(
    snapshots: Snapshots<Snapshot>,
    snapshot: Snapshot,
    isAutoCompleteSnapshot: boolean,
    force?: boolean
) {
    addSnapshot(
        snapshots,
        snapshot,
        isAutoCompleteSnapshot,
        s => s.html?.length || 0,
        force ? returnFalse : compareSnapshots
    );
}

function compareSnapshots(s1: Snapshot, s2: Snapshot) {
    return s1.html == s2.html;
}

function defaultCompare<T>(s1: T, s2: T) {
    return s1 == s2;
}

function returnFalse() {
    return false;
}
