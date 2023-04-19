import * as deleteSelection from '../../../lib/modelApi/selection/deleteSelections';
import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as handleKeyboardEventResult from '../../../lib/editor/utils/handleKeyboardEventCommon';
import handleDeleteKey from '../../../lib/publicApi/editing/handleDeleteKey';
import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { editingTestCommon } from './editingTestCommon';

describe('handleDeleteKey', () => {
    let deleteSelectionSpy: jasmine.Spy;
    let mockedCallback = 'CALLBACK' as any;

    beforeEach(() => {
        spyOn(handleKeyboardEventResult, 'handleKeyboardEventResult');
        spyOn(handleKeyboardEventResult, 'getOnDeleteEntityCallback').and.returnValue(
            mockedCallback
        );
        deleteSelectionSpy = spyOn(deleteSelection, 'deleteSelection');
    });

    function runTest(
        input: ContentModelDocument,
        expectedResult: ContentModelDocument,
        expectedDelete: boolean,
        calledTimes: number
    ) {
        const mockedEvent = {} as KeyboardEvent;
        deleteSelectionSpy.and.returnValue({
            isChanged: expectedDelete,
        });

        let editor: any;

        editingTestCommon(
            'handleBackspaceKey',
            newEditor => {
                editor = newEditor;
                handleDeleteKey(editor, mockedEvent, []);
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
        expect(deleteSelectionSpy).toHaveBeenCalledWith(input, {
            direction: 'forward',
            onDeleteEntity: mockedCallback,
        });
        expect(handleKeyboardEventResult.handleKeyboardEventResult).toHaveBeenCalledWith(
            editor,
            input,
            mockedEvent,
            expectedDelete
        );
    }

    it('Empty model', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            false,
            0
        );
    });

    it('Model with content', () => {
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
            false,
            0
        );
    });

    it('Model with content and selection', () => {
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
            true,
            1
        );
    });

    it('Check parameter of formatWithContentModel', () => {
        const spy = spyOn(formatWithContentModel, 'formatWithContentModel');

        const editor = 'EDITOR' as any;
        const which = 'WHICH';
        const event = {
            which,
        } as any;
        const triggeredEvents = 'EVENTS' as any;

        handleDeleteKey(editor, event, triggeredEvents);

        expect(spy.calls.argsFor(0)[0]).toBe(editor);
        expect(spy.calls.argsFor(0)[1]).toBe('handleDeleteKey');
        expect(spy.calls.argsFor(0)[3]?.skipUndoSnapshot).toBe(true);
        expect(spy.calls.argsFor(0)[3]?.changeSource).toBe(ChangeSource.Keyboard);
        expect(spy.calls.argsFor(0)[3]?.getChangeData?.()).toBe(which);
    });
});
