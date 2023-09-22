import * as deleteSelection from '../../../lib/modelApi/edit/deleteSelection';
import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as handleKeyboardEventResult from '../../../lib/editor/utils/handleKeyboardEventCommon';
import keyboardDelete from '../../../lib/publicApi/editing/keyboardDelete';
import { ChangeSource, Keys, SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';
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

describe('keyboardDelete', () => {
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

                editor.getSelectionRangeEx = () => ({
                    type: SelectionRangeTypes.Normal,
                    ranges: [
                        {
                            collapsed: false,
                        },
                    ],
                });
                const result = keyboardDelete(editor, mockedEvent);

                expect(result).toBeTrue();
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
            getSelectionRangeEx: () => ({
                type: SelectionRangeTypes.Normal,
                ranges: [{ collapsed: false }],
            }),
        } as any) as IContentModelEditor;
        const which = Keys.DELETE;
        const event = {
            which,
        } as any;

        keyboardDelete(editor, event);

        expect(spy.calls.argsFor(0)[0]).toBe(editor);
        expect(spy.calls.argsFor(0)[1]).toBe('handleDeleteKey');
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(spy.calls.argsFor(0)[3]?.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[3]?.getChangeData?.()).toBe(which);
    });

    it('Check parameter of formatWithContentModel, backward', () => {
        const spy = spyOn(formatWithContentModel, 'formatWithContentModel');
        const preventDefault = jasmine.createSpy('preventDefault');

        const editor = {
            getSelectionRangeEx: () => ({
                type: SelectionRangeTypes.Normal,
                ranges: [{ collapsed: false }],
            }),
        } as any;
        const which = Keys.BACKSPACE;
        const event = {
            which,
            preventDefault,
        } as any;

        keyboardDelete(editor, event);

        expect(spy.calls.argsFor(0)[0]).toBe(editor);
        expect(spy.calls.argsFor(0)[1]).toBe('handleBackspaceKey');
        expect(spy.calls.argsFor(0)[3]?.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[3]?.getChangeData?.()).toBe(which);
    });

    it('No need to delete - Backspace', () => {
        const rawEvent = { which: Keys.BACKSPACE } as any;
        const range: SelectionRangeEx = {
            type: SelectionRangeTypes.Normal,
            ranges: [
                ({
                    collapsed: true,
                    startContainer: document.createTextNode('test'),
                    startOffset: 2,
                } as any) as Range,
            ],
            areAllCollapsed: true,
        };
        const editor = {
            getSelectionRangeEx: () => range,
        } as any;
        const formatWithContentModelSpy = spyOn(formatWithContentModel, 'formatWithContentModel');

        const result = keyboardDelete(editor, rawEvent);

        expect(result).toBeFalse();
        expect(formatWithContentModelSpy).not.toHaveBeenCalled();
    });

    it('No need to delete - Delete', () => {
        const rawEvent = { which: Keys.DELETE } as any;
        const range: SelectionRangeEx = {
            type: SelectionRangeTypes.Normal,
            ranges: [
                ({
                    collapsed: true,
                    startContainer: document.createTextNode('test'),
                    startOffset: 2,
                } as any) as Range,
            ],
            areAllCollapsed: true,
        };
        const editor = {
            getSelectionRangeEx: () => range,
        } as any;
        const formatWithContentModelSpy = spyOn(formatWithContentModel, 'formatWithContentModel');

        const result = keyboardDelete(editor, rawEvent);

        expect(result).toBeFalse();
        expect(formatWithContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace from the beginning', () => {
        const rawEvent = { which: Keys.BACKSPACE } as any;
        const range: SelectionRangeEx = {
            type: SelectionRangeTypes.Normal,
            ranges: [
                ({
                    collapsed: true,
                    startContainer: document.createTextNode('test'),
                    startOffset: 0,
                } as any) as Range,
            ],
            areAllCollapsed: true,
        };

        const editor = {
            getSelectionRangeEx: () => range,
        } as any;
        const formatWithContentModelSpy = spyOn(formatWithContentModel, 'formatWithContentModel');

        const result = keyboardDelete(editor, rawEvent);

        expect(result).toBeTrue();
        expect(formatWithContentModelSpy).toHaveBeenCalledTimes(1);
    });

    it('Delete from the last', () => {
        const rawEvent = { which: Keys.DELETE } as any;
        const range: SelectionRangeEx = {
            type: SelectionRangeTypes.Normal,
            ranges: [
                ({
                    collapsed: true,
                    startContainer: document.createTextNode('test'),
                    startOffset: 4,
                } as any) as Range,
            ],
            areAllCollapsed: true,
        };

        const editor = {
            getSelectionRangeEx: () => range,
        } as any;
        const formatWithContentModelSpy = spyOn(formatWithContentModel, 'formatWithContentModel');

        const result = keyboardDelete(editor, rawEvent);

        expect(result).toBeTrue();
        expect(formatWithContentModelSpy).toHaveBeenCalledTimes(1);
    });
});
