import { Snapshots } from 'roosterjs-editor-types';

/**
 * Create initial snapshots
 * @param maxSize max size of all snapshots
 */
export default function createSnapshots(maxSize: number): Snapshots {
    return {
        snapshots: [],
        totalSize: 0,
        currentIndex: -1,
        maxSize,
    };
}
