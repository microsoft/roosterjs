import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { DeleteResult } from '../../../lib/modelApi/edit/utils/DeleteSelectionStep';
import { EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    handleKeyboardEventResult,
    shouldDeleteAllSegmentsBefore,
    shouldDeleteWord,
} from '../../../lib/editor/utils/handleKeyboardEventCommon';

describe('handleKeyboardEventResult', () => {
    let mockedEditor: IContentModelEditor;
    let mockedEvent: KeyboardEvent;
    let cacheContentModel: jasmine.Spy;
    let preventDefault: jasmine.Spy;
    let triggerContentChangedEvent: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let addUndoSnapshot: jasmine.Spy;

    beforeEach(() => {
        cacheContentModel = jasmine.createSpy('cacheContentModel');
        preventDefault = jasmine.createSpy('preventDefault');
        triggerContentChangedEvent = jasmine.createSpy('triggerContentChangedEvent');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');

        mockedEditor = ({
            cacheContentModel,
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

        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            DeleteResult.SingleChar
        );

        expect(result).toBeTrue();
        expect(preventDefault).toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(mockedModel);
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(cacheContentModel).not.toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.BeforeKeyboardEditing, {
            rawEvent: mockedEvent,
        });
        expect(addUndoSnapshot).not.toHaveBeenCalled();
    });

    it('DeleteResult.NotDeleted', () => {
        const mockedModel = 'MODEL' as any;

        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            DeleteResult.NotDeleted
        );

        expect(result).toBeFalse();
        expect(preventDefault).not.toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).not.toHaveBeenCalled();
        expect(cacheContentModel).toHaveBeenCalledWith(null);
        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(addUndoSnapshot).not.toHaveBeenCalled();
    });

    it('DeleteResult.Range', () => {
        const mockedModel = 'MODEL' as any;

        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            DeleteResult.Range
        );

        expect(result).toBeTrue();
        expect(preventDefault).toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(mockedModel);
        expect(cacheContentModel).not.toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.BeforeKeyboardEditing, {
            rawEvent: mockedEvent,
        });
        expect(addUndoSnapshot).toHaveBeenCalled();
    });

    it('DeleteResult.NothingToDelete', () => {
        const mockedModel = 'MODEL' as any;

        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            DeleteResult.NothingToDelete
        );

        expect(result).toBeFalse();
        expect(preventDefault).toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).not.toHaveBeenCalled();
        expect(cacheContentModel).not.toHaveBeenCalled();
        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(addUndoSnapshot).not.toHaveBeenCalled();
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
