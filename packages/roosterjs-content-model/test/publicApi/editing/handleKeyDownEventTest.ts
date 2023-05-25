import * as deleteSelection from '../../../lib/modelApi/edit/deleteSelection';
import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as handleKeyboardEventResult from '../../../lib/editor/utils/handleKeyboardEventCommon';
import handleKeyDownEvent from '../../../lib/publicApi/editing/handleKeyDownEvent';
import { ChangeSource, Keys } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { editingTestCommon } from './editingTestCommon';
import {
    DeleteResult,
    DeleteSelectionStep,
} from '../../../lib/modelApi/edit/utils/DeleteSelectionStep';
import {
    backwardDeleteCollapsedSelection,
    forwardDeleteCollapsedSelection,
} from '../../../lib/modelApi/edit/deleteSteps/deleteCollapsedSelection';

describe('handleKeyDownEvent', () => {
    let deleteSelectionSpy: jasmine.Spy;
    let mockedCallback = 'CALLBACK' as any;
    let handleKeyboardEventResultSpy: jasmine.Spy;

    beforeEach(() => {
        handleKeyboardEventResultSpy = spyOn(
            handleKeyboardEventResult,
            'handleKeyboardEventResult'
        );
        spyOn(handleKeyboardEventResult, 'getOnDeleteEntityCallback').and.returnValue(
            mockedCallback
        );
        deleteSelectionSpy = spyOn(deleteSelection, 'deleteSelection');
    });

    function runTest(
        input: ContentModelDocument,
        key: number,
        expectedResult: ContentModelDocument,
        expectedSteps: DeleteSelectionStep[],
        expectedDelete: DeleteResult,
        calledTimes: number
    ) {
        deleteSelectionSpy.and.returnValue({
            deleteResult: expectedDelete,
        });
        handleKeyboardEventResultSpy.and.returnValue(
            expectedDelete == DeleteResult.Range || expectedDelete == DeleteResult.SingleChar
        );

        const mockedEvent = {
            which: key,
        } as KeyboardEvent;

        let editor: any;

        editingTestCommon(
            'handleBackspaceKey',
            newEditor => {
                editor = newEditor;
                handleKeyDownEvent(editor, mockedEvent, []);
            },
            input,
            expectedResult,
            calledTimes
        );

        expect(handleKeyboardEventResult.getOnDeleteEntityCallback).toHaveBeenCalledWith(
            editor,
            mockedEvent,
            []
        );
        expect(deleteSelectionSpy).toHaveBeenCalledWith(input, mockedCallback, expectedSteps);
        expect(handleKeyboardEventResult.handleKeyboardEventResult).toHaveBeenCalledWith(
            editor,
            input,
            mockedEvent,
            expectedDelete
        );
    }

    it('Empty model, forward', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            Keys.DELETE,
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            [forwardDeleteCollapsedSelection],
            DeleteResult.NotDeleted,
            0
        );
    });

    it('Empty model, backward', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            Keys.BACKSPACE,
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            [backwardDeleteCollapsedSelection],
            DeleteResult.NotDeleted,
            0
        );
    });

    it('Model with content, forward', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            Keys.DELETE,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            [forwardDeleteCollapsedSelection],
            DeleteResult.NotDeleted,
            0
        );
    });

    it('Model with content, backward', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            Keys.BACKSPACE,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            [backwardDeleteCollapsedSelection],
            DeleteResult.NotDeleted,
            0
        );
    });

    it('Model with content and selection, forward', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test',
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            Keys.DELETE,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test',
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            [forwardDeleteCollapsedSelection],
            DeleteResult.SingleChar,
            1
        );
    });

    it('Model with content and selection, backward', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test',
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            Keys.BACKSPACE,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test',
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            [backwardDeleteCollapsedSelection],
            DeleteResult.SingleChar,
            1
        );
    });

    it('Check parameter of formatWithContentModel, forward', () => {
        const spy = spyOn(formatWithContentModel, 'formatWithContentModel');

        const editor = 'EDITOR' as any;
        const which = Keys.DELETE;
        const event = {
            which,
        } as any;
        const triggeredEvents = 'EVENTS' as any;

        handleKeyDownEvent(editor, event, triggeredEvents);

        expect(spy.calls.argsFor(0)[0]).toBe(editor);
        expect(spy.calls.argsFor(0)[1]).toBe('handleDeleteKey');
        expect(spy.calls.argsFor(0)[3]?.skipUndoSnapshot).toBe(true);
        expect(spy.calls.argsFor(0)[3]?.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[3]?.getChangeData?.()).toBe(which);
    });

    it('Check parameter of formatWithContentModel, backward', () => {
        const spy = spyOn(formatWithContentModel, 'formatWithContentModel');

        const editor = 'EDITOR' as any;
        const which = Keys.BACKSPACE;
        const event = {
            which,
        } as any;
        const triggeredEvents = 'EVENTS' as any;

        handleKeyDownEvent(editor, event, triggeredEvents);

        expect(spy.calls.argsFor(0)[0]).toBe(editor);
        expect(spy.calls.argsFor(0)[1]).toBe('handleBackspaceKey');
        expect(spy.calls.argsFor(0)[3]?.skipUndoSnapshot).toBe(true);
        expect(spy.calls.argsFor(0)[3]?.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[3]?.getChangeData?.()).toBe(which);
    });
});
