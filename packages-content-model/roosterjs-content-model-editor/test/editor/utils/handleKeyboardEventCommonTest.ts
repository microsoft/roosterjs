import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { DeleteResult } from '../../../lib/modelApi/edit/utils/DeleteSelectionStep';
import { FormatWithContentModelContext } from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { PluginEventType } from 'roosterjs-editor-types';
import {
    handleKeyboardEventResult,
    shouldDeleteAllSegmentsBefore,
    shouldDeleteWord,
} from '../../../lib/editor/utils/handleKeyboardEventCommon';

describe('handleKeyboardEventResult', () => {
    let mockedEditor: IContentModelEditor;
    let mockedEvent: KeyboardEvent;
    let clearCachedModel: jasmine.Spy;
    let preventDefault: jasmine.Spy;
    let triggerContentChangedEvent: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let addUndoSnapshot: jasmine.Spy;

    beforeEach(() => {
        clearCachedModel = jasmine.createSpy('clearCachedModel');
        preventDefault = jasmine.createSpy('preventDefault');
        triggerContentChangedEvent = jasmine.createSpy('triggerContentChangedEvent');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');

        mockedEditor = ({
            clearCachedModel,
            triggerContentChangedEvent,
            triggerPluginEvent,
            addUndoSnapshot,
        } as any) as IContentModelEditor;
        mockedEvent = ({
            preventDefault,
        } as any) as KeyboardEvent;

        spyOn(normalizeContentModel, 'normalizeContentModel');
    });

    it('DeleteResult.SingleChar', () => {
        const mockedModel = 'MODEL' as any;
        const which = 'WHICH' as any;
        (<any>mockedEvent).which = which;
        const context: FormatWithContentModelContext = { deletedEntities: [] };
        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            DeleteResult.SingleChar,
            context
        );

        expect(result).toBeTrue();
        expect(preventDefault).toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(mockedModel);
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(clearCachedModel).not.toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.BeforeKeyboardEditing, {
            rawEvent: mockedEvent,
        });
        expect(context.skipUndoSnapshot).toBeTrue();
    });

    it('DeleteResult.NotDeleted', () => {
        const mockedModel = 'MODEL' as any;
        const context: FormatWithContentModelContext = { deletedEntities: [] };
        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            DeleteResult.NotDeleted,
            context
        );

        expect(result).toBeFalse();
        expect(preventDefault).not.toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).not.toHaveBeenCalled();
        expect(clearCachedModel).toHaveBeenCalledWith(null);
        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(context.skipUndoSnapshot).toBeTrue();
    });

    it('DeleteResult.Range', () => {
        const mockedModel = 'MODEL' as any;
        const context: FormatWithContentModelContext = { deletedEntities: [] };
        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            DeleteResult.Range,
            context
        );

        expect(result).toBeTrue();
        expect(preventDefault).toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(mockedModel);
        expect(clearCachedModel).not.toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.BeforeKeyboardEditing, {
            rawEvent: mockedEvent,
        });
        expect(context.skipUndoSnapshot).toBeFalse();
    });

    it('DeleteResult.NothingToDelete', () => {
        const mockedModel = 'MODEL' as any;
        const context: FormatWithContentModelContext = { deletedEntities: [] };
        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            DeleteResult.NothingToDelete,
            context
        );

        expect(result).toBeFalse();
        expect(preventDefault).toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).not.toHaveBeenCalled();
        expect(clearCachedModel).not.toHaveBeenCalled();
        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(context.skipUndoSnapshot).toBeTrue();
    });
});

describe('shouldDeleteWord', () => {
    function runTest(
        isMac: boolean,
        altKey: boolean,
        ctrlKey: boolean,
        metaKey: boolean,
        expectedResult: boolean
    ) {
        const rawEvent = {
            altKey,
            metaKey,
            ctrlKey,
        } as any;

        const result = shouldDeleteWord(rawEvent, isMac);

        expect(result).toEqual(expectedResult);
    }

    it('PC', () => {
        runTest(false, false, false, false, false);
        runTest(false, false, false, true, false);
        runTest(false, false, true, false, true);
        runTest(false, false, true, true, true);
        runTest(false, true, false, false, false);
        runTest(false, true, false, true, false);
        runTest(false, true, true, false, false);
        runTest(false, true, true, true, false);
    });

    it('MAC', () => {
        runTest(true, false, false, false, false);
        runTest(true, false, false, true, false);
        runTest(true, false, true, false, false);
        runTest(true, false, true, true, false);
        runTest(true, true, false, false, true);
        runTest(true, true, false, true, false);
        runTest(true, true, true, false, true);
        runTest(true, true, true, true, false);
    });
});

describe('shouldDeleteAllSegmentsBefore', () => {
    function runTest(altKey: boolean, ctrlKey: boolean, metaKey: boolean, expectedResult: boolean) {
        const rawEvent = {
            altKey,
            metaKey,
            ctrlKey,
        } as any;

        const result = shouldDeleteAllSegmentsBefore(rawEvent);

        expect(result).toEqual(expectedResult);
    }

    it('Test', () => {
        runTest(false, false, false, false);
        runTest(false, false, true, true);
        runTest(false, true, false, false);
        runTest(false, true, true, true);
        runTest(true, false, false, false);
        runTest(true, false, true, false);
        runTest(true, true, false, false);
        runTest(true, true, true, false);
    });
});
