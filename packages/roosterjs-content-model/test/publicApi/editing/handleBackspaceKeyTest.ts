import * as deleteSelection from '../../../lib/modelApi/selection/deleteSelections';
import * as handleKeyboardEventResult from '../../../lib/editor/utils/handleKeyboardEventCommon';
import handleBackspaceKey from '../../../lib/publicApi/editing/handleBackspaceKey';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { editingTestCommon } from './editingTestCommon';

describe('handleBackspaceKey', () => {
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
                handleBackspaceKey(editor, mockedEvent);
            },
            input,
            expectedResult,
            calledTimes
        );

        expect(handleKeyboardEventResult.getOnDeleteEntityCallback).toHaveBeenCalledWith(
            editor,
            mockedEvent
        );
        expect(deleteSelectionSpy).toHaveBeenCalledWith(input, {
            direction: 'backward',
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
});
