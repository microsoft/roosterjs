import createEditorCore from './createMockEditorCore';
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
});
