import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import setListStartNumber from '../../../lib/publicApi/list/setListStartNumber';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';

describe('setListStartNumber', () => {
    function runTest(
        input: ContentModelDocument,
        expectedModel: ContentModelDocument,
        expectedResult: boolean
    ) {
        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (editor, apiName, callback) => {
                expect(apiName).toBe('setListStartNumber');
                const result = callback(input);

                expect(result).toBe(expectedResult);
            }
        );

        setListStartNumber(null!, 2);

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

        runTest(mockedModel, result, false);
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

        runTest(mockedModel, result, false);
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
                    levels: [{ listType: 'OL', startNumberOverride: 2 }],
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

        runTest(mockedModel, result, true);
    });

    it('deeper selected list item', () => {
        const mockedModel: ContentModelDocument = {
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    levels: [{ listType: 'OL', startNumberOverride: 1 }, { listType: 'UL' }],
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
                        { listType: 'UL', startNumberOverride: 2 },
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

        runTest(mockedModel, result, true);
    });
});
