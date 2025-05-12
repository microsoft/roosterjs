import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import { queryContentModelBlocks } from '../../../lib/modelApi/common/queryContentModelBlocks';
import {
    ContentModelDocument,
    DomToModelContext,
    EditorContext,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelListItem,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelTable,
} from 'roosterjs-content-model-types';

describe('queryContentModelBlocksBlocks', () => {
    it('should return empty array if no blocks', () => {
        // Arrange
        const group: ReadonlyContentModelBlockGroup = {
            blockGroupType: 'Document',
            blocks: [],
        };

        // Act
        const result = queryContentModelBlocks<ReadonlyContentModelParagraph>(group, 'Paragraph');

        // Assert
        expect(result).toEqual([]);
    });

    it('should return empty array if no blocks match the type', () => {
        // Arrange
        const group: ReadonlyContentModelBlockGroup = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    segmentFormat: {},
                },
            ],
        };

        // Act
        const result = queryContentModelBlocks<ReadonlyContentModelTable>(group, 'Table');

        // Assert
        expect(result).toEqual([]);
    });

    it('should return blocks that match the type', () => {
        // Arrange
        const group: ReadonlyContentModelBlockGroup = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [120, 120],
                    rows: [
                        {
                            height: 22,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
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
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
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
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: 22,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
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
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
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
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        useBorderBox: true,
                        borderCollapse: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                    },
                },
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    segments: [
                        {
                            text: 'Test',
                            segmentType: 'Text',
                            format: {},
                        },
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
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
            ],
            format: {},
        };

        const expected: ReadonlyContentModelTable[] = [
            {
                widths: [120, 120],
                rows: [
                    {
                        height: 22,
                        cells: [
                            {
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blockGroupType: 'TableCell',
                                blocks: [
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
                                ],
                                format: {},
                                dataset: {},
                            },
                            {
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blockGroupType: 'TableCell',
                                blocks: [
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
                                ],
                                format: {},
                                dataset: {},
                            },
                        ],
                        format: {},
                    },
                    {
                        height: 22,
                        cells: [
                            {
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blockGroupType: 'TableCell',
                                blocks: [
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
                                ],
                                format: {},
                                dataset: {},
                            },
                            {
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blockGroupType: 'TableCell',
                                blocks: [
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
                                ],
                                format: {},
                                dataset: {},
                            },
                        ],
                        format: {},
                    },
                ],
                blockType: 'Table',
                format: {
                    useBorderBox: true,
                    borderCollapse: true,
                },
                dataset: {
                    editingInfo:
                        '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                },
            },
        ];

        // Act
        const result = queryContentModelBlocks<ReadonlyContentModelTable>(group, 'Table');

        // Assert
        expect(result).toEqual(expected);
    });

    it('should return blocks that match the type and selector', () => {
        const paragraph: ReadonlyContentModelParagraph = {
            segments: [
                {
                    text: 'Test',
                    segmentType: 'Text',
                    format: {},
                },
                {
                    isSelected: true,
                    segmentType: 'SelectionMarker',
                    format: {},
                },
            ],
            segmentFormat: {},
            blockType: 'Paragraph',
            format: {},
        };

        // Arrange
        const group: ReadonlyContentModelBlockGroup = {
            blockGroupType: 'Document',
            blocks: [
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
                paragraph,
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
            ],
            format: {},
        };

        // Act
        const result = queryContentModelBlocks<ReadonlyContentModelParagraph>(
            group,
            'Paragraph',
            (block): block is ReadonlyContentModelParagraph => block.segments.length == 2
        );

        // Assert
        expect(result).toEqual([paragraph]);
    });

    it('should return all tables that match the type and selector', () => {
        const model: ReadonlyContentModelBlockGroup = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [120, 120],
                    rows: [
                        {
                            height: 22,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
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
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Test',
                                                    segmentType: 'Text',
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: {},
                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        useBorderBox: true,
                        borderCollapse: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                    },
                },
                {
                    isImplicit: false,
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: '#000000',
                            },
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: '#000000',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    segments: [
                        {
                            text: 'not table',
                            segmentType: 'Text',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: '#000000',
                            },
                        },
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: '#000000',
                            },
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: '#000000',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: '#000000',
                            },
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: '#000000',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    widths: [120],
                    rows: [
                        {
                            height: 22,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'table 2',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri',
                                                        fontSize: '11pt',
                                                        textColor: '#000000',
                                                    },
                                                },
                                            ],
                                            segmentFormat: {
                                                fontFamily: 'Calibri',
                                                fontSize: '11pt',
                                                textColor: '#000000',
                                            },
                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],
                                    format: {
                                        useBorderBox: true,
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        verticalAlign: 'top',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        borderCollapse: true,
                        useBorderBox: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                    },
                },
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: '#000000',
                            },
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: '#000000',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };

        const expected: ReadonlyContentModelTable[] = [
            {
                widths: [120, 120],
                rows: [
                    {
                        height: 22,
                        cells: [
                            {
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blockGroupType: 'TableCell',
                                blocks: [
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
                                ],
                                format: {},
                                dataset: {},
                            },
                            {
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        segments: [
                                            {
                                                text: 'Test',
                                                segmentType: 'Text',
                                                format: {},
                                            },
                                        ],
                                        segmentFormat: {},
                                        blockType: 'Paragraph',
                                        format: {},
                                    },
                                ],
                                format: {},
                                dataset: {},
                            },
                        ],
                        format: {},
                    },
                ],
                blockType: 'Table',
                format: {
                    useBorderBox: true,
                    borderCollapse: true,
                },
                dataset: {
                    editingInfo:
                        '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                },
            },
            {
                widths: [120],
                rows: [
                    {
                        height: 22,
                        cells: [
                            {
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        segments: [
                                            {
                                                text: 'table 2',
                                                segmentType: 'Text',
                                                format: {
                                                    fontFamily: 'Calibri',
                                                    fontSize: '11pt',
                                                    textColor: '#000000',
                                                },
                                            },
                                        ],
                                        segmentFormat: {
                                            fontFamily: 'Calibri',
                                            fontSize: '11pt',
                                            textColor: '#000000',
                                        },
                                        blockType: 'Paragraph',
                                        format: {},
                                    },
                                ],
                                format: {
                                    useBorderBox: true,
                                    borderTop: '1px solid #ABABAB',
                                    borderRight: '1px solid #ABABAB',
                                    borderBottom: '1px solid #ABABAB',
                                    borderLeft: '1px solid #ABABAB',
                                    verticalAlign: 'top',
                                },
                                dataset: {},
                            },
                        ],
                        format: {},
                    },
                ],
                blockType: 'Table',
                format: {
                    borderCollapse: true,
                    useBorderBox: true,
                },
                dataset: {
                    editingInfo:
                        '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                },
            },
        ];
        const result = queryContentModelBlocks<ReadonlyContentModelTable>(model, 'Table');
        expect(result).toEqual(expected);
    });

    it('should return all tables in list', () => {
        const table: ReadonlyContentModelTable = {
            widths: [120],
            rows: [
                {
                    height: 22,
                    cells: [
                        {
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            blockGroupType: 'TableCell',
                            blocks: [
                                {
                                    segments: [
                                        {
                                            text: 'table 2',
                                            segmentType: 'Text',
                                            format: {},
                                        },
                                    ],
                                    segmentFormat: {},
                                    blockType: 'Paragraph',
                                    format: {},
                                },
                            ],
                            format: {},
                            dataset: {},
                        },
                    ],
                    format: {},
                },
            ],
            blockType: 'Table',
            format: {
                useBorderBox: true,
                borderCollapse: true,
            },
            dataset: {
                editingInfo:
                    '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
            },
        };

        const model: ReadonlyContentModelBlockGroup = {
            blockGroupType: 'Document',
            blocks: [
                {
                    isImplicit: true,
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
                            listType: 'UL',
                            format: {
                                listStyleType: 'disc',
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
                            isImplicit: true,
                            segments: [
                                {
                                    isSelected: true,
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                        table,
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
            ],
            format: {},
        };

        const expected: ReadonlyContentModelTable[] = [table];
        const result = queryContentModelBlocks<ReadonlyContentModelTable>(model, 'Table');
        expect(result).toEqual(expected);
    });

    it('should return all lists', () => {
        const model: ReadonlyContentModelBlockGroup = {
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
                            listType: 'UL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'disc',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"unorderedStyleType":1}',
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
                                    text: 'table',
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
                            text: 'test',
                            segmentType: 'Text',
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
            ],
            format: {},
        };

        const listExpected: ReadonlyContentModelListItem[] = [
            {
                formatHolder: {
                    isSelected: false,
                    segmentType: 'SelectionMarker',
                    format: {},
                },
                levels: [
                    {
                        listType: 'UL',
                        format: {
                            startNumberOverride: 1,
                            listStyleType: 'disc',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":false,"unorderedStyleType":1}',
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
                                text: 'table',
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
                            startNumberOverride: 1,
                            listStyleType: 'decimal',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
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
                            editingInfo: '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
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
        ];

        const result = queryContentModelBlocks<ReadonlyContentModelListItem>(
            model,
            'BlockGroup',
            (block): block is ReadonlyContentModelListItem => block.blockGroupType == 'ListItem'
        );
        expect(result).toEqual(listExpected);
    });

    it('should return image from a word online table', () => {
        const model: ReadonlyContentModelBlockGroup = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [],
                    rows: [
                        {
                            height: 0,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            tagName: 'div',
                                            blockType: 'BlockGroup',
                                            format: {
                                                textAlign: 'start',
                                                marginLeft: '0px',
                                                marginRight: '0px',
                                                marginTop: '0px',
                                                marginBottom: '0px',
                                                paddingRight: '7px',
                                                paddingLeft: '7px',
                                            },
                                            blockGroupType: 'FormatContainer',
                                            blocks: [
                                                {
                                                    segments: [
                                                        {
                                                            text: ' ',
                                                            segmentType: 'Text',
                                                            format: {
                                                                fontFamily:
                                                                    'Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif',
                                                                fontSize: '12pt',
                                                                textColor: 'rgb(0, 0, 0)',
                                                                italic: false,
                                                                fontWeight: 'normal',
                                                                lineHeight: '18px',
                                                            },
                                                        },
                                                    ],
                                                    segmentFormat: {
                                                        italic: false,
                                                        fontWeight: 'normal',
                                                        textColor: 'rgb(0, 0, 0)',
                                                    },
                                                    blockType: 'Paragraph',
                                                    format: {
                                                        textAlign: 'start',
                                                        direction: 'ltr',
                                                        marginLeft: '0px',
                                                        marginRight: '0px',
                                                        textIndent: '0px',
                                                        whiteSpace: 'pre-wrap',
                                                        marginTop: '0px',
                                                        marginBottom: '0px',
                                                    },
                                                    decorator: {
                                                        tagName: 'p',
                                                        format: {},
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid',
                                        borderRight: '1px solid',
                                        borderBottom: '1px solid',
                                        borderLeft: '1px solid',
                                        verticalAlign: 'top',
                                        width: '312px',
                                    },
                                    dataset: {
                                        celllook: '0',
                                    },
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            tagName: 'div',
                                            blockType: 'BlockGroup',
                                            format: {
                                                textAlign: 'start',
                                                marginLeft: '0px',
                                                marginRight: '0px',
                                                marginTop: '0px',
                                                marginBottom: '0px',
                                                paddingRight: '7px',
                                                paddingLeft: '7px',
                                            },
                                            blockGroupType: 'FormatContainer',
                                            blocks: [
                                                {
                                                    segments: [
                                                        {
                                                            text: ' ',
                                                            segmentType: 'Text',
                                                            format: {
                                                                fontFamily:
                                                                    'Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif',
                                                                fontSize: '12pt',
                                                                textColor: 'rgb(0, 0, 0)',
                                                                italic: false,
                                                                fontWeight: 'normal',
                                                                lineHeight: '18px',
                                                            },
                                                        },
                                                        {
                                                            src:
                                                                'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDB...',
                                                            isSelectedAsImageSelection: true,
                                                            segmentType: 'Image',
                                                            isSelected: true,
                                                            format: {
                                                                fontFamily:
                                                                    'Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif',
                                                                fontSize: '12pt',
                                                                textColor: 'rgb(0, 0, 0)',
                                                                italic: false,
                                                                fontWeight: 'normal',
                                                                lineHeight: '18px',
                                                                backgroundColor: '',
                                                                maxWidth: '1492px',
                                                                id: 'image_0',
                                                            },
                                                            dataset: {
                                                                isEditing: 'true',
                                                            },
                                                        },
                                                    ],
                                                    segmentFormat: {
                                                        italic: false,
                                                        fontWeight: 'normal',
                                                        textColor: 'rgb(0, 0, 0)',
                                                    },
                                                    blockType: 'Paragraph',
                                                    format: {
                                                        textAlign: 'start',
                                                        direction: 'ltr',
                                                        marginLeft: '0px',
                                                        marginRight: '0px',
                                                        textIndent: '0px',
                                                        whiteSpace: 'pre-wrap',
                                                        marginTop: '0px',
                                                        marginBottom: '0px',
                                                    },
                                                    decorator: {
                                                        tagName: 'p',
                                                        format: {},
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid',
                                        borderRight: '1px solid',
                                        borderBottom: '1px solid',
                                        borderLeft: '1px solid',
                                        verticalAlign: 'top',
                                        width: '312px',
                                    },
                                    dataset: {
                                        celllook: '0',
                                    },
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        textAlign: 'start',
                        marginTop: '0px',
                        marginRight: '0px',
                        marginBottom: '0px',
                        marginLeft: '0px',
                        width: '0px',
                        tableLayout: 'fixed',
                        borderCollapse: true,
                    },
                    dataset: {
                        tablelook: '1696',
                        tablestyle: 'MsoTableGrid',
                    },
                },
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };
        const imageAndParagraph: ReadonlyContentModelParagraph = {
            segments: [
                {
                    text: ' ',
                    segmentType: 'Text',
                    format: {
                        fontFamily: 'Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif',
                        fontSize: '12pt',
                        textColor: 'rgb(0, 0, 0)',
                        italic: false,
                        fontWeight: 'normal',
                        lineHeight: '18px',
                    },
                },
                {
                    src:
                        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDB...',
                    isSelectedAsImageSelection: true,
                    segmentType: 'Image',
                    isSelected: true,
                    format: {
                        fontFamily: 'Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif',
                        fontSize: '12pt',
                        textColor: 'rgb(0, 0, 0)',
                        italic: false,
                        fontWeight: 'normal',
                        lineHeight: '18px',
                        backgroundColor: '',
                        maxWidth: '1492px',
                        id: 'image_0',
                    },
                    dataset: {
                        isEditing: 'true',
                    },
                },
            ],
            segmentFormat: {
                italic: false,
                fontWeight: 'normal',
                textColor: 'rgb(0, 0, 0)',
            },
            blockType: 'Paragraph',
            format: {
                textAlign: 'start',
                direction: 'ltr',
                marginLeft: '0px',
                marginRight: '0px',
                textIndent: '0px',
                whiteSpace: 'pre-wrap',
                marginTop: '0px',
                marginBottom: '0px',
            },
            decorator: {
                tagName: 'p',
                format: {},
            },
        };
        const result = queryContentModelBlocks<ReadonlyContentModelParagraph>(
            model,
            'Paragraph',
            (block: ReadonlyContentModelParagraph): block is ReadonlyContentModelParagraph => {
                for (const segment of block.segments) {
                    if (segment.segmentType == 'Image' && segment.dataset.isEditing) {
                        return true;
                    }
                }
                return false;
            },
            true /* findFirstOnly */
        );
        expect(result).toEqual([imageAndParagraph]);
    });

    it('should return empty array if no blocks match the type', () => {
        // Arrange
        const fakeWrapper = ('wrapper' as unknown) as HTMLElement;
        const fakeEditorContext = ('editorContext' as unknown) as EditorContext;
        const fakeDomToModelContext = ('domToModelContext' as unknown) as DomToModelContext;

        const insideEntity: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: { backgroundColor: 'green' },
                    segmentFormat: {},
                },
            ],
            format: {},
        };
        const createDomToModelContextSpy = spyOn(
            createDomToModelContext,
            'createDomToModelContext'
        ).and.returnValue(fakeDomToModelContext);
        const domToContentModelSpy = spyOn(domToContentModel, 'domToContentModel').and.returnValue(
            insideEntity
        );

        const group: ReadonlyContentModelBlockGroup = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: { backgroundColor: 'red' },
                    segmentFormat: {},
                },
                {
                    blockType: 'Entity',
                    wrapper: fakeWrapper,
                    entityFormat: {
                        id: '',
                        entityType: '',
                        isReadonly: true,
                        isFakeEntity: true,
                    },
                    format: {},
                    segmentType: 'Entity',
                },
            ],
        };

        // Act
        const result = queryContentModelBlocks<ReadonlyContentModelParagraph>(
            group,
            'Paragraph',
            undefined /* filter */,
            undefined /* findFirstOnly */,
            entity => fakeEditorContext
        );

        // Assert
        expect(createDomToModelContextSpy).toHaveBeenCalledWith(fakeEditorContext);
        expect(domToContentModelSpy).toHaveBeenCalledWith(fakeWrapper, fakeDomToModelContext);
        expect(result).toEqual([
            // group (Document) > blocks[0] (Paragraph)
            {
                blockType: 'Paragraph',
                segments: [],
                format: { backgroundColor: 'red' },
                segmentFormat: {},
            },
            // group (Document) > blocks[1] (Entity) > insideEntity (FormatContainer) > blocks[0] (Paragraph)
            {
                blockType: 'Paragraph',
                segments: [],
                format: { backgroundColor: 'green' },
                segmentFormat: {},
            },
        ]);
    });
});
