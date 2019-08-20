import clearProceedingSnapshots from '../../snapshots/clearProceedingSnapshots';
import { Snapshots } from 'roosterjs-editor-types';

describe('clearProceedingSnapshots', () => {
    function runTest(
        currentIndex: number,
        snapshotArray: string[],
        expectedSize: number,
        expectedArray: string[]
    ) {
        let snapshots: Snapshots = {
            currentIndex,
            totalSize: snapshotArray.reduce((v, s) => {
                v += s.length;
                return v;
            }, 0),
            snapshots: snapshotArray,
            maxSize: 100,
        };

        clearProceedingSnapshots(snapshots);

        expect(snapshots.snapshots).toEqual(expectedArray);
        expect(snapshots.totalSize).toBe(expectedSize);
    }

    it('Empty snapshots', () => {
        runTest(-1, [], 0, []);
    });

    it('One snapshots, start from -1', () => {
        runTest(-1, ['test1'], 0, []);
    });

    it('One snapshots, start from 0', () => {
        runTest(0, ['test1'], 5, ['test1']);
    });

    it('Two snapshots, start from 0', () => {
        runTest(0, ['test1', 'test2'], 5, ['test1']);
    });

    it('Two snapshots, start from 1', () => {
        runTest(1, ['test1', 'test2'], 10, ['test1', 'test2']);
    });
});
