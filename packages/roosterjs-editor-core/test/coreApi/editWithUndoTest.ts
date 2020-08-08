import * as addUndoSnapshot from '../../lib/corePlugins/undo/addUndoSnapshot';
import createEditorCore from './createMockEditorCore';
import UndoPluginState from '../../lib/corePlugins/undo/UndoPluginState';
import UndoSnapshotsService from '../../lib/interfaces/UndoSnapshotsService';
import { editWithUndo } from '../../lib/coreAPI/editWithUndo';
import { PluginEventType } from 'roosterjs-editor-types';
import { Position } from 'roosterjs-editor-dom';

describe('editWithUndo', () => {
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
        spyOn(addUndoSnapshot, 'default');
        editWithUndo(core, null, null, false);
        expect(addUndoSnapshot.default).toHaveBeenCalledWith(core.undo.value);
    });

    it('null input, verify snapshot is added', () => {
        const core = createEditorCore(div, {});
        core.undo.value.snapshotsService = createUndoSnapshotService(jasmine.createSpy());
        core.undo.value.getContent = jasmine.createSpy().and.returnValue('test1');
        editWithUndo(core, null, null, false);
        expect(core.undo.value.snapshotsService.addSnapshot).toHaveBeenCalledWith('test1');
    });

    it('undo with callback', () => {
        const range = document.createRange();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => range,
            },
        });
        core.undo.value = createUndoPluginState(
            createUndoSnapshotService(jasmine.createSpy()),
            jasmine.createSpy().and.returnValue('result 1')
        );
        editWithUndo(
            core,
            (pos1, pos2, snapshot) => {
                expect(pos1.equalTo(Position.getStart(range).normalize())).toBeTruthy();
                expect(pos2.equalTo(Position.getEnd(range).normalize())).toBeTruthy();
                expect(snapshot).toBe('result 1');
                expect(core.undo.value.outerUndoSnapshot).toBe('result 1');
                core.undo.value.getContent = jasmine.createSpy().and.returnValue('result 2');
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
        spyOn(addUndoSnapshot, 'default');
        const data = {
            value: 1,
        };

        editWithUndo(core, () => data, 'change source', false);
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

    it('nest call editWithUndo', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                triggerEvent,
            },
        });
        spyOn(addUndoSnapshot, 'default').and.callThrough();

        core.undo.value.getContent = () => 'test';
        core.undo.value.snapshotsService = createUndoSnapshotService(() => {});

        expect(core.undo.value.outerUndoSnapshot).toBeNull();
        editWithUndo(
            core,
            (pos1, pos2, snapshot) => {
                expect(snapshot).toBe('test');
                expect(core.undo.value.outerUndoSnapshot).toBe('test');

                core.undo.value.getContent = () => 'test2';

                editWithUndo(
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

        expect(addUndoSnapshot.default).toHaveBeenCalledTimes(2);
        expect(core.undo.value.outerUndoSnapshot).toBeNull();
    });

    it('throw from callback, outerUndoSnapshot should also be reset', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                triggerEvent,
            },
        });
        spyOn(addUndoSnapshot, 'default').and.returnValue('test');

        expect(core.undo.value.outerUndoSnapshot).toBeNull();
        try {
            editWithUndo(
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
        spyOn(addUndoSnapshot, 'default').and.returnValue('test');

        expect(core.autoComplete.value).toBeNull();
        editWithUndo(core, () => {}, null, true);
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

function createUndoPluginState(
    snapshotsService: UndoSnapshotsService,
    getContent: () => string
): UndoPluginState {
    return {
        snapshotsService,
        isRestoring: false,
        hasNewContent: false,
        getContent,
        setContent: null,
        outerUndoSnapshot: null,
    };
}
