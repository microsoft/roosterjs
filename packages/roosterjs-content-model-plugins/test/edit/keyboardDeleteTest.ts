import * as deleteCollapsedSelectionModule from '../../lib/edit/deleteSteps/deleteCollapsedSelection';
import * as deleteSelection from 'roosterjs-content-model-dom/lib/modelApi/editing/deleteSelection';
import * as editTableModule from 'roosterjs-content-model-api/lib/publicApi/table/editTable';
import * as handleKeyboardEventResult from '../../lib/edit/handleKeyboardEventCommon';
import { ChangeSource, setLinkUndeletable } from 'roosterjs-content-model-dom';
import { ContentModelDocument, DOMSelection, IEditor } from 'roosterjs-content-model-types';
import { deleteAllSegmentBefore } from '../../lib/edit/deleteSteps/deleteAllSegmentBefore';
import { deleteEmptyQuote } from '../../lib/edit/deleteSteps/deleteEmptyQuote';
import { deleteList } from '../../lib/edit/deleteSteps/deleteList';
import { deleteParagraphStyle } from '../../lib/edit/deleteSteps/deleteParagraphStyle';
import { DeleteResult, DeleteSelectionStep } from 'roosterjs-content-model-types';
import { editingTestCommon } from './editingTestCommon';
import { keyboardDelete } from '../../lib/edit/keyboardDelete';
import {
    backwardDeleteWordSelection,
    forwardDeleteWordSelection,
} from '../../lib/edit/deleteSteps/deleteWordSelection';

const Delete = 46;
const Backspace = 8;

// Create the function variables by calling the factory function
const forwardDeleteCollapsedSelection = deleteCollapsedSelectionModule.getDeleteCollapsedSelection(
    'forward',
    {}
);
const backwardDeleteCollapsedSelection = deleteCollapsedSelectionModule.getDeleteCollapsedSelection(
    'backward',
    {}
);

describe('keyboardDelete', () => {
    let deleteSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        deleteSelectionSpy = spyOn(deleteSelection, 'deleteSelection');
        // Spy on the factory function to return our pre-created variables
        spyOn(deleteCollapsedSelectionModule, 'getDeleteCollapsedSelection').and.callFake(
            (direction: 'forward' | 'backward', options: any) => {
                return direction === 'forward'
                    ? forwardDeleteCollapsedSelection
                    : backwardDeleteCollapsedSelection;
            }
        );
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

                const result = keyboardDelete(editor, mockedEvent, {});

                expect(result).toBe(expectedDelete == 'range' || expectedDelete == 'singleChar');
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
            [null!, null!, null!, forwardDeleteCollapsedSelection, null!, deleteParagraphStyle],
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
            [
                null!,
                null!,
                deleteList,
                backwardDeleteCollapsedSelection,
                deleteEmptyQuote,
                deleteParagraphStyle,
            ],
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
            [
                null!,
                forwardDeleteWordSelection,
                null!,
                forwardDeleteCollapsedSelection,
                null!,
                deleteParagraphStyle,
            ],
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
            [
                null!,
                backwardDeleteWordSelection,
                deleteList,
                backwardDeleteCollapsedSelection,
                deleteEmptyQuote,
                deleteParagraphStyle,
            ],
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
            [null!, null!, null!, forwardDeleteCollapsedSelection, null!, deleteParagraphStyle],
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
            [
                deleteAllSegmentBefore,
                null!,
                deleteList,
                backwardDeleteCollapsedSelection,
                deleteEmptyQuote,
                deleteParagraphStyle,
            ],
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
            [null!, null!, null!, forwardDeleteCollapsedSelection, null!, deleteParagraphStyle],
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
            [
                null!,
                null!,
                deleteList,
                backwardDeleteCollapsedSelection,
                deleteEmptyQuote,
                deleteParagraphStyle,
            ],
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
            [null!, null!, null!, forwardDeleteCollapsedSelection, null!, deleteParagraphStyle],
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
            [
                null!,
                null!,
                deleteList,
                backwardDeleteCollapsedSelection,
                deleteEmptyQuote,
                deleteParagraphStyle,
            ],
            'singleChar',
            false,
            1
        );
    });

    it('Backspace on empty list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {
                            listStyleType: '"1. "',
                        },
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        format: {},
                                        isSelected: true,
                                    },
                                    {
                                        segmentType: 'Br',
                                        format: {},
                                    },
                                ],
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                    },
                ],
            },
            'Backspace',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {
                            listStyleType: '"1. "',
                        },
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        format: {},
                                        isSelected: true,
                                    },
                                    {
                                        segmentType: 'Br',
                                        format: {},
                                    },
                                ],
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                    },
                ],
            },
            [
                null!,
                null!,
                deleteList,
                backwardDeleteCollapsedSelection,
                deleteEmptyQuote,
                deleteParagraphStyle,
            ],
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
            getEnvironment: () => ({}),
        } as any) as IEditor;
        const event = {
            which: Delete,
            key: 'Delete',
        } as any;

        keyboardDelete(editor, event, {});

        expect(spy.calls.argsFor(0)[1]!.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[1]!.getChangeData?.()).toBe(Delete);
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
            getEnvironment: () => ({}),
        } as any;
        const which = Backspace;
        const event = {
            key: 'Backspace',
            which,
            preventDefault,
        } as any;

        keyboardDelete(editor, event, {});

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
            isReverted: false,
        };
        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        keyboardDelete(editor, rawEvent, {});

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
            isReverted: false,
        };
        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(formatWithContentModelSpy).not.toHaveBeenCalled();
    });

    it('No need to delete - Delete with shiftKey should not delete with content model', () => {
        const rawEvent = { key: 'Delete', shiftKey: true } as any;
        const formatWithContentModelSpy = jasmine.createSpy('formatContentModel');
        const node = document.createTextNode('test');
        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: false,
                startContainer: node,
                endContainer: node,
                startOffset: 0,
                endOffset: 4,
            } as any) as Range,
            isReverted: false,
        };
        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(formatWithContentModelSpy).not.toHaveBeenCalled();
    });

    it('No need to delete - handleExpandedSelection disabled', () => {
        const rawEvent = { key: 'Backspace' } as any;
        const formatWithContentModelSpy = jasmine.createSpy('formatContentModel');
        const node = document.createTextNode('test');
        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: false,
                startContainer: node,
                endContainer: node,
                startOffset: 1,
                endOffset: 3,
            } as any) as Range,
            isReverted: false,
        };
        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        keyboardDelete(
            editor,
            rawEvent,
            { handleExpandedSelectionOnDelete: false } /* handleExpandedSelectionOnDelete */
        );

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
            isReverted: false,
        };

        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        keyboardDelete(editor, rawEvent, {});

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
            isReverted: false,
        };

        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(formatWithContentModelSpy).toHaveBeenCalledTimes(1);
    });

    it('Delete all the content of text node - handleExpandedSelection disabled', () => {
        const rawEvent = { key: 'Backspace' } as any;
        const formatWithContentModelSpy = jasmine.createSpy('formatContentModel');
        const node = document.createTextNode('test');
        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: false,
                startContainer: node,
                endContainer: node,
                startOffset: 0,
                endOffset: 4,
            } as any) as Range,
            isReverted: false,
        };
        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        keyboardDelete(
            editor,
            rawEvent,
            { handleExpandedSelectionOnDelete: false } /* handleExpandedSelectionOnDelete */
        );

        expect(formatWithContentModelSpy).toHaveBeenCalledTimes(1);
    });

    it('Next sibling is undeletable', () => {
        const rawEvent = { key: 'Backspace' } as any;
        const formatWithContentModelSpy = jasmine.createSpy('formatContentModel');
        const node = document.createTextNode('test');
        const next = document.createElement('a');

        setLinkUndeletable(next, true);

        const parentDiv = document.createElement('div');
        parentDiv.appendChild(node);
        parentDiv.appendChild(next);

        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: true,
                startContainer: node,
                endContainer: node,
                startOffset: 4,
                endOffset: 4,
            } as any) as Range,
            isReverted: false,
        };
        const editor = {
            formatContentModel: formatWithContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        keyboardDelete(
            editor,
            rawEvent,
            { handleExpandedSelectionOnDelete: false } /* handleExpandedSelectionOnDelete */
        );

        expect(formatWithContentModelSpy).toHaveBeenCalledTimes(1);
    });
});

describe('keyboardDelete - table selection', () => {
    let editTableSpy: jasmine.Spy;

    beforeEach(() => {
        editTableSpy = spyOn(editTableModule, 'editTable');
    });

    function createMockTable(rows: number, columns: number): HTMLTableElement {
        const table = document.createElement('table');
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement('td');
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        return table;
    }

    it('Backspace on table selection with whole column selected should delete column', () => {
        const table = createMockTable(3, 3);
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 1,
            lastColumn: 1,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteColumn');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace on table selection with whole row selected should delete row', () => {
        const table = createMockTable(3, 3);
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 1,
            lastRow: 1,
            firstColumn: 0,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteRow');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Delete with Shift on table selection with whole column selected should delete column', () => {
        const table = createMockTable(3, 3);
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 0,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Delete', shiftKey: true } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteColumn');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Delete with Shift on table selection with whole row selected should delete row', () => {
        const table = createMockTable(3, 3);
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 2,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Delete', shiftKey: true } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteRow');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Delete without Shift on table selection should not delete table rows/columns', () => {
        const table = createMockTable(3, 3);
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 0,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Delete', shiftKey: false } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
    });

    it('Backspace on table selection with partial selection should not delete table rows/columns', () => {
        const table = createMockTable(3, 3);
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 1,
            firstColumn: 0,
            lastColumn: 1,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
    });

    it('Delete+Shift on range selection should not call formatContentModel to allow browser cut', () => {
        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const node = document.createTextNode('test');
        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: false,
                startContainer: node,
                endContainer: node,
                startOffset: 0,
                endOffset: 4,
            } as any) as Range,
            isReverted: false,
        };

        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Delete', shiftKey: true } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Delete+Shift on collapsed range selection should not call formatContentModel to allow browser cut', () => {
        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const node = document.createTextNode('test');
        const range: DOMSelection = {
            type: 'range',
            range: ({
                collapsed: true,
                startContainer: node,
                startOffset: 2,
            } as any) as Range,
            isReverted: false,
        };

        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => range,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Delete', shiftKey: true } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace on entire table selection should delete table', () => {
        const table = createMockTable(3, 3);
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteTable');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Shift+Delete on entire table selection should delete table', () => {
        const table = createMockTable(3, 3);
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Delete', shiftKey: true } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteTable');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });
});

describe('keyboardDelete - table selection with colspan and rowspan', () => {
    let editTableSpy: jasmine.Spy;

    beforeEach(() => {
        editTableSpy = spyOn(editTableModule, 'editTable');
    });

    // Creates a table with colspan in first row:
    // | col1 (colspan=2) | col3 |
    // | col1 | col2      | col3 |
    // | col1 | col2      | col3 |
    function createTableWithColspan(): HTMLTableElement {
        const table = document.createElement('table');

        const row1 = document.createElement('tr');
        const cell1_1 = document.createElement('td');
        cell1_1.colSpan = 2;
        const cell1_2 = document.createElement('td');
        row1.appendChild(cell1_1);
        row1.appendChild(cell1_2);

        const row2 = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            row2.appendChild(document.createElement('td'));
        }

        const row3 = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            row3.appendChild(document.createElement('td'));
        }

        table.appendChild(row1);
        table.appendChild(row2);
        table.appendChild(row3);
        return table;
    }

    // Creates a table with rowspan in first column:
    // | col1 (rowspan=2) | col2 | col3 |
    // |                  | col2 | col3 |
    // | col1             | col2 | col3 |
    function createTableWithRowspan(): HTMLTableElement {
        const table = document.createElement('table');

        const row1 = document.createElement('tr');
        const cell1_1 = document.createElement('td');
        cell1_1.rowSpan = 2;
        row1.appendChild(cell1_1);
        row1.appendChild(document.createElement('td'));
        row1.appendChild(document.createElement('td'));

        const row2 = document.createElement('tr');
        row2.appendChild(document.createElement('td'));
        row2.appendChild(document.createElement('td'));

        const row3 = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            row3.appendChild(document.createElement('td'));
        }

        table.appendChild(row1);
        table.appendChild(row2);
        table.appendChild(row3);
        return table;
    }

    // Creates a table with both colspan and rowspan:
    // | col1 (colspan=2, rowspan=2) | col3 |
    // |                             | col3 |
    // | col1 | col2                 | col3 |
    function createTableWithColspanAndRowspan(): HTMLTableElement {
        const table = document.createElement('table');

        const row1 = document.createElement('tr');
        const cell1_1 = document.createElement('td');
        cell1_1.colSpan = 2;
        cell1_1.rowSpan = 2;
        row1.appendChild(cell1_1);
        row1.appendChild(document.createElement('td'));

        const row2 = document.createElement('tr');
        row2.appendChild(document.createElement('td'));

        const row3 = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            row3.appendChild(document.createElement('td'));
        }

        table.appendChild(row1);
        table.appendChild(row2);
        table.appendChild(row3);
        return table;
    }

    it('Backspace on table with colspan - whole row selected should delete row', () => {
        const table = createTableWithColspan();
        // Table has 3 logical columns, select all columns in row 0
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 0,
            firstColumn: 0,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteRow');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace on table with colspan - whole column selected should delete column', () => {
        const table = createTableWithColspan();
        // Select all rows for column 2
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 2,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteColumn');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace on table with colspan - partial row selection should not delete row', () => {
        const table = createTableWithColspan();
        // Select only 2 columns (not all 3)
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 0,
            firstColumn: 0,
            lastColumn: 1,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
    });

    it('Backspace on table with rowspan - whole row selected should delete row', () => {
        const table = createTableWithRowspan();
        // Select all columns in row 2 (row without rowspan)
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 2,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteRow');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace on table with rowspan - whole column selected should delete column', () => {
        const table = createTableWithRowspan();
        // Select all rows for column 0 (column with rowspan)
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 0,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteColumn');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace on table with colspan and rowspan - entire table selected should delete table', () => {
        const table = createTableWithColspanAndRowspan();
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteTable');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Shift+Delete on table with colspan and rowspan - entire table selected should delete table', () => {
        const table = createTableWithColspanAndRowspan();
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Delete', shiftKey: true } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteTable');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace on table with colspan and rowspan - whole row selected should delete row', () => {
        const table = createTableWithColspanAndRowspan();
        // Select all columns in row 2
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 2,
            lastRow: 2,
            firstColumn: 0,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteRow');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace on table with colspan and rowspan - whole column selected should delete column', () => {
        const table = createTableWithColspanAndRowspan();
        // Select all rows for column 2
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 2,
            firstColumn: 2,
            lastColumn: 2,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).toHaveBeenCalledWith(editor, 'deleteColumn');
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Backspace on table with colspan - partial selection should not delete', () => {
        const table = createTableWithColspanAndRowspan();
        // Partial selection
        const tableSelection: DOMSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 1,
            firstColumn: 0,
            lastColumn: 1,
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const editor = {
            formatContentModel: formatContentModelSpy,
            getDOMSelection: () => tableSelection,
            getEnvironment: () => ({}),
        } as any;

        const rawEvent = { key: 'Backspace' } as any;

        keyboardDelete(editor, rawEvent, {});

        expect(editTableSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
    });
});
