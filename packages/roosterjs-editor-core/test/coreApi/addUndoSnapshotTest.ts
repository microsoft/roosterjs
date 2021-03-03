import createEditorCore from './createMockEditorCore';
import { addUndoSnapshot } from '../../lib/coreApi/addUndoSnapshot';
import { PluginEventType, UndoSnapshotsService } from 'roosterjs-editor-types';
import { Position } from 'roosterjs-editor-dom';

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
        expect(core.undo.snapshotsService.addSnapshot).toHaveBeenCalledWith('test', false);
    });

    it('null input, verify snapshot is added', () => {
        const core = createEditorCore(div, {});
        core.undo.snapshotsService = createUndoSnapshotService(jasmine.createSpy());
        core.api.getContent = jasmine.createSpy().and.returnValue('test1');
        addUndoSnapshot(core, null, null, false);
        expect(core.undo.snapshotsService.addSnapshot).toHaveBeenCalledWith('test1', false);
    });

    it('undo with callback', () => {
        const range = document.createRange();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => range,
                getContent: () => 'result 1',
            },
        });
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
                core.api.getContent = jasmine.createSpy().and.returnValue('result 2');
            },
            null,
            false
        );
        expect(core.undo.snapshotsService.addSnapshot).toHaveBeenCalledTimes(2);

        const snapshot1 = (<jasmine.Spy>core.undo.snapshotsService.addSnapshot).calls.argsFor(0)[0];
        const snapshot2 = (<jasmine.Spy>core.undo.snapshotsService.addSnapshot).calls.argsFor(1)[0];

        expect(snapshot1).toBe('result 1');
        expect(snapshot2).toBe('result 2');
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

        let content = 'test 1';
        spyOn(core.api, 'getContent').and.callFake(() => content);

        expect(core.undo.snapshotsService.canUndoAutoComplete()).toBeFalsy();
        addUndoSnapshot(
            core,
            () => {
                content = 'test 2';
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
});

function createUndoSnapshotService(addSnapshot: any): UndoSnapshotsService {
    return {
        canMove: null,
        move: null,
        addSnapshot,
        clearRedo: null,
        canUndoAutoComplete: null,
    };
}
