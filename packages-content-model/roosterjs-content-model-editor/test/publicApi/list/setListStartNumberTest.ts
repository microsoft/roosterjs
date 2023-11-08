import setListStartNumber from '../../../lib/publicApi/list/setListStartNumber';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';

describe('setListStartNumber', () => {
    function runTest(
        input: ContentModelDocument,
        expectedModel: ContentModelDocument,
        expectedResult: boolean
    ) {
        let formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    expect(options.apiName).toBe('setListStartNumber');
                    const result = callback(input, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });

                    expect(result).toBe(expectedResult);
                }
            );

        setListStartNumber(
            {
                formatContentModel: formatContentModelSpy,
                focus: () => {},
            } as any,
            2
        );

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
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
                    levels: [{ listType: 'OL', dataset: {}, format: {} }],
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
                    levels: [{ listType: 'OL', dataset: {}, format: {} }],
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
                    levels: [{ listType: 'OL', dataset: {}, format: {} }],
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
                    levels: [{ listType: 'OL', dataset: {}, format: { startNumberOverride: 2 } }],
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
                    levels: [
                        { listType: 'OL', dataset: {}, format: { startNumberOverride: 1 } },
                        { listType: 'UL', dataset: {}, format: {} },
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
                        { listType: 'OL', dataset: {}, format: { startNumberOverride: 1 } },
                        { listType: 'UL', dataset: {}, format: { startNumberOverride: 2 } },
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
