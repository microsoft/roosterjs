import moveCurrentSnapsnot from '../../snapshots/moveCurrentSnapsnot';
import { Snapshots } from 'roosterjs-editor-types';

describe('moveCurrentSnapsnot', () => {
    function runTest(
        currentIndex: number,
        snapshotArray: string[],
        step: number,
        expectedIndex: number,
        expectedSnapshot: string
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

        let result = moveCurrentSnapsnot(snapshots, step);

        expect(snapshots.currentIndex).toEqual(expectedIndex);
        expect(result).toBe(expectedSnapshot);
    }

    it('Empty snapshots', () => {
        runTest(-1, [], 0, -1, null);
    });

    it('One snapshots, start from -1', () => {
        runTest(-1, ['test1'], 1, 0, 'test1');
    });

    it('One snapshots, start from 0, move 0', () => {
        runTest(0, ['test1'], 0, 0, 'test1');
    });

    it('One snapshots, start from 0, move 1', () => {
        runTest(0, ['test1'], 1, 0, null);
    });

    it('One snapshots, start from 0, move -1', () => {
        runTest(0, ['test1'], -1, 0, null);
    });

    it('Two snapshots, start from 0, move 1', () => {
        runTest(0, ['test1', 'test2'], 1, 1, 'test2');
    });

    it('Two snapshots, start from 0, move -1', () => {
        runTest(0, ['test1', 'test2'], -1, 0, null);
    });

    it('Two snapshots, start from 1, move -1', () => {
        runTest(1, ['test1', 'test2'], -1, 0, 'test1');
    });

    it('3 snapshots, start from 1, move 2', () => {
        runTest(1, ['test1', 'test2', 'test3'], 2, 1, null);
    });
});
