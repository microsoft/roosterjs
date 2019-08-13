import canMoveCurrentSnapshot from '../../snapshots/canMoveCurrentSnapshot';
import { Snapshots } from 'roosterjs-editor-types';

describe('canMoveCurrentSnapshot', () => {
    function runTest(
        currentIndex: number,
        snapshotArray: string[],
        result1: boolean,
        resultMinus1: boolean,
        result2: boolean,
        resultMinus2: boolean,
        result5: boolean,
        resultMinus5: boolean
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

        expect(canMoveCurrentSnapshot(snapshots, 1)).toBe(result1, 'Move with 1');
        expect(canMoveCurrentSnapshot(snapshots, -1)).toBe(resultMinus1, 'Move with -1');
        expect(canMoveCurrentSnapshot(snapshots, 2)).toBe(result2, 'Move with 2');
        expect(canMoveCurrentSnapshot(snapshots, -2)).toBe(resultMinus2, 'Move with -2');
        expect(canMoveCurrentSnapshot(snapshots, 5)).toBe(result5, 'Move with 5');
        expect(canMoveCurrentSnapshot(snapshots, -5)).toBe(resultMinus5, 'Move with -5');
    }

    it('Empty snapshots', () => {
        runTest(-1, [], false, false, false, false, false, false);
    });

    it('One snapshots, start from -1', () => {
        runTest(-1, ['test1'], true, false, false, false, false, false);
    });

    it('One snapshots, start from 0', () => {
        runTest(0, ['test1'], false, false, false, false, false, false);
    });

    it('One snapshots, start from 1', () => {
        runTest(1, ['test1'], false, true, false, false, false, false);
    });

    it('Two snapshots, start from 0', () => {
        runTest(0, ['test1', 'test2'], true, false, false, false, false, false);
    });

    it('Two snapshots, start from 1', () => {
        runTest(1, ['test1', 'test2'], false, true, false, false, false, false);
    });

    it('10 snapshots, start from 0', () => {
        runTest(
            0,
            [
                'test1',
                'test2',
                'test3',
                'test4',
                'test5',
                'test1',
                'test2',
                'test3',
                'test4',
                'test5',
            ],
            true,
            false,
            true,
            false,
            true,
            false
        );
    });

    it('10 snapshots, start from 5', () => {
        runTest(
            5,
            [
                'test1',
                'test2',
                'test3',
                'test4',
                'test5',
                'test1',
                'test2',
                'test3',
                'test4',
                'test5',
            ],
            true,
            true,
            true,
            true,
            false,
            true
        );
    });
});
