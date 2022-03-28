import { Snapshots } from 'roosterjs-editor-types';

/**
 * Create initial snapshots
 * @param maxSize max size of all snapshots
 */
export default function createSnapshots<T = string>(maxSize: number): Snapshots<T> {
    return {
        snapshots: [],
        totalSize: 0,
        currentIndex: -1,
        autoCompleteIndex: -1,
        maxSize,
    };
}
