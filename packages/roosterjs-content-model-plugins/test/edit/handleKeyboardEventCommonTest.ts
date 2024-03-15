import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { FormatContentModelContext, IEditor } from 'roosterjs-content-model-types';
import {
    handleKeyboardEventResult,
    shouldDeleteAllSegmentsBefore,
    shouldDeleteWord,
} from '../../lib/edit/handleKeyboardEventCommon';

describe('handleKeyboardEventResult', () => {
    let mockedEditor: IEditor;
    let mockedEvent: KeyboardEvent;
    let cacheContentModel: jasmine.Spy;
    let preventDefault: jasmine.Spy;
    let triggerContentChangedEvent: jasmine.Spy;
    let triggerEvent: jasmine.Spy;
    let addUndoSnapshot: jasmine.Spy;

    beforeEach(() => {
        cacheContentModel = jasmine.createSpy('cacheContentModel');
        preventDefault = jasmine.createSpy('preventDefault');
        triggerContentChangedEvent = jasmine.createSpy('triggerContentChangedEvent');
        triggerEvent = jasmine.createSpy('triggerEvent');
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');

        mockedEditor = ({
            cacheContentModel,
            triggerContentChangedEvent,
            triggerEvent,
            addUndoSnapshot,
        } as any) as IEditor;
        mockedEvent = ({
            preventDefault,
        } as any) as KeyboardEvent;

        spyOn(normalizeContentModel, 'normalizeContentModel');
    });

    it('singleChar', () => {
        const mockedModel = 'MODEL' as any;
        const which = 'WHICH' as any;
        (<any>mockedEvent).which = which;
        const context: FormatContentModelContext = {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        };
        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            'singleChar',
            context
        );

        expect(result).toBeTrue();
        expect(preventDefault).toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(mockedModel);
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(cacheContentModel).not.toHaveBeenCalled();
        expect(triggerEvent).toHaveBeenCalledWith('beforeKeyboardEditing', {
            rawEvent: mockedEvent,
        });
        expect(context.skipUndoSnapshot).toBeTrue();
        expect(context.clearModelCache).toBeFalsy();
    });

    it('notDeleted', () => {
        const mockedModel = 'MODEL' as any;
        const context: FormatContentModelContext = {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        };
        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            'notDeleted',
            context
        );

        expect(result).toBeFalse();
        expect(preventDefault).not.toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).not.toHaveBeenCalled();
        expect(cacheContentModel).not.toHaveBeenCalledWith(null);
        expect(triggerEvent).not.toHaveBeenCalled();
        expect(context.skipUndoSnapshot).toBeTrue();
        expect(context.clearModelCache).toBeTruthy();
    });

    it('range', () => {
        const mockedModel = 'MODEL' as any;
        const context: FormatContentModelContext = {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        };
        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            'range',
            context
        );

        expect(result).toBeTrue();
        expect(preventDefault).toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(mockedModel);
        expect(cacheContentModel).not.toHaveBeenCalled();
        expect(triggerEvent).toHaveBeenCalledWith('beforeKeyboardEditing', {
            rawEvent: mockedEvent,
        });
        expect(context.skipUndoSnapshot).toBeFalse();
        expect(context.clearModelCache).toBeFalsy();
    });

    it('nothingToDelete', () => {
        const mockedModel = 'MODEL' as any;
        const context: FormatContentModelContext = {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        };
        const result = handleKeyboardEventResult(
            mockedEditor,
            mockedModel,
            mockedEvent,
            'nothingToDelete',
            context
        );

        expect(result).toBeFalse();
        expect(preventDefault).toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).not.toHaveBeenCalled();
        expect(cacheContentModel).not.toHaveBeenCalled();
        expect(triggerEvent).not.toHaveBeenCalled();
        expect(context.skipUndoSnapshot).toBeTrue();
        expect(context.clearModelCache).toBeFalsy();
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
