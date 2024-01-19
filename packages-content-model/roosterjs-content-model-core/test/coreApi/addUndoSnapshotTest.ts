import * as createSnapshotSelection from '../../lib/utils/createSnapshotSelection';
import { addUndoSnapshot } from '../../lib/coreApi/addUndoSnapshot';
import { SnapshotsManager, StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('addUndoSnapshot', () => {
    let core: StandaloneEditorCore;
    let getDOMSelectionSpy: jasmine.Spy;
    let contentDiv: HTMLDivElement;
    let addSnapshotSpy: jasmine.Spy;
    let getKnownColorsCopySpy: jasmine.Spy;
    let createSnapshotSelectionSpy: jasmine.Spy;
    let snapshotsManager: SnapshotsManager;

    beforeEach(() => {
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        addSnapshotSpy = jasmine.createSpy('addSnapshot');
        getKnownColorsCopySpy = jasmine.createSpy('getKnownColorsCopy');
        createSnapshotSelectionSpy = spyOn(createSnapshotSelection, 'createSnapshotSelection');
        contentDiv = { innerHTML: '' } as any;

        snapshotsManager = {
            addSnapshot: addSnapshotSpy,
        } as any;

        core = {
            contentDiv,
            darkColorHandler: {
                getKnownColorsCopy: getKnownColorsCopySpy,
            },
            lifecycle: {},
            api: {
                getDOMSelection: getDOMSelectionSpy,
            },
            undo: {
                snapshotsManager,
            },
        } as any;
    });

    it('Is in shadow edit', () => {
        core.lifecycle.shadowEditFragment = {} as any;

        const result = addUndoSnapshot(core, false);

        expect(getDOMSelectionSpy).not.toHaveBeenCalled();
        expect(createSnapshotSelectionSpy).not.toHaveBeenCalled();
        expect(addSnapshotSpy).not.toHaveBeenCalled();
        expect(result).toEqual(null);
    });

    it('Has a selection', () => {
        const mockedSelection = 'SELECTION' as any;
        const mockedColors = 'COLORS' as any;
        const mockedHTML = 'HTML' as any;
        const mockedSnapshotSelection = 'SNAPSHOTSELECTION' as any;

        contentDiv.innerHTML = mockedHTML;

        getDOMSelectionSpy.and.returnValue(mockedSelection);
        getKnownColorsCopySpy.and.returnValue(mockedColors);
        createSnapshotSelectionSpy.and.returnValue(mockedSnapshotSelection);

        const result = addUndoSnapshot(core, false);

        expect(core.undo).toEqual({
            snapshotsManager: snapshotsManager,
        } as any);
        expect(snapshotsManager.hasNewContent).toBeFalse();
        expect(getDOMSelectionSpy).toHaveBeenCalledWith(core);
        expect(createSnapshotSelectionSpy).toHaveBeenCalledWith(contentDiv, mockedSelection);
        expect(addSnapshotSpy).toHaveBeenCalledWith(
            {
                html: mockedHTML,
                entityStates: undefined,
                isDarkMode: false,
                selection: mockedSnapshotSelection,
            },
            false
        );
        expect(result).toEqual({
            html: mockedHTML,
            entityStates: undefined,
            isDarkMode: false,
            selection: mockedSnapshotSelection,
        });
    });

    it('Has a selection, canUndoByBackspace', () => {
        const mockedSelection = 'SELECTION' as any;
        const mockedColors = 'COLORS' as any;
        const mockedHTML = 'HTML' as any;
        const mockedSnapshotSelection = 'SNAPSHOTSELECTION' as any;

        contentDiv.innerHTML = mockedHTML;

        getDOMSelectionSpy.and.returnValue(mockedSelection);
        getKnownColorsCopySpy.and.returnValue(mockedColors);
        createSnapshotSelectionSpy.and.returnValue(mockedSnapshotSelection);

        const result = addUndoSnapshot(core, true);

        expect(core.undo).toEqual({
            snapshotsManager: snapshotsManager,
        } as any);
        expect(snapshotsManager.hasNewContent).toBeFalse();
        expect(getDOMSelectionSpy).toHaveBeenCalledWith(core);
        expect(createSnapshotSelectionSpy).toHaveBeenCalledWith(contentDiv, mockedSelection);
        expect(addSnapshotSpy).toHaveBeenCalledWith(
            {
                html: mockedHTML,
                entityStates: undefined,
                isDarkMode: false,
                selection: mockedSnapshotSelection,
            },
            true
        );
        expect(result).toEqual({
            html: mockedHTML,
            entityStates: undefined,
            isDarkMode: false,
            selection: mockedSnapshotSelection,
        });
    });

    it('Has entityStates', () => {
        const mockedSelection = 'SELECTION' as any;
        const mockedColors = 'COLORS' as any;
        const mockedHTML = 'HTML' as any;
        const mockedSnapshotSelection = 'SNAPSHOTSELECTION' as any;
        const mockedEntityStates = 'ENTITYSTATES' as any;

        contentDiv.innerHTML = mockedHTML;

        getDOMSelectionSpy.and.returnValue(mockedSelection);
        getKnownColorsCopySpy.and.returnValue(mockedColors);
        createSnapshotSelectionSpy.and.returnValue(mockedSnapshotSelection);

        const result = addUndoSnapshot(core, false, mockedEntityStates);

        expect(core.undo).toEqual({
            snapshotsManager: snapshotsManager,
        } as any);
        expect(snapshotsManager.hasNewContent).toBeFalse();
        expect(getDOMSelectionSpy).toHaveBeenCalledWith(core);
        expect(createSnapshotSelectionSpy).toHaveBeenCalledWith(contentDiv, mockedSelection);
        expect(addSnapshotSpy).toHaveBeenCalledWith(
            {
                html: mockedHTML,
                entityStates: mockedEntityStates,
                isDarkMode: false,
                selection: mockedSnapshotSelection,
            },
            false
        );
        expect(result).toEqual({
            html: mockedHTML,
            entityStates: mockedEntityStates,
            isDarkMode: false,
            selection: mockedSnapshotSelection,
        });
    });
});
