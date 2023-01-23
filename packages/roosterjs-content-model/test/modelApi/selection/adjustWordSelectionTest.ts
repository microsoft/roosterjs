import { adjustWordSelection } from '../../../lib/modelApi/selection/adjustWordSelection';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';

const defaultMarker: ContentModelSegment = {
    segmentType: 'SelectionMarker',
    format: {},
    isSelected: true,
};

describe('adjustWordSelection', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelSegment[],
        modelResult: ContentModelDocument
    ) {
        const adjustedResult = adjustWordSelection(model, defaultMarker);
        expect(adjustedResult).toEqual(result);
        expect(model).toEqual(modelResult);
        expect(adjustedResult).toContain(defaultMarker);
    }

    it('Adjust No Words', () => {
        //'|'
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [defaultMarker],
                },
            ],
        };
        runTest(model, [defaultMarker], model);
    });

    it('Adjust Spaces', () => {
        //'    |    '
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '    ',
                            format: {},
                        },
                        defaultMarker,
                        {
                            segmentType: 'Text',
                            text: '    ',
                            format: {},
                        },
                    ],
                },
            ],
        };
        runTest(model, [defaultMarker], model);
    });

    it('Adjust Single Word - Before', () => {
        //'|Word'
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        defaultMarker,
                        {
                            segmentType: 'Text',
                            text: 'Word',
                            format: {},
                        },
                    ],
                },
            ],
        };
        runTest(model, [defaultMarker], model);
    });

    it('Adjust Single Word - Middle', () => {
        //'Wo|rd'
        const result: ContentModelSegment[] = [
            {
                segmentType: 'Text',
                text: 'Wo',
                format: {},
            },
            defaultMarker,
            {
                segmentType: 'Text',
                text: 'rd',
                format: {},
            },
        ];
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: result,
                    },
                ],
            },
            result,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: result,
                    },
                ],
            }
        );
    });

    it('Adjust Single Word - After', () => {
        //'Word|'
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Word',
                            format: {},
                        },
                        defaultMarker,
                    ],
                },
            ],
        };
        runTest(model, [defaultMarker], model);
    });

    it('Adjust Multiple Words', () => {
        //'Subject Ve|rb Object'
        const result: ContentModelSegment[] = [
            {
                segmentType: 'Text',
                text: 'Ve',
                format: {},
            },
            defaultMarker,
            {
                segmentType: 'Text',
                text: 'rb',
                format: {},
            },
        ];
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
                                text: 'Subject Ve',
                                format: {},
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'rb Object',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            result,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Subject ',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'Ve',
                                format: {},
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'rb',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: ' Object',
                                format: {},
                            },
                        ],
                    },
                ],
            }
        );
    });

    it('Adjust Multiple Formatted Words', () => {
        //'Subject Ve|rb Object'
        // Every letter on Verb has different formats
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
                                text: 'Subject ',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'V',
                                format: { fontFamily: 'V_font' },
                            },
                            {
                                segmentType: 'Text',
                                text: 'e',
                                format: { backgroundColor: 'e_color' },
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'r',
                                format: { textColor: 'r_color' },
                            },
                            {
                                segmentType: 'Text',
                                text: 'b',
                                format: { fontWeight: 'b_weight' },
                            },
                            {
                                segmentType: 'Text',
                                text: ' Object',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            [
                {
                    segmentType: 'Text',
                    text: 'e',
                    format: { backgroundColor: 'e_color' },
                },
                {
                    segmentType: 'Text',
                    text: 'V',
                    format: { fontFamily: 'V_font' },
                },
                defaultMarker,
                {
                    segmentType: 'Text',
                    text: 'r',
                    format: { textColor: 'r_color' },
                },
                {
                    segmentType: 'Text',
                    text: 'b',
                    format: { fontWeight: 'b_weight' },
                },
            ],
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Subject ',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'V',
                                format: { fontFamily: 'V_font' },
                            },
                            {
                                segmentType: 'Text',
                                text: 'e',
                                format: { backgroundColor: 'e_color' },
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'r',
                                format: { textColor: 'r_color' },
                            },
                            {
                                segmentType: 'Text',
                                text: 'b',
                                format: { fontWeight: 'b_weight' },
                            },
                            {
                                segmentType: 'Text',
                                text: ' Object',
                                format: {},
                            },
                        ],
                    },
                ],
            }
        );
    });

    describe('Different blockGroupTypes', () => {
        const result: ContentModelSegment[] = [
            {
                segmentType: 'Text',
                text: 'Wo',
                format: {},
            },
            defaultMarker,
            {
                segmentType: 'Text',
                text: 'rd',
                format: {},
            },
        ];

        it('ListItem', () => {
            //'Wo|rd'
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: result,
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                ],
            };
            runTest(model, result, model);
        });

        it('Table', () => {
            //'Wo|rd'
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        cells: [
                            [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: result,
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        useBorderBox: true,
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        ],
                        format: {
                            useBorderBox: true,
                            borderCollapse: true,
                        },
                        widths: [120],
                        heights: [22],
                        dataset: {
                            editingInfo:
                                '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0}',
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
                ],
            };
            runTest(model, result, model);
        });
    });

    describe('Multiple Blocks', () => {
        const emptyBlock: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
            format: {},
        };
        const result: ContentModelSegment[] = [
            {
                segmentType: 'Text',
                text: 'Wo',
                format: {},
            },
            defaultMarker,
            {
                segmentType: 'Text',
                text: 'rd',
                format: {},
            },
        ];

        it('Second Block', () => {
            //'Wo|rd'
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    emptyBlock,
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: result,
                    },
                    emptyBlock,
                ],
            };
            runTest(model, result, model);
        });
    });
});
