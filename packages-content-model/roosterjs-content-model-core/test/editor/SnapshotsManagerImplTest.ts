import { createSnapshotsManager } from '../../lib/editor/SnapshotsManagerImpl';
import { Snapshot, Snapshots, SnapshotsManager } from 'roosterjs-content-model-types';

describe('SnapshotsManagerImpl.ctor', () => {
    it('No param', () => {
        const service = createSnapshotsManager();

        expect((service as any).snapshots).toEqual({
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 1e7,
        });
    });

    it('Has param', () => {
        const mockedSnapshots = 'SNAPSHOTS' as any;
        const service = createSnapshotsManager(mockedSnapshots);

        expect((service as any).snapshots).toEqual(mockedSnapshots);
    });
});

describe('SnapshotsManagerImpl.addSnapshot', () => {
    let service: SnapshotsManager;
    let snapshots: Snapshots;

    beforeEach(() => {
        snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 1e7,
        };
        service = createSnapshotsManager(snapshots);
    });

    function runTest(
        maxSize: number,
        action: () => void,
        currentIndex: number,
        totalSize: number,
        snapshotArray: Snapshot[],
        autoCompleteIndex: number
    ) {
        (snapshots as any).maxSize = maxSize;

        action();
        expect(snapshots.currentIndex).toBe(currentIndex);
        expect(snapshots.totalSize).toBe(totalSize);
        expect(snapshots.snapshots).toEqual(snapshotArray);
        expect(snapshots.autoCompleteIndex).toBe(autoCompleteIndex);
    }

    it('Add first snapshot', () => {
        runTest(
            100,
            () => {
                service.addSnapshot(
                    {
                        html: 'test',
                        isDarkMode: false,
                    },
                    false
                );
            },
            0,
            4,
            [{ html: 'test', isDarkMode: false }],
            -1
        );
    });

    it('Add snapshot as autoComplete', () => {
        runTest(
            100,
            () => {
                service.addSnapshot(
                    {
                        html: 'test',
                        isDarkMode: false,
                    },
                    true
                );
            },
            0,
            4,
            [{ html: 'test', isDarkMode: false }],
            0
        );
    });

    it('Add second snapshot', () => {
        runTest(
            100,
            () => {
                service.addSnapshot(
                    {
                        html: 'test1',
                        isDarkMode: false,
                    },
                    false
                );
                service.addSnapshot(
                    {
                        html: 'test2',
                        isDarkMode: false,
                    },
                    false
                );
            },
            1,
            10,
            [
                { html: 'test1', isDarkMode: false },
                { html: 'test2', isDarkMode: false },
            ],
            -1
        );
    });

    it('Add oversize snapshot', () => {
        runTest(
            5,
            () => {
                service.addSnapshot(
                    {
                        html: 'test01',
                        isDarkMode: false,
                    },
                    false
                );
            },
            -1,
            0,
            [],
            -1
        );
    });

    it('Add snapshot that need to remove existing one because over size', () => {
        runTest(
            5,
            () => {
                service.addSnapshot(
                    {
                        html: 'test1',
                        isDarkMode: false,
                    },
                    false
                );
                service.addSnapshot(
                    {
                        html: 'test2',
                        isDarkMode: false,
                    },
                    false
                );
            },
            0,
            5,
            [
                {
                    html: 'test2',
                    isDarkMode: false,
                },
            ],
            -1
        );
    });

    it('Add snapshot that need to remove proceeding snapshots', () => {
        runTest(
            100,
            () => {
                service.addSnapshot(
                    {
                        html: 'test1',
                        isDarkMode: false,
                    },
                    false
                );
                service.addSnapshot(
                    {
                        html: 'test2',
                        isDarkMode: false,
                    },
                    false
                );
                snapshots.currentIndex = 0;
                service.addSnapshot(
                    {
                        html: 'test03',
                        isDarkMode: false,
                    },
                    false
                );
            },
            1,
            11,
            [
                {
                    html: 'test1',
                    isDarkMode: false,
                },
                {
                    html: 'test03',
                    isDarkMode: false,
                },
            ],
            -1
        );
    });

    it('Add identical snapshot', () => {
        runTest(
            100,
            () => {
                service.addSnapshot(
                    {
                        html: 'test1',
                        isDarkMode: false,
                    },
                    false
                );
                service.addSnapshot(
                    {
                        html: 'test1',
                        isDarkMode: false,
                    },
                    false
                );
            },
            0,
            5,
            [
                {
                    html: 'test1',
                    isDarkMode: false,
                },
            ],
            -1
        );
    });

    it('Add snapshot with entity state', () => {
        const mockedEntityStates = 'ENTITYSTATES' as any;

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
            },
        ]);

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
            },
        ]);

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
            },
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
        ]);
    });

    it('Add snapshot with entity state with equal entity states', () => {
        const mockedEntityStates = 'ENTITYSTATES' as any;

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
            },
        ]);

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
            },
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
        ]);

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
            },
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
        ]);
    });

    it('Add snapshot with entity state with different entity states', () => {
        const mockedEntityStates = 'ENTITYSTATES' as any;
        const mockedEntityStates2 = 'ENTITYSTATES2' as any;

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
            },
        ]);

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
            },
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
        ]);

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates2,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
            },
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates2,
            },
        ]);
    });

    it('Add snapshot without entity state after a snapshot with empty state', () => {
        const mockedEntityStates = 'ENTITYSTATES' as any;

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
        ]);

        service.addSnapshot(
            {
                html: 'test',
                isDarkMode: false,
            },
            false
        );

        expect(snapshots.snapshots).toEqual([
            {
                html: 'test',
                isDarkMode: false,
                entityStates: mockedEntityStates,
            },
        ]);
    });

    it('Has onChanged', () => {
        const onChanged = jasmine.createSpy('onChanged');
        snapshots.onChanged = onChanged;

        runTest(
            100,
            () => {
                service.addSnapshot(
                    {
                        html: 'test',
                        isDarkMode: false,
                    },
                    false
                );
            },
            0,
            4,
            [{ html: 'test', isDarkMode: false }],
            -1
        );

        expect(onChanged).toHaveBeenCalledWith('add');
    });
});

describe('SnapshotsManagerImpl.canMove', () => {
    let service: SnapshotsManager;
    let snapshots: Snapshots;

    beforeEach(() => {
        snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 100,
        };
        service = createSnapshotsManager(snapshots);
    });

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
        snapshots.currentIndex = currentIndex;
        snapshots.totalSize = snapshotArray.reduce((v, s) => {
            v += s.length;
            return v;
        }, 0);

        snapshots.snapshots = snapshotArray.map(
            x =>
                ({
                    html: x,
                } as any)
        );

        expect(service.canMove(1)).toBe(result1, 'Move with 1');
        expect(service.canMove(-1)).toBe(resultMinus1, 'Move with -1');
        expect(service.canMove(2)).toBe(result2, 'Move with 2');
        expect(service.canMove(-2)).toBe(resultMinus2, 'Move with -2');
        expect(service.canMove(5)).toBe(result5, 'Move with 5');
        expect(service.canMove(-5)).toBe(resultMinus5, 'Move with -5');
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

    it('with onChanged', () => {
        const onChanged = jasmine.createSpy('onChanged');
        snapshots.onChanged = onChanged;

        runTest(1, ['test1', 'test2'], false, true, false, false, false, false);

        expect(onChanged).not.toHaveBeenCalled();
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

describe('SnapshotsManagerImpl.move', () => {
    let service: SnapshotsManager;
    let snapshots: Snapshots;

    beforeEach(() => {
        snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 100,
        };
        service = createSnapshotsManager(snapshots);
    });

    function runTest(
        currentIndex: number,
        snapshotArray: string[],
        step: number,
        expectedIndex: number,
        expectedSnapshot: string | null
    ) {
        snapshots.currentIndex = currentIndex;
        snapshots.totalSize = snapshotArray.reduce((v, s) => {
            v += s.length;
            return v;
        }, 0);

        snapshots.snapshots = snapshotArray.map(
            x =>
                ({
                    html: x,
                } as any)
        );

        const result = service.move(step);

        expect(snapshots.currentIndex).toEqual(expectedIndex);

        if (expectedSnapshot) {
            expect(result!.html).toBe(expectedSnapshot);
        } else {
            expect(result).toBeNull();
        }
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

    it('with onChanged', () => {
        const onChanged = jasmine.createSpy('onChanged');
        snapshots.onChanged = onChanged;

        runTest(1, ['test1', 'test2', 'test3'], 2, 1, null);

        expect(onChanged).toHaveBeenCalledWith('move');
    });
});

describe('SnapshotsManagerImpl.clearRedo', () => {
    let service: SnapshotsManager;
    let snapshots: Snapshots;

    beforeEach(() => {
        snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 100,
        };
        service = createSnapshotsManager(snapshots);
    });

    function runTest(
        currentIndex: number,
        snapshotArray: string[],
        expectedSize: number,
        expectedArray: string[]
    ) {
        snapshots.currentIndex = currentIndex;
        snapshots.totalSize = snapshotArray.reduce((v, s) => {
            v += s.length;
            return v;
        }, 0);

        snapshots.snapshots = snapshotArray.map(
            x =>
                ({
                    html: x,
                } as any)
        );

        service.clearRedo();

        expect(snapshots.snapshots).toEqual(
            expectedArray.map(
                x =>
                    ({
                        html: x,
                    } as any)
            )
        );
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

    it('with onChanged, not cleared', () => {
        const onChanged = jasmine.createSpy('onChanged');
        snapshots.onChanged = onChanged;

        runTest(1, ['test1', 'test2'], 10, ['test1', 'test2']);

        expect(onChanged).not.toHaveBeenCalled();
    });

    it('with onChanged, cleared', () => {
        const onChanged = jasmine.createSpy('onChanged');
        snapshots.onChanged = onChanged;

        runTest(0, ['test1', 'test2'], 5, ['test1']);

        expect(onChanged).toHaveBeenCalledWith('clear');
    });
});

describe('SnapshotsManagerImpl.canUndoAutoComplete', () => {
    let service: SnapshotsManager;
    let snapshots: Snapshots;

    beforeEach(() => {
        snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 100,
        };
        service = createSnapshotsManager(snapshots);
    });

    it('can undo', () => {
        snapshots.autoCompleteIndex = 1;
        snapshots.currentIndex = 2;

        expect(service.canUndoAutoComplete()).toBeTrue();
    });

    it('cannot undo - 1', () => {
        snapshots.autoCompleteIndex = 1;
        snapshots.currentIndex = 3;

        expect(service.canUndoAutoComplete()).toBeFalse();
    });

    it('cannot undo - 2', () => {
        snapshots.autoCompleteIndex = 1;
        snapshots.currentIndex = 1;

        expect(service.canUndoAutoComplete()).toBeFalse();
    });

    it('cannot undo - 3', () => {
        snapshots.autoCompleteIndex = -1;
        snapshots.currentIndex = 0;

        expect(service.canUndoAutoComplete()).toBeFalse();
    });

    it('with onChanged, cleared', () => {
        const onChanged = jasmine.createSpy('onChanged');
        snapshots.onChanged = onChanged;

        snapshots.autoCompleteIndex = 1;
        snapshots.currentIndex = 1;

        expect(service.canUndoAutoComplete()).toBeFalse();

        expect(onChanged).not.toHaveBeenCalled();
    });
});
