import * as deleteSelection from 'roosterjs-content-model-core/lib/publicApi/selection/deleteSelection';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { IContentModelEditor } from 'roosterjs-content-model-editor';
import { keyboardInput } from '../../lib/edit/keyboardInput';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatWithContentModelContext,
} from 'roosterjs-content-model-types';

describe('keyboardInput', () => {
    let editor: IContentModelEditor;
    let addUndoSnapshotSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let deleteSelectionSpy: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let normalizeContentModelSpy: jasmine.Spy;
    let mockedContext: FormatWithContentModelContext;
    let formatResult: boolean | undefined;

    beforeEach(() => {
        mockedModel = 'MODEL' as any;
        mockedContext = {
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        };

        formatResult = undefined;
        addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter) => {
                formatResult = callback(mockedModel, mockedContext);
            });
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        deleteSelectionSpy = spyOn(deleteSelection, 'deleteSelection');
        normalizeContentModelSpy = spyOn(normalizeContentModel, 'normalizeContentModel');

        editor = {
            getDOMSelection: getDOMSelectionSpy,
            addUndoSnapshot: addUndoSnapshotSpy,
            formatContentModel: formatContentModelSpy,
        } as any;
    });

    it('Letter input, collapsed selection, no modifier key', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
            },
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'notDeleted',
        });

        const rawEvent = {
            key: 'A',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();
        expect(deleteSelectionSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeUndefined();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
    });

    it('Letter input, expanded selection, no modifier key, deleteSelection returns not deleted', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                collapsed: false,
            },
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'notDeleted',
        });

        const rawEvent = {
            key: 'A',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(deleteSelectionSpy).toHaveBeenCalledWith(mockedModel, [], mockedContext);
        expect(formatResult).toBeFalse();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            clearModelCache: true,
            skipUndoSnapshot: true,
        });
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
    });

    it('Letter input, expanded selection, no modifier key, deleteSelection returns range', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                collapsed: false,
            },
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
        });

        const rawEvent = {
            key: 'A',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(deleteSelectionSpy).toHaveBeenCalledWith(mockedModel, [], mockedContext);
        expect(formatResult).toBeTrue();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            clearModelCache: true,
            skipUndoSnapshot: true,
            newPendingFormat: undefined,
        });
        expect(normalizeContentModelSpy).toHaveBeenCalledWith(mockedModel);
    });

    it('Letter input, table selection, no modifier key, deleteSelection returns range', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
        });

        const rawEvent = {
            key: 'A',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(deleteSelectionSpy).toHaveBeenCalledWith(mockedModel, [], mockedContext);
        expect(formatResult).toBeTrue();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            clearModelCache: true,
            skipUndoSnapshot: true,
            newPendingFormat: undefined,
        });
        expect(normalizeContentModelSpy).toHaveBeenCalledWith(mockedModel);
    });

    it('Letter input, image selection, no modifier key, deleteSelection returns range', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
        });

        const rawEvent = {
            key: 'A',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(deleteSelectionSpy).toHaveBeenCalledWith(mockedModel, [], mockedContext);
        expect(formatResult).toBeTrue();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            clearModelCache: true,
            skipUndoSnapshot: true,
            newPendingFormat: undefined,
        });
        expect(normalizeContentModelSpy).toHaveBeenCalledWith(mockedModel);
    });

    it('Letter input, no selection, no modifier key, deleteSelection returns range', () => {
        getDOMSelectionSpy.and.returnValue(null);
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
        });

        const rawEvent = {
            key: 'A',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();
        expect(deleteSelectionSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeUndefined();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
    });

    it('Letter input, expanded selection, has modifier key, deleteSelection returns range', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                collapsed: false,
            },
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
        });

        const rawEvent = {
            key: 'A',
            ctrlKey: true,
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();
        expect(deleteSelectionSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeUndefined();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
    });

    it('Space input, table selection, no modifier key, deleteSelection returns range', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
        });

        const rawEvent = {
            key: 'Space',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(deleteSelectionSpy).toHaveBeenCalledWith(mockedModel, [], mockedContext);
        expect(formatResult).toBeTrue();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            clearModelCache: true,
            skipUndoSnapshot: true,
            newPendingFormat: undefined,
        });
        expect(normalizeContentModelSpy).toHaveBeenCalledWith(mockedModel);
    });

    it('Backspace input, table selection, no modifier key, deleteSelection returns range', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
        });

        const rawEvent = {
            key: 'Backspace',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();
        expect(deleteSelectionSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeUndefined();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
    });

    it('Enter input, table selection, no modifier key, deleteSelection returns range', () => {
        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
        });

        const rawEvent = {
            key: 'Enter',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(deleteSelectionSpy).toHaveBeenCalledWith(mockedModel, [], mockedContext);
        expect(formatResult).toBeTrue();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            clearModelCache: true,
            skipUndoSnapshot: true,
            newPendingFormat: undefined,
        });
        expect(normalizeContentModelSpy).toHaveBeenCalledWith(mockedModel);
    });

    it('Letter input, expanded selection, no modifier key, deleteSelection returns range, has segment format', () => {
        const mockedFormat = 'FORMAT' as any;
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                collapsed: false,
            },
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
            insertPoint: {
                marker: {
                    format: mockedFormat,
                },
            },
        });

        const rawEvent = {
            key: 'A',
        } as any;

        keyboardInput(editor, rawEvent);

        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(addUndoSnapshotSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(deleteSelectionSpy).toHaveBeenCalledWith(mockedModel, [], mockedContext);
        expect(formatResult).toBeTrue();
        expect(mockedContext).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            clearModelCache: true,
            skipUndoSnapshot: true,
            newPendingFormat: mockedFormat,
        });
        expect(normalizeContentModelSpy).toHaveBeenCalledWith(mockedModel);
    });
});
