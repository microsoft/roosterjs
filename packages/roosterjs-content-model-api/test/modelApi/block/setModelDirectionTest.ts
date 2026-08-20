import * as splitSelectedParagraphByBrModule from '../../../lib/modelApi/block/splitSelectedParagraphByBr';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { setModelDirection } from '../../../lib/modelApi/block/setModelDirection';

describe('setModelDirection', () => {
    const width = '3px';
    const style = 'double';
    const color = '#AABBCC';
    const testBorderString = `${width} ${style} ${color}`;
    const mockedCachedElement = 'CACHE' as any;
    let splitSelectedParagraphByBrSpy: jasmine.Spy;

    function runTest(
        model: ContentModelDocument,
        direction: 'ltr' | 'rtl',
        expectedModel: ContentModelDocument,
        expectedResult: boolean,
        tableTest?: boolean
    ) {
        const result = setModelDirection(model, direction);

        expect(result).toBe(expectedResult);

        if (tableTest && model.blocks[0].blockType == 'Table') {
            model.blocks[0].dataset = {};
        }
        expect(model).toEqual(expectedModel);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(model);
    }

    beforeEach(() => {
        splitSelectedParagraphByBrSpy = spyOn(
            splitSelectedParagraphByBrModule,
            'splitSelectedParagraphByBr'
        );
    });

    function runAutoDirectionTest(
        textSegments: string[],
        currentDirection: 'ltr' | 'rtl' | undefined,
        expectedDirection: 'ltr' | 'rtl'
    ) {
        const paragraph = {
            blockType: 'Paragraph' as const,
            format: currentDirection ? { direction: currentDirection } : {},
            segments: [
                ...textSegments.map(text => ({
                    segmentType: 'Text' as const,
                    text,
                    format: {},
                })),
                {
                    segmentType: 'SelectionMarker' as const,
                    format: {},
                    isSelected: true,
                },
            ],
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paragraph],
        };

        setModelDirection(model, 'auto');

        expect(model.blocks[0].format.direction).toBe(expectedDirection);

        return { model, paragraph };
    }

    it('uses RTL when the first strong character is RTL', () => {
        runAutoDirectionTest(['א', 'English text'], undefined, 'rtl');
    });

    it('uses LTR when the first strong character is LTR', () => {
        runAutoDirectionTest(['A', 'טקסט בעברית'], 'rtl', 'ltr');
    });

    it('ignores numbers and punctuation before the first strong character', () => {
        runAutoDirectionTest(['123 !? ', 'مرحبا'], undefined, 'rtl');
    });

    it('does not treat LTR supplementary-plane letters as RTL', () => {
        runAutoDirectionTest(['𐠀 עברית'], undefined, 'ltr');
    });

    it('does not update the direction when it already matches', () => {
        const { model, paragraph } = runAutoDirectionTest(['עברית', ' English'], 'rtl', 'rtl');

        expect(model.blocks[0]).toBe(paragraph);
    });

    it('uses the first strong character in a list item', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: false,
                    },
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'עברית',
                                    format: {},
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
            ],
        };

        setModelDirection(model, 'auto');

        const listItem = model.blocks[0];

        expect(listItem.blockType).toBe('BlockGroup');
        if (listItem.blockType === 'BlockGroup' && listItem.blockGroupType === 'ListItem') {
            expect(listItem.levels[0].format.direction).toBe('rtl');
            expect(listItem.blocks[0].format.direction).toBe('rtl');
        }
    });

    it('set direction for paragraph', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '10px',
                            paddingRight: '20px',
                        },
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        cachedElement: mockedCachedElement,
                    },
                ],
            },
            'rtl',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            direction: 'rtl',
                            marginRight: '10px',
                            paddingLeft: '20px',
                        },
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            true
        );
    });

    it('set direction for divider', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Divider',
                        format: {},
                        isSelected: true,
                        tagName: 'hr',
                        cachedElement: mockedCachedElement,
                    },
                ],
            },
            'rtl',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Divider',
                        format: {
                            direction: 'rtl',
                        },
                        isSelected: true,
                        tagName: 'hr',
                    },
                ],
            },
            true
        );
    });

    it('set direction for list item', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {
                            textAlign: 'start',
                            direction: 'ltr',
                        },
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: false,
                        },
                        levels: [
                            {
                                listType: 'OL',
                                dataset: {},
                                format: {},
                            },
                        ],
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [],
                                format: {},
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [],
                                format: {},
                            },
                        ],
                        cachedElement: mockedCachedElement,
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: false,
                        },
                        levels: [
                            {
                                listType: 'OL',
                                dataset: {},
                                format: {},
                            },
                        ],
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        format: {},
                                        isSelected: true,
                                    },
                                ],
                                format: {},
                            },
                        ],
                        cachedElement: mockedCachedElement,
                    },
                ],
            },
            'rtl',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: false,
                        },
                        levels: [
                            {
                                listType: 'OL',
                                dataset: {},
                                format: {
                                    direction: 'rtl',
                                },
                            },
                        ],
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [],
                                format: { direction: 'rtl' },
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [],
                                format: { direction: 'rtl' },
                            },
                        ],
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: false,
                        },
                        levels: [
                            {
                                listType: 'OL',
                                dataset: {},
                                format: {
                                    direction: 'rtl',
                                },
                            },
                        ],
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        format: {},
                                        isSelected: true,
                                    },
                                ],
                                format: { direction: 'rtl' },
                            },
                        ],
                    },
                ],
            },
            true
        );
    });

    it('flip direction for table - LTR -> RTL', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderRight: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                        cachedElement: mockedCachedElement,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderLeft: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                        cachedElement: mockedCachedElement,
                                    },
                                ],
                                cachedElement: mockedCachedElement,
                            },
                        ],
                        format: {},
                        widths: [],
                        dataset: {},
                        cachedElement: mockedCachedElement,
                    },
                ],
                format: {},
            },
            'rtl',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderLeft: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderRight: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                ],
                            },
                        ],
                        format: {
                            direction: 'rtl',
                        },
                        widths: [],
                        dataset: {},
                    },
                ],
                format: {},
            },
            true,
            true
        );
    });

    it('flip direction for table - RTL -> LTR', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderRight: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                        cachedElement: mockedCachedElement,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderLeft: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                        cachedElement: mockedCachedElement,
                                    },
                                ],
                                cachedElement: mockedCachedElement,
                            },
                        ],
                        format: {
                            direction: 'rtl',
                        },
                        widths: [],
                        dataset: {},
                        cachedElement: mockedCachedElement,
                    },
                ],
                format: {},
            },
            'ltr',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderLeft: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderRight: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                ],
                            },
                        ],
                        format: {
                            direction: 'ltr',
                        },
                        widths: [],
                        dataset: {},
                    },
                ],
                format: {},
            },
            true,
            true
        );
    });
});
