import addSnapshot from '../../snapshots/addSnapshot';
import createSnapshots from '../../snapshots/createSnapshots';
import { Snapshots } from 'roosterjs-editor-types';

describe('addSnapshot', () => {
    function runTest(
        maxSize: number,
        action: (action: Snapshots) => void,
        currentIndex: number,
        totalSize: number,
        snapshotArray: string[]
    ) {
        let snapshots = createSnapshots(maxSize);
        action(snapshots);
        expect(snapshots.currentIndex).toBe(currentIndex);
        expect(snapshots.totalSize).toBe(totalSize);
        expect(snapshots.snapshots).toEqual(snapshotArray);
    }

    it('Add first snapshot', () => {
        runTest(
            100,
            snapshots => {
                addSnapshot(snapshots, 'test');
            },
            0,
            4,
            ['test']
        );
    });

    it('Add second snapshot', () => {
        runTest(
            100,
            snapshots => {
                addSnapshot(snapshots, 'test1');
                addSnapshot(snapshots, 'test2');
            },
            1,
            10,
            ['test1', 'test2']
        );
    });

    it('Add oversize snapshot', () => {
        runTest(
            5,
            snapshots => {
                addSnapshot(snapshots, 'test01');
            },
            -1,
            0,
            []
        );
    });

    it('Add snapshot that need to remove existing one because over size', () => {
        runTest(
            5,
            snapshots => {
                addSnapshot(snapshots, 'test');
                addSnapshot(snapshots, 'test2');
            },
            0,
            5,
            ['test2']
        );
    });

    it('Add snapshot that need to remove proceeding snapshots', () => {
        runTest(
            100,
            snapshots => {
                addSnapshot(snapshots, 'test1');
                addSnapshot(snapshots, 'test2');
                snapshots.currentIndex = 0;
                addSnapshot(snapshots, 'test03');
            },
            1,
            11,
            ['test1', 'test03']
        );
    });

    it('Add identical snapshot', () => {
        runTest(
            100,
            snapshots => {
                addSnapshot(snapshots, 'test1');
                addSnapshot(snapshots, 'test1');
            },
            0,
            5,
            ['test1']
        );
    });
});
