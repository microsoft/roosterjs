import createEditorCore from './createMockEditorCore';
import { addUndoSnapshot } from '../../lib/coreApi/addUndoSnapshot';
import { Position } from 'roosterjs-editor-dom';
import { PluginEventType, UndoSnapshotsService } from 'roosterjs-editor-types';

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
        spyOn(core.undo.value.snapshotsService, 'addSnapshot');
        div.innerHTML = 'test';
        addUndoSnapshot(core, null, null, false);
        expect(core.undo.value.snapshotsService.addSnapshot).toHaveBeenCalledWith('test');
    });

    it('null input, verify snapshot is added', () => {
        const core = createEditorCore(div, {});
        core.undo.value.snapshotsService = createUndoSnapshotService(jasmine.createSpy());
        core.api.getContent = jasmine.createSpy().and.returnValue('test1');
        addUndoSnapshot(core, null, null, false);
        expect(core.undo.value.snapshotsService.addSnapshot).toHaveBeenCalledWith('test1');
    });

    it('undo with callback', () => {
        const range = document.createRange();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => range,
                getContent: () => 'result 1',
            },
        });
        core.undo.value = {
            snapshotsService: createUndoSnapshotService(jasmine.createSpy()),
            isRestoring: false,
            hasNewContent: false,
            outerUndoSnapshot: null,
        };

        addUndoSnapshot(
            core,
            (pos1, pos2, snapshot) => {
                expect(pos1.equalTo(Position.getStart(range).normalize())).toBeTruthy();
                expect(pos2.equalTo(Position.getEnd(range).normalize())).toBeTruthy();
                expect(snapshot).toBe('result 1');
                expect(core.undo.value.outerUndoSnapshot).toBe('result 1');
                core.api.getContent = jasmine.createSpy().and.returnValue('result 2');
            },
            null,
            false
        );
        expect(core.undo.value.snapshotsService.addSnapshot).toHaveBeenCalledTimes(2);

        const snapshot1 = (<jasmine.Spy>core.undo.value.snapshotsService.addSnapshot).calls.argsFor(
            0
        )[0];
        const snapshot2 = (<jasmine.Spy>core.undo.value.snapshotsService.addSnapshot).calls.argsFor(
            1
        )[0];

        expect(snapshot1).toBe('result 1');
        expect(snapshot2).toBe('result 2');
        expect(core.undo.value.outerUndoSnapshot).toBeNull();
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
        core.undo.value.snapshotsService = createUndoSnapshotService(addSnapshot);

        expect(core.undo.value.outerUndoSnapshot).toBeNull();
        addUndoSnapshot(
            core,
            (pos1, pos2, snapshot) => {
                expect(snapshot).toBe('test');
                expect(core.undo.value.outerUndoSnapshot).toBe('test');

                core.api.getContent = () => 'test2';

                addUndoSnapshot(
                    core,
                    (pos1, pos2, snapshot) => {
                        expect(snapshot).toBe('test');
                        expect(core.undo.value.outerUndoSnapshot).toBe('test');
                    },
                    null,
                    false
                );
            },
            'change source',
            false
        );

        expect(addSnapshot).toHaveBeenCalledTimes(2);
        expect(core.undo.value.outerUndoSnapshot).toBeNull();
    });

    it('throw from callback, outerUndoSnapshot should also be reset', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                getContent: () => 'test',
                triggerEvent,
            },
        });

        expect(core.undo.value.outerUndoSnapshot).toBeNull();
        try {
            addUndoSnapshot(
                core,
                () => {
                    expect(core.undo.value.outerUndoSnapshot).toBe('test');
                    throw new Error();
                },
                null,
                true
            );
        } catch {}
        expect(core.undo.value.outerUndoSnapshot).toBe(null);
    });

    it('auto complete mode', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                triggerEvent,
            },
        });

        spyOn(core.api, 'getContent').and.returnValue('test');

        expect(core.autoComplete.value).toBeNull();
        addUndoSnapshot(core, () => {}, null, true);
        expect(core.autoComplete.value).toBe('test');
    });
});

function createUndoSnapshotService(addSnapshot: any): UndoSnapshotsService {
    return {
        canMove: null,
        move: null,
        addSnapshot,
        clearRedo: null,
    };
}
