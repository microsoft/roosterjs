import { Snapshots } from 'roosterjs-editor-types';

// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAXSIZELIMIT = 1e7;

/**
 * Create initial snapshots
 * @param maxSize max size of all snapshots
 */
export default function createSnapshots(maxSize: number = MAXSIZELIMIT): Snapshots {
    return {
        snapshots: [],
        totalSize: 0,
        currentIndex: -1,
        maxSize,
    };
}
