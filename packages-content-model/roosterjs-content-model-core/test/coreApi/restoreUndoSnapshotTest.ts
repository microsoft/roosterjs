import * as restoreSnapshotColors from '../../lib/utils/restoreSnapshotColors';
import * as restoreSnapshotHTML from '../../lib/utils/restoreSnapshotHTML';
import * as restoreSnapshotSelection from '../../lib/utils/restoreSnapshotSelection';
import { ChangeSource } from '../../lib/constants/ChangeSource';
import { PluginEventType } from 'roosterjs-editor-types';
import { restoreUndoSnapshot } from '../../lib/coreApi/restoreUndoSnapshot';
import { Snapshot, StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('restoreUndoSnapshot', () => {
    let core: StandaloneEditorCore;
    let triggerEventSpy: jasmine.Spy;
    let restoreSnapshotColorsSpy: jasmine.Spy;
    let restoreSnapshotHTMLSpy: jasmine.Spy;
    let restoreSnapshotSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        triggerEventSpy = jasmine.createSpy('triggerEvent');
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
                eventType: PluginEventType.BeforeSetContent,
                newContent: mockedHTML,
            },
            true
        );
        expect(triggerEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                entityStates: undefined,
                source: ChangeSource.SetContent,
            },
            false
        );
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
                eventType: PluginEventType.BeforeSetContent,
                newContent: mockedHTML,
            },
            true
        );
        expect(triggerEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                entityStates: mockedEntityState,
                source: ChangeSource.SetContent,
            },
            false
        );
        expect(restoreSnapshotColorsSpy).toHaveBeenCalledWith(core, snapshot);
        expect(restoreSnapshotHTMLSpy).toHaveBeenCalledWith(core, snapshot);
        expect(restoreSnapshotSelectionSpy).toHaveBeenCalledWith(core, snapshot);
    });
});
