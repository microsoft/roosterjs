import * as deleteSelection from 'roosterjs-content-model-core/lib/publicApi/selection/deleteSelection';
import * as handleKeyboardEventResult from '../../lib/edit/handleKeyboardEventCommon';
import { ChangeSource } from 'roosterjs-content-model-core';
import { ContentModelDocument, DOMSelection } from 'roosterjs-content-model-types';
import { deleteAllSegmentBefore } from '../../lib/edit/deleteSteps/deleteAllSegmentBefore';
import { DeleteResult, DeleteSelectionStep } from 'roosterjs-content-model-types';
import { editingTestCommon } from './editingTestCommon';
import { IContentModelEditor } from 'roosterjs-content-model-editor';
import { keyboardDelete } from '../../lib/edit/keyboardDelete';
import { Keys } from 'roosterjs-editor-types';
import {
    backwardDeleteWordSelection,
    forwardDeleteWordSelection,
} from '../../lib/edit/deleteSteps/deleteWordSelection';
import {
    backwardDeleteCollapsedSelection,
    forwardDeleteCollapsedSelection,
} from '../../lib/edit/deleteSteps/deleteCollapsedSelection';

describe('keyboardDelete', () => {
    let deleteSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        deleteSelectionSpy = spyOn(deleteSelection, 'deleteSelection');
    });

    function runTest(
        input: ContentModelDocument,
        key: string,
        expectedResult: ContentModelDocument,
        expectedSteps: DeleteSelectionStep[],
        expectedDelete: DeleteResult,
        expectedClearModelCache: boolean,
        calledTimes: number
    ) {
        deleteSelectionSpy.and.returnValue({
            deleteResult: expectedDelete,
        });

        const preventDefault = jasmine.createSpy('preventDefault');
        const mockedEvent = ({
            key,
            preventDefault,
        } as any) as KeyboardEvent;

        let editor: any;

        editingTestCommon(
            key == 'Delete' ? 'handleDeleteKey' : 'handleBackspaceKey',
            newEditor => {
                editor = newEditor;

                editor.getDOMSelection = () => ({
                    type: 'range',
                    range: {
                        collapsed: false,
                    },
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
            newImages: [],
            skipUndoSnapshot: true,
            clearModelCache: expectedClearModelCache,
        });
    }

    it('Empty model, forward', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            'Delete',
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            [null!, null!, forwardDeleteCollapsedSelection],
            'notDeleted',
            true,
            0
        );
    });

    it('Empty model, backward', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            'Backspace',
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            [null!, null!, backwardDeleteCollapsedSelection],
            'notDeleted',
            true,
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
            'Delete',
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            [null!, forwardDeleteWordSelection, forwardDeleteCollapsedSelection],
            'notDeleted',
            true,
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
            'Backspace',
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            [null!, backwardDeleteWordSelection, backwardDeleteCollapsedSelection],
            'notDeleted',
            true,
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
            'Delete',
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            [null!, null!, forwardDeleteCollapsedSelection],
            'notDeleted',
            true,
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
            'Backspace',
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            [deleteAllSegmentBefore, null!, backwardDeleteCollapsedSelection],
            'notDeleted',
            true,
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
            'Delete',
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
            'notDeleted',
            true,
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
            'Backspace',
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
            'notDeleted',
            true,
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
            'Delete',
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
            'singleChar',
            false,
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
            'Backspace',
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
            'singleChar',
            false,
            1
        );
    });

    it('Check parameter of formatContentModel, forward', () => {
        const spy = jasmine.createSpy('formatContentModel');

        const editor = ({
            formatContentModel: spy,
            getDOMSelection: () => ({
                type: 'range',
                range: { collapsed: false },
            }),
        } as any) as IContentModelEditor;
        const event = {
            which: Keys.DELETE,
            key: 'Delete',
        } as any;

        keyboardDelete(editor, event);

        expect(spy.calls.argsFor(0)[1]!.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[1]!.getChangeData?.()).toBe(Keys.DELETE);
        expect(spy.calls.argsFor(0)[1]!.apiName).toBe('handleDeleteKey');
    });

    it('Check parameter of formatWithContentModel, backward', () => {
        const spy = jasmine.createSpy('formatContentModel');
        const preventDefault = jasmine.createSpy('preventDefault');

        const editor = {
            formatContentModel: spy,
            getDOMSelection: () => ({
                type: 'range',
                range: { collapsed: false },
            }),
        } as any;
        const which = Keys.BACKSPACE;
        const event = {
            key: 'Backspace',
            which,
            preventDefault,
        } as any;

        keyboardDelete(editor, event);

        expect(spy.calls.argsFor(0)[1]!.apiName).toBe('handleBackspaceKey');
        expect(spy.calls.argsFor(0)[1]?.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[1]?.getChangeData?.()).toBe(which);
    });

    it('No need to delete - Backspace', () => {
        const rawEvent = { key: 'Backspace' } as any;
        const formatWithContentModelSpy = jasmine.createSpy('formatContentModel');
        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: true,
                startContainer: document.createTextNode('test'),
                startOffset: 2,
            } as any) as Range,
        };
        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
        } as any;

        keyboardDelete(editor, rawEvent);

        expect(formatWithContentModelSpy).not.toHaveBeenCalled();
    });

    it('No need to delete - Delete', () => {
        const rawEvent = { key: 'Delete' } as any;
        const formatWithContentModelSpy = jasmine.createSpy('formatContentModel');
        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: true,
                startContainer: document.createTextNode('test'),
                startOffset: 2,
            } as any) as Range,
        };
        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
        } as any;

        keyboardDelete(editor, rawEvent);

        expect(formatWithContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace from the beginning', () => {
        const rawEvent = { key: 'Backspace' } as any;
        const formatWithContentModelSpy = jasmine.createSpy('formatContentModel');
        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: true,
                startContainer: document.createTextNode('test'),
                startOffset: 0,
            } as any) as Range,
        };

        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
        } as any;

        const result = keyboardDelete(editor, rawEvent);

        expect(result).toBeTrue();
        expect(formatWithContentModelSpy).toHaveBeenCalledTimes(1);
    });

    it('Delete from the last', () => {
        const rawEvent = { key: 'Delete' } as any;
        const formatWithContentModelSpy = jasmine.createSpy('formatContentModel');
        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: true,
                startContainer: document.createTextNode('test'),
                startOffset: 4,
            } as any) as Range,
        };

        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
        } as any;

        const result = keyboardDelete(editor, rawEvent);

        expect(result).toBeTrue();
        expect(formatWithContentModelSpy).toHaveBeenCalledTimes(1);
    });
});
