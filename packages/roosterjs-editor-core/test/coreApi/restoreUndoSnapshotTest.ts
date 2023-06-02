import * as getEntityFromElement from 'roosterjs-editor-dom/lib/entity/getEntityFromElement';
import * as queryElements from 'roosterjs-editor-dom/lib/utils/queryElements';
import createEditorCore from './createMockEditorCore';
import { ChangeSource, EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import { restoreUndoSnapshot } from '../../lib/coreApi/restoreUndoSnapshot';

describe('restoreUndoSnapshot', () => {
    let div: HTMLDivElement | null;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div!);
        div = null;
    });

    it('Restore snapshot with -1', () => {
        const addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');
        const setContent = jasmine.createSpy('setContent');
        const html = 'test';
        const metadata = {};
        const move = jasmine.createSpy('move').and.returnValue(<any>{
            html,
            metadata,
            knownColors: [],
        });

        const core = createEditorCore(div!, {
            coreApiOverride: {
                addUndoSnapshot,
                setContent,
            },
        });
        core.undo.hasNewContent = true;
        core.undo.snapshotsService.move = move;

        restoreUndoSnapshot(core, -1);

        expect(addUndoSnapshot).toHaveBeenCalledWith(core, null, null, false);
        expect(move).toHaveBeenCalledWith(-1);
        expect(setContent).toHaveBeenCalledWith(core, html, true, metadata);
        expect(core.undo.isRestoring).toBeFalse();
    });

    it('Restore snapshot with 1', () => {
        const addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');
        const setContent = jasmine.createSpy('setContent');
        const html = 'test';
        const metadata = {};
        const move = jasmine.createSpy('move').and.returnValue(<any>{
            html,
            metadata,
            knownColors: [],
        });

        const core = createEditorCore(div!, {
            coreApiOverride: {
                addUndoSnapshot,
                setContent,
            },
        });
        core.undo.hasNewContent = true;
        core.undo.snapshotsService.move = move;

        restoreUndoSnapshot(core, 1);

        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(move).toHaveBeenCalledWith(1);
        expect(setContent).toHaveBeenCalledWith(core, html, true, metadata);
        expect(core.undo.isRestoring).toBeFalse();
    });

    it('Restore snapshot with entityState', () => {
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const move = jasmine.createSpy('move').and.returnValue(<any>{
            html: 'test',
            metadata: {},
            knownColors: [],
            entityStates: [
                {
                    type: 'Entity1',
                    id: 'Entity1_1',
                    state: 'state1',
                },
                {
                    type: 'Entity2',
                    id: 'Entity2_1',
                    state: 'state2',
                },
            ],
        });
        const core = createEditorCore(div!, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        core.undo.snapshotsService.move = move;

        spyOn(queryElements, 'default').and.callFake((root: any, selector: any) => [selector]);
        spyOn(getEntityFromElement, 'default').and.callFake((wrapper: any) => wrapper);

        restoreUndoSnapshot(core, 1);

        expect(triggerEvent).toHaveBeenCalledTimes(4);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.BeforeSetContent,
                newContent: 'test',
            },
            true
        );
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            },
            false
        );
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.EntityOperation,
                operation: EntityOperation.UpdateEntityState,
                entity: '._Entity._EType_Entity1._EId_Entity1_1' as any,
                state: 'state1',
            },
            false
        );
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.EntityOperation,
                operation: EntityOperation.UpdateEntityState,
                entity: '._Entity._EType_Entity2._EId_Entity2_1' as any,
                state: 'state2',
            },
            false
        );
    });
});
