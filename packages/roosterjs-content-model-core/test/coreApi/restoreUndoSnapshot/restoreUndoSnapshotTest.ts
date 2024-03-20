import * as restoreSnapshotColors from '../../../lib/coreApi/restoreUndoSnapshot/restoreSnapshotColors';
import * as restoreSnapshotHTML from '../../../lib/coreApi/restoreUndoSnapshot/restoreSnapshotHTML';
import * as restoreSnapshotSelection from '../../../lib/coreApi/restoreUndoSnapshot/restoreSnapshotSelection';
import { ChangeSource } from '../../../lib/constants/ChangeSource';
import { EditorCore, Snapshot } from 'roosterjs-content-model-types';
import { restoreUndoSnapshot } from '../../../lib/coreApi/restoreUndoSnapshot/restoreUndoSnapshot';

describe('restoreUndoSnapshot', () => {
    let core: EditorCore;
    let triggerEventSpy: jasmine.Spy;
    let setLogicalRootSpy: jasmine.Spy;
    let restoreSnapshotColorsSpy: jasmine.Spy;
    let restoreSnapshotHTMLSpy: jasmine.Spy;
    let restoreSnapshotSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        triggerEventSpy = jasmine.createSpy('triggerEvent');
        setLogicalRootSpy = jasmine.createSpy('setLogicalRoot');
        restoreSnapshotColorsSpy = spyOn(
            restoreSnapshotColors,
            'restoreSnapshotColors'
        ).and.callFake(() => {
            expect(core.undo.isRestoring).toBeTrue();
        });
        restoreSnapshotHTMLSpy = spyOn(restoreSnapshotHTML, 'restoreSnapshotHTML');
        restoreSnapshotSelectionSpy = spyOn(restoreSnapshotSelection, 'restoreSnapshotSelection');

        core = {
            api: {
                triggerEvent: triggerEventSpy,
                setLogicalRoot: setLogicalRootSpy,
            },
            undo: {},
        } as any;
    });

    it('restore snapshot', () => {
        const mockedHTML = 'HTML' as any;
        const snapshot: Snapshot = {
            html: mockedHTML,
        } as any;

        restoreUndoSnapshot(core, snapshot);

        expect(triggerEventSpy).toHaveBeenCalledTimes(2);
        expect(triggerEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: 'beforeSetContent',
                newContent: mockedHTML,
            },
            true
        );
        expect(triggerEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: 'contentChanged',
                entityStates: undefined,
                source: ChangeSource.SetContent,
            },
            false
        );
        expect(setLogicalRootSpy).toHaveBeenCalledWith(core, null);
        expect(restoreSnapshotColorsSpy).toHaveBeenCalledWith(core, snapshot);
        expect(restoreSnapshotHTMLSpy).toHaveBeenCalledWith(core, snapshot);
        expect(restoreSnapshotSelectionSpy).toHaveBeenCalledWith(core, snapshot);
    });

    it('restore snapshot, with entity states', () => {
        const mockedHTML = 'HTML' as any;
        const mockedEntityState = 'ENTITYSTATE' as any;
        const snapshot: Snapshot = {
            html: mockedHTML,
            entityStates: mockedEntityState,
        } as any;

        restoreUndoSnapshot(core, snapshot);

        expect(triggerEventSpy).toHaveBeenCalledTimes(2);
        expect(triggerEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: 'beforeSetContent',
                newContent: mockedHTML,
            },
            true
        );
        expect(triggerEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: 'contentChanged',
                entityStates: mockedEntityState,
                source: ChangeSource.SetContent,
            },
            false
        );
        expect(setLogicalRootSpy).toHaveBeenCalledWith(core, null);
        expect(restoreSnapshotColorsSpy).toHaveBeenCalledWith(core, snapshot);
        expect(restoreSnapshotHTMLSpy).toHaveBeenCalledWith(core, snapshot);
        expect(restoreSnapshotSelectionSpy).toHaveBeenCalledWith(core, snapshot);
    });
});
