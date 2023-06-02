import * as getSelectionPath from 'roosterjs-editor-dom/lib/selection/getSelectionPath';
import createEditorCore from './createMockEditorCore';
import { addUndoSnapshot } from '../../lib/coreApi/addUndoSnapshot';
import { Position } from 'roosterjs-editor-dom';
import {
    PluginEventType,
    Snapshot,
    UndoSnapshotsService,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

describe('addUndoSnapshot', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null input', () => {
        const core = createEditorCore(div, {});
        spyOn(core.undo.snapshotsService, 'addSnapshot');
        div.innerHTML = 'test';
        addUndoSnapshot(core, null, null, false);
        expect(core.undo.snapshotsService.addSnapshot).toHaveBeenCalledWith(
            {
                html: 'test',
                metadata: {
                    type: 0,
                    isDarkMode: false,
                    start: [],
                    end: [],
                },
                knownColors: [],
                entityStates: undefined,
            },
            false
        );
    });

    it('null input, verify snapshot is added', () => {
        const core = createEditorCore(div, {});
        core.undo.snapshotsService = createUndoSnapshotService(jasmine.createSpy());
        div.innerHTML = 'test1';
        addUndoSnapshot(core, null, null, false);
        expect(core.undo.snapshotsService.addSnapshot).toHaveBeenCalledWith(
            {
                html: 'test1',
                metadata: {
                    type: 0,
                    isDarkMode: false,
                    start: [],
                    end: [],
                },
                knownColors: [],
                entityStates: undefined,
            },
            false
        );
    });

    it('undo with callback', () => {
        const range = document.createRange();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => range,
            },
        });
        div.innerHTML = 'result 1';
        core.undo = {
            snapshotsService: createUndoSnapshotService(jasmine.createSpy()),
            isRestoring: false,
            hasNewContent: false,
            isNested: false,
            autoCompletePosition: null,
        };

        addUndoSnapshot(
            core,
            (pos1, pos2) => {
                expect(pos1.equalTo(Position.getStart(range).normalize())).toBeTruthy();
                expect(pos2.equalTo(Position.getEnd(range).normalize())).toBeTruthy();
                expect(core.undo.isNested).toBeTruthy();
                div.innerHTML = 'result 2';
            },
            null,
            false
        );
        expect(core.undo.snapshotsService.addSnapshot).toHaveBeenCalledTimes(2);

        const snapshot1 = (<jasmine.Spy>core.undo.snapshotsService.addSnapshot).calls.argsFor(0)[0];
        const snapshot2 = (<jasmine.Spy>core.undo.snapshotsService.addSnapshot).calls.argsFor(1)[0];

        expect(snapshot1).toEqual({
            html: 'result 1',
            metadata: { type: 0, isDarkMode: false, start: [], end: [] },
            knownColors: [],
            entityStates: undefined,
        });
        expect(snapshot2).toEqual({
            html: 'result 2',
            metadata: { type: 0, isDarkMode: false, start: [], end: [] },
            knownColors: [],
            entityStates: undefined,
        });
        expect(core.undo.isNested).toBeFalsy();
    });

    it('undo with callback and change source', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                triggerEvent,
            },
        });
        // spyOn(addUndoSnapshot, 'default');
        const data = {
            value: 1,
        };

        addUndoSnapshot(core, () => data, 'change source', false);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                source: 'change source',
                data,
                additionalData: undefined,
            },
            true
        );
    });

    it('nest call addUndoSnapshot', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                triggerEvent,
            },
        });
        const addSnapshot = jasmine.createSpy('addSnapshot');

        core.api.getContent = () => 'test';
        core.undo.snapshotsService = createUndoSnapshotService(addSnapshot);

        expect(core.undo.isNested).toBeFalsy();
        addUndoSnapshot(
            core,
            () => {
                expect(core.undo.isNested).toBeTruthy();

                core.api.getContent = () => 'test2';

                addUndoSnapshot(
                    core,
                    () => {
                        expect(core.undo.isNested).toBeTruthy();
                    },
                    null,
                    false
                );
            },
            'change source',
            false
        );

        expect(addSnapshot).toHaveBeenCalledTimes(2);
        expect(core.undo.isNested).toBeFalsy();
    });

    it('throw from callback, isNested should also be reset', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                getContent: () => 'test',
                triggerEvent,
            },
        });

        expect(core.undo.isNested).toBeFalsy();
        try {
            addUndoSnapshot(
                core,
                () => {
                    expect(core.undo.isNested).toBeTruthy();
                    throw new Error();
                },
                null,
                true
            );
        } catch {}
        expect(core.undo.isNested).toBeFalsy(null);
    });

    it('auto complete mode', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                triggerEvent,
            },
        });

        div.innerHTML = 'test 1';

        expect(core.undo.snapshotsService.canUndoAutoComplete()).toBeFalsy();
        addUndoSnapshot(
            core,
            () => {
                div.innerHTML = 'test 2';
            },
            null,
            true
        );
        expect(core.undo.snapshotsService.canUndoAutoComplete()).toBeTruthy();
    });

    it('shadow edit', () => {
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const addSnapshot = jasmine.createSpy('addSnapshot');
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                triggerEvent,
            },
        });

        core.lifecycle.shadowEditFragment = document.createDocumentFragment();
        core.undo.snapshotsService.addSnapshot = addSnapshot;

        let content = 'test 1';
        spyOn(core.api, 'getContent').and.callFake(() => content);

        addUndoSnapshot(
            core,
            () => {
                content = 'test 2';
            },
            null,
            true
        );
        expect(triggerEvent).not.toHaveBeenCalled();
        expect(addSnapshot).not.toHaveBeenCalled();
    });

    it('Add undo snapshot in dark mode', () => {
        const core = createEditorCore(div, {
            inDarkMode: true,
        });
        const addSnapshot = jasmine.createSpy('addSnapshot');
        core.undo.snapshotsService = createUndoSnapshotService(addSnapshot);

        addUndoSnapshot(core, null, '', false);
        expect(addSnapshot).toHaveBeenCalledWith(
            {
                html: '',
                metadata: {
                    type: SelectionRangeTypes.Normal,
                    isDarkMode: true,
                    start: [],
                    end: [],
                },
                knownColors: [],
                entityStates: undefined,
            },
            false
        );
    });

    it('Add undo snapshot with normal selection', () => {
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRangeEx: () =>
                    <any>{
                        type: SelectionRangeTypes.Normal,
                        isDarkMode: false,
                        ranges: [{}],
                    },
            },
        });
        const addSnapshot = jasmine.createSpy('addSnapshot');
        const selectionPath = {
            start: [1],
            end: [2],
        };
        core.undo.snapshotsService = createUndoSnapshotService(addSnapshot);

        spyOn(getSelectionPath, 'default').and.returnValue(selectionPath);

        addUndoSnapshot(core, null, '', false);
        expect(addSnapshot).toHaveBeenCalledWith(
            {
                html: '',
                metadata: {
                    type: SelectionRangeTypes.Normal,
                    isDarkMode: false,
                    ...selectionPath,
                },
                knownColors: [],
                entityStates: undefined,
            },
            false
        );
    });

    it('Add undo snapshot with table selection', () => {
        const coordinates = {
            firstCell: { x: 1, y: 2 },
            lastCell: { x: 3, y: 4 },
        };
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRangeEx: () =>
                    <any>{
                        type: SelectionRangeTypes.TableSelection,
                        table: {
                            id: 'tableId',
                        },
                        isDarkMode: false,
                        coordinates,
                    },
            },
        });
        const addSnapshot = jasmine.createSpy('addSnapshot');
        core.undo.snapshotsService = createUndoSnapshotService(addSnapshot);

        addUndoSnapshot(core, null, '', false);
        expect(addSnapshot).toHaveBeenCalledWith(
            {
                html: '',
                metadata: {
                    type: SelectionRangeTypes.TableSelection,
                    tableId: 'tableId',
                    isDarkMode: false,
                    ...coordinates,
                },
                knownColors: [],
                entityStates: undefined,
            },
            false
        );
    });

    it('Do not add snapshot before callback when there is getEntityState callback', () => {
        const core = createEditorCore(div, {});
        const addSnapshot = jasmine.createSpy('addSnapshot');
        const mockedState = 'STATE' as any;

        core.undo.snapshotsService = createUndoSnapshotService(addSnapshot);

        addUndoSnapshot(
            core,
            () => {
                div.innerHTML = 'test';
            },
            null,
            false,
            {
                getEntityState: () => mockedState,
            }
        );

        expect(addSnapshot).toHaveBeenCalledTimes(1);
        expect(addSnapshot.calls.argsFor(0)[0].html).toBe('test');
        expect(addSnapshot.calls.argsFor(0)[0].entityStates).toBe(mockedState);
    });
});

function createUndoSnapshotService(addSnapshot: any): UndoSnapshotsService<Snapshot> {
    return {
        canMove: null,
        move: null,
        addSnapshot,
        clearRedo: null,
        canUndoAutoComplete: null,
    };
}
