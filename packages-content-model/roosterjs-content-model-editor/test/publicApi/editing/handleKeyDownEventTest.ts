import * as deleteSelection from '../../../lib/modelApi/edit/deleteSelection';
import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as handleKeyboardEventResult from '../../../lib/editor/utils/handleKeyboardEventCommon';
import handleKeyDownEvent from '../../../lib/publicApi/editing/handleKeyDownEvent';
import { ChangeSource, Keys } from 'roosterjs-editor-types';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { deleteAllSegmentBefore } from '../../../lib/modelApi/edit/deleteSteps/deleteAllSegmentBefore';
import { editingTestCommon } from './editingTestCommon';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    backwardDeleteWordSelection,
    forwardDeleteWordSelection,
} from '../../../lib/modelApi/edit/deleteSteps/deleteWordSelection';
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

    beforeEach(() => {
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

        const preventDefault = jasmine.createSpy('preventDefault');
        const mockedEvent = ({
            which: key,
            preventDefault,
        } as any) as KeyboardEvent;

        let editor: any;

        editingTestCommon(
            'handleBackspaceKey',
            newEditor => {
                editor = newEditor;
                handleKeyDownEvent(editor, mockedEvent);
            },
            input,
            expectedResult,
            calledTimes
        );

        expect(deleteSelectionSpy).toHaveBeenCalledWith(input, expectedSteps, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: mockedEvent,
            skipUndoSnapshot: true,
        });
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
            [null!, null!, forwardDeleteCollapsedSelection],
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
            [null!, null!, backwardDeleteCollapsedSelection],
            DeleteResult.NotDeleted,
            0
        );
    });

    it('Empty model, delete word selection, forward', () => {
        spyOn(handleKeyboardEventResult, 'shouldDeleteWord').and.returnValue(true);

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
            [null!, forwardDeleteWordSelection, forwardDeleteCollapsedSelection],
            DeleteResult.NotDeleted,
            0
        );
    });

    it('Empty model, delete word selection, backward', () => {
        spyOn(handleKeyboardEventResult, 'shouldDeleteWord').and.returnValue(true);

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
            [null!, backwardDeleteWordSelection, backwardDeleteCollapsedSelection],
            DeleteResult.NotDeleted,
            0
        );
    });

    it('Empty model, delete all before segments, forward', () => {
        spyOn(handleKeyboardEventResult, 'shouldDeleteAllSegmentsBefore').and.returnValue(true);

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
            [null!, null!, forwardDeleteCollapsedSelection],
            DeleteResult.NotDeleted,
            0
        );
    });

    it('Empty model, delete all before segments, backward', () => {
        spyOn(handleKeyboardEventResult, 'shouldDeleteAllSegmentsBefore').and.returnValue(true);

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
            [deleteAllSegmentBefore, null!, backwardDeleteCollapsedSelection],
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
            [null!, null!, forwardDeleteCollapsedSelection],
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
            [null!, null!, backwardDeleteCollapsedSelection],
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
            [null!, null!, forwardDeleteCollapsedSelection],
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
            [null!, null!, backwardDeleteCollapsedSelection],
            DeleteResult.SingleChar,
            1
        );
    });

    it('Check parameter of formatWithContentModel, forward', () => {
        const spy = spyOn(formatWithContentModel, 'formatWithContentModel');
        const addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');

        const editor = ({
            addUndoSnapshot,
        } as any) as IContentModelEditor;
        const which = Keys.DELETE;
        const event = {
            which,
        } as any;

        handleKeyDownEvent(editor, event);

        expect(spy.calls.argsFor(0)[0]).toBe(editor);
        expect(spy.calls.argsFor(0)[1]).toBe('handleDeleteKey');
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(spy.calls.argsFor(0)[3]?.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[3]?.getChangeData?.()).toBe(which);
    });

    it('Check parameter of formatWithContentModel, backward', () => {
        const spy = spyOn(formatWithContentModel, 'formatWithContentModel');
        const preventDefault = jasmine.createSpy('preventDefault');

        const editor = 'EDITOR' as any;
        const which = Keys.BACKSPACE;
        const event = {
            which,
            preventDefault,
        } as any;

        handleKeyDownEvent(editor, event);

        expect(spy.calls.argsFor(0)[0]).toBe(editor);
        expect(spy.calls.argsFor(0)[1]).toBe('handleBackspaceKey');
        expect(spy.calls.argsFor(0)[3]?.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[3]?.getChangeData?.()).toBe(which);
    });
});
