import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import setListStyle from '../../../lib/publicApi/list/setListStyle';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ListMetadataFormat } from '../../../lib/publicTypes/format/formatParts/ListMetadataFormat';

describe('setListStyle', () => {
    function runTest(
        input: ContentModelDocument,
        style: ListMetadataFormat,
        expectedModel: ContentModelDocument,
        expectedResult: boolean
    ) {
        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (editor, apiName, callback) => {
                expect(apiName).toBe('setListStyle');
                const result = callback(input);

                expect(result).toBe(expectedResult);
            }
        );

        setListStyle(null!, style);

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
        expect(input).toEqual(expectedModel);
    }

    it('no list selected', () => {
        const mockedModel: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [],
        };
        const result: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [],
        };

        runTest(mockedModel, {}, result, false);
    });

    it('list is selected after paragraph', () => {
        const mockedModel: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL' }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
            ],
        };
        const result: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL' }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
            ],
        };

        runTest(mockedModel, { orderedStyleType: 1 }, result, false);
    });

    it('single selected list item', () => {
        const mockedModel: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL' }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
            ],
        };
        const result: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', orderedStyleType: 2 }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
            ],
        };

        runTest(mockedModel, { orderedStyleType: 2 }, result, true);
    });

    it('deeper selected list item', () => {
        const mockedModel: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [
                        { listType: 'OL', startNumberOverride: 1 },
                        { listType: 'UL', unorderedStyleType: 3 },
                    ],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
            ],
        };
        const result: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [
                        { listType: 'OL', startNumberOverride: 1 },
                        { listType: 'UL', unorderedStyleType: 4 },
                    ],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
            ],
        };

        runTest(mockedModel, { unorderedStyleType: 4 }, result, true);
    });

    it('Multiple list items', () => {
        const mockedModel: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL' }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL' }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL' }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
            ],
        };
        const result: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', orderedStyleType: 2 }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', orderedStyleType: 2 }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', orderedStyleType: 2 }],
                    formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
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
                    format: {},
                },
            ],
        };

        runTest(mockedModel, { orderedStyleType: 2 }, result, true);
    });
});
