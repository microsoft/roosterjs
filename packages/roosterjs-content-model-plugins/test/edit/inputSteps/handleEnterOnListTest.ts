import * as getListAnnounceData from 'roosterjs-content-model-api/lib/modelApi/list/getListAnnounceData';
import { deleteSelection, normalizeContentModel } from 'roosterjs-content-model-dom';
import { editingTestCommon } from '../editingTestCommon';
import { handleEnterOnList } from '../../../lib/edit/inputSteps/handleEnterOnList';
import { keyboardEnter } from '../../../lib/edit/keyboardEnter';
import {
    ContentModelDocument,
    ContentModelListItem,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

describe('handleEnterOnList', () => {
    let getListAnnounceDataSpy: jasmine.Spy;
    const mockedAnnounceData = 'ANNOUNCE' as any;

    beforeEach(() => {
        getListAnnounceDataSpy = spyOn(getListAnnounceData, 'getListAnnounceData').and.returnValue(
            mockedAnnounceData
        );
    });

    function runTest(
        model: ContentModelDocument,
        expectedModel: ContentModelDocument,
        expectedResult: 'notDeleted' | 'range',
        expectedListItem: ContentModelListItem | null
    ) {
        const context: FormatContentModelContext = {
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        };
        const result = deleteSelection(
            model,
            [context => (context.deleteResult = 'notDeleted'), handleEnterOnList],
            context
        );
        normalizeContentModel(model);

        expect(model).toEqual(expectedModel);
        expect(result.deleteResult).toBe(expectedResult);

        if (expectedListItem) {
            expect(getListAnnounceDataSpy).toHaveBeenCalledTimes(1);
            expect(getListAnnounceDataSpy).toHaveBeenCalledWith([expectedListItem, model]);
            expect(context).toEqual({
                deletedEntities: [],
                newEntities: [],
                newImages: [],
                announceData: mockedAnnounceData,
            });
        } else {
            expect(getListAnnounceDataSpy).not.toHaveBeenCalled();
            expect(context).toEqual({
                deletedEntities: [],
                newEntities: [],
                newImages: [],
            });
        }
    }

    it('no list item', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        };
        runTest(model, model, 'notDeleted', null);
    });

    it('empty list item', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(model, expectedModel, 'range', null);
    });

    it('enter on middle list item', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'te',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'st',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const expectedListItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'OL',
                    format: {
                        marginTop: '0px',
                        marginBottom: '0px',
                        listStyleType: 'decimal',
                        startNumberOverride: undefined,
                        displayForDummyItem: undefined,
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'te',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                expectedListItem,
            ],
            format: {},
        };
        runTest(model, expectedModel, 'range', expectedListItem);
    });

    it('enter on last list item', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const expectedListItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'OL',
                    format: {
                        marginTop: '0px',
                        marginBottom: '0px',
                        listStyleType: 'decimal',
                        startNumberOverride: undefined,
                        displayForDummyItem: undefined,
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
            format: {},
        };

        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                expectedListItem,
            ],
            format: {},
        };

        runTest(model, expectedModel, 'range', expectedListItem);
    });

    it('enter on last list item of second list', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":3}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"1) "',
                    },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":3}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"2) "',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":10}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"A) "',
                    },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":10}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"B) "',
                    },
                },
            ],
            format: {},
        };
        const expectedListItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'OL',
                    format: {
                        marginTop: '0px',
                        marginBottom: '0px',
                        startNumberOverride: undefined,
                        displayForDummyItem: undefined,
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":10}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
            format: {},
        };

        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":3}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"1) "',
                    },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":3}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"2) "',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":10}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"A) "',
                    },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":10}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"B) "',
                    },
                },
                expectedListItem,
            ],
            format: {},
        };

        runTest(model, expectedModel, 'range', expectedListItem);
    });

    it('enter on list item with selected text', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'OL',
                    format: {
                        marginTop: '0px',
                        marginBottom: '0px',
                        listStyleType: 'decimal',
                        startNumberOverride: undefined,
                        displayForDummyItem: undefined,
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                listItem,
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                                startNumberOverride: undefined,
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        runTest(model, expectedModel, 'range', listItem);
    });

    it('enter on multiple list items with selected text', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                    isSelected: true,
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'OL',
                    format: {
                        marginTop: '0px',
                        marginBottom: '0px',
                        listStyleType: 'decimal',
                        startNumberOverride: undefined,
                        displayForDummyItem: undefined,
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                listItem,
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        runTest(model, expectedModel, 'range', listItem);
    });

    it('expanded range mixed list with paragraph', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'te',
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'st',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'te',
                                    format: {},
                                    isSelected: true,
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'st',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'OL',
                    format: {
                        marginTop: '0px',
                        marginBottom: '0px',
                        listStyleType: 'decimal',
                        startNumberOverride: undefined,
                        displayForDummyItem: undefined,
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'te',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                listItem,
            ],
            format: {},
        };
        runTest(model, expectedModel, 'range', listItem);
    });

    it('expanded range with mixed list with paragraph | different styles', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'te',
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'st',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":3}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"1) "',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'te',
                                    format: {},
                                    isSelected: true,
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'st ',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'lower-alpha',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":5}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'OL',
                    format: {
                        marginTop: '0px',
                        marginBottom: '0px',
                        startNumberOverride: undefined,
                        displayForDummyItem: undefined,
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":3}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'te',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":3}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {
                        listStyleType: '"1) "',
                    },
                },
                listItem,
            ],
            format: {},
        };
        runTest(model, expectedModel, 'range', listItem);
    });

    it('Selection Marker has styles from previous list item', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: { fontSize: '20pt', fontWeight: 'bold' },
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: { fontWeight: 'bold' },
                                },
                            ],
                            format: {},
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: { fontSize: '10pt' },
                    },
                    levels: [{ listType: 'UL', format: {}, dataset: {} }],
                },
            ],
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: { fontSize: '20pt', fontWeight: 'bold' },
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: { fontWeight: 'bold' },
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'UL',
                    format: {
                        startNumberOverride: undefined,
                        displayForDummyItem: undefined,
                    },
                    dataset: {},
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: { fontSize: '10pt' },
            },
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Br',
                                    format: { fontSize: '20pt', fontWeight: 'bold' },
                                },
                            ],
                            format: {},
                            segmentFormat: { fontSize: '20pt' },
                        },
                    ],
                    format: {},
                    formatHolder: { segmentType: 'SelectionMarker', format: { fontSize: '10pt' } },
                    levels: [{ listType: 'UL', format: {}, dataset: {} }],
                },
                listItem,
            ],
        };

        runTest(model, expectedModel, 'range', listItem);
    });
});

describe('handleEnterOnList - keyboardEnter', () => {
    function runTest(
        input: ContentModelDocument,
        isShiftKey: boolean,
        expectedResult: ContentModelDocument,
        doNotCallDefaultFormat: boolean = false,
        calledTimes: number = 1
    ) {
        const preventDefault = jasmine.createSpy('preventDefault');
        const mockedEvent = ({
            key: 'Enter',
            shiftKey: isShiftKey,
            preventDefault,
        } as any) as KeyboardEvent;

        let editor: any;

        editingTestCommon(
            'handleEnterKey',
            newEditor => {
                editor = newEditor;

                editor.getDOMSelection = () => ({
                    type: 'range',
                    range: {
                        collapsed: true,
                    },
                });

                keyboardEnter(editor, mockedEvent, true);
            },
            input,
            expectedResult,
            calledTimes,
            doNotCallDefaultFormat
        );
    }

    it('Enter on list', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                                startNumberOverride: undefined,
                                displayForDummyItem: undefined,
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, false, expected);
    });

    it('Enter on empty list item', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, false, expected);
    });

    it('Enter + Shift on list item', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, true, expected, false, 1);
    });

    it('Two separate lists, Enter on first one', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', format: { startNumberOverride: 1 }, dataset: {} }],
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                { segmentType: 'Text', text: 'test', format: {} },
                                { segmentType: 'SelectionMarker', format: {}, isSelected: true },
                            ],
                        },
                    ],
                    format: {},
                    formatHolder: { segmentType: 'SelectionMarker', format: {} },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', format: { startNumberOverride: 1 }, dataset: {} }],
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [{ segmentType: 'Br', format: {} }],
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                },
            ],
        };

        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', format: { startNumberOverride: 1 }, dataset: {} }],
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [{ segmentType: 'Text', text: 'test', format: {} }],
                        },
                    ],
                    format: {},
                    formatHolder: { segmentType: 'SelectionMarker', format: {} },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: undefined,
                                displayForDummyItem: undefined,
                            },
                            dataset: {},
                        },
                    ],
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                { segmentType: 'SelectionMarker', format: {}, isSelected: true },
                                { segmentType: 'Br', format: {} },
                            ],
                        },
                    ],
                    format: {},
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: false },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [{ segmentType: 'Br', format: {} }],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                            },
                            dataset: {},
                        },
                    ],
                    formatHolder: { segmentType: 'SelectionMarker', format: {} },
                    format: {},
                },
            ],
        };

        runTest(model, false, expectedModel, false, 1);
    });

    it('List item contains multiple blocks', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'test1',
                                    segmentType: 'Text',
                                    format: {},
                                },
                                {
                                    isSelected: true,
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                                {
                                    text: 'test2',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            blockType: 'Paragraph',
                            format: {},
                        },
                        {
                            segments: [
                                {
                                    text: 'test3',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            isImplicit: true,
                            segments: [
                                {
                                    text: 'test4',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
        };

        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'test1',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: undefined,
                                displayForDummyItem: undefined,
                            },
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    isSelected: true,
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                                {
                                    text: 'test2',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            blockType: 'Paragraph',
                            format: {},
                        },
                        {
                            segments: [
                                {
                                    text: 'test3',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: undefined,
                            },
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            isImplicit: true,
                            segments: [
                                {
                                    text: 'test4',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
        };

        runTest(model, false, expectedModel, false, 1);
    });

    it('List item must continue second level', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'test',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'lower-alpha',
                            },
                            dataset: {
                                editingInfo: '{"applyListStyleFromLevel":true}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'test',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    isSelected: true,
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'lower-alpha',
                            },
                            dataset: {
                                editingInfo: '{"applyListStyleFromLevel":true}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'test',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'test',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'lower-alpha',
                            },
                            dataset: {
                                editingInfo: '{"applyListStyleFromLevel":true}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'test',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    segments: [
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                                startNumberOverride: undefined,
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'lower-alpha',
                                startNumberOverride: 2,
                            },
                            dataset: {
                                editingInfo: '{"applyListStyleFromLevel":true}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'test',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
            format: {},
        };
        runTest(model, false, expectedModel, false, 1);
    });

    it('Should maintain list chain when split the list ', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'one',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'two',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    isSelected: true,
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'three',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'four',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'one',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'two',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    segments: [
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                                startNumberOverride: 3,
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'three',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'four',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
            format: {},
        };
        runTest(model, false, expectedModel, false, 1);
    });

    it('Should maintain list chain when split the list two times', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'one',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'two',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                                startNumberOverride: 3,
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'three',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'four',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'five',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    isSelected: true,
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'six',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'one',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'two',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                                startNumberOverride: 3,
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'three',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'four',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'five',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    segments: [
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                                startNumberOverride: 6,
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'six',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
            format: {},
        };
        runTest(model, false, expectedModel, false, 1);
    });

    it('Should keep margin left/right and text align of list', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {
                        marginLeft: '10px',
                        marginRight: '20px',
                        textAlign: 'start',
                    },
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'one',
                                    segmentType: 'Text',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {
                        marginLeft: '10px',
                        marginRight: '20px',
                        textAlign: 'start',
                    },
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'one',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: undefined,
                                listStyleType: 'decimal',
                                displayForDummyItem: undefined,
                            },
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {
                        marginLeft: '10px',
                        marginRight: '20px',
                        textAlign: 'start',
                    },
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
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
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
            format: {},
        };
        runTest(model, false, expectedModel, false, 1);
    });
});
