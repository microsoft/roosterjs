import { ContentModelDocument } from 'roosterjs-content-model-types';
import { deleteList } from '../../../lib/edit/deleteSteps/deleteList';
import { deleteSelection } from 'roosterjs-content-model-core';
import { normalizeContentModel } from 'roosterjs-content-model-dom';

describe('deleteList', () => {
    it('deletes the list item when there is only one list item', () => {
        const model: ContentModelDocument = {
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
                        isSelected: true,
                        format: {},
                    },
                },
            ],
        };
        const result = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(result.deleteResult).toEqual('range');

        expect(model).toEqual({
            blockGroupType: 'Document',
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
                    isImplicit: false,
                },
            ],
        });
    });

    it('do not delete list with text', () => {
        const model: ContentModelDocument = {
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
                                    segmentType: 'Text',
                                    text: 'text',
                                    format: {},
                                },
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
                        isSelected: true,
                        format: {},
                    },
                },
            ],
        };
        const result = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(model).toEqual({
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
                                    segmentType: 'Text',
                                    text: 'text',
                                    format: {},
                                },
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
                        isSelected: true,
                        format: {},
                    },
                },
            ],
        });
        expect(result.deleteResult).toEqual('notDeleted');
    });

    it('do not delete list with table', () => {
        const model: ContentModelDocument = {
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
                            blockType: 'Table',
                            rows: [
                                {
                                    height: 22,
                                    format: {},
                                    cells: [
                                        {
                                            blockGroupType: 'TableCell',
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
                                                    segmentFormat: {},
                                                },
                                            ],
                                            format: {},
                                            spanLeft: false,
                                            spanAbove: false,
                                            isHeader: false,
                                            dataset: {},
                                        },
                                    ],
                                },
                            ],
                            format: {
                                borderCollapse: true,
                                useBorderBox: true,
                            },
                            widths: [120],
                            dataset: {
                                editingInfo:
                                    '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                            },
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
                        isSelected: true,
                        format: {},
                    },
                },
            ],
        };
        const result = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(model).toEqual({
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
                            blockType: 'Table',
                            rows: [
                                {
                                    height: 22,
                                    format: {},
                                    cells: [
                                        {
                                            blockGroupType: 'TableCell',
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
                                                    segmentFormat: {},
                                                },
                                            ],
                                            format: {},
                                            spanLeft: false,
                                            spanAbove: false,
                                            isHeader: false,
                                            dataset: {},
                                        },
                                    ],
                                },
                            ],
                            format: {
                                borderCollapse: true,
                                useBorderBox: true,
                            },
                            widths: [120],
                            dataset: {
                                editingInfo:
                                    '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                            },
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
                        isSelected: true,
                        format: {},
                    },
                },
            ],
        });
        expect(result.deleteResult).toEqual('notDeleted');
    });

    it('delete list inside with table cell', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
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
                                                            format: {},
                                                        },
                                                        {
                                                            segmentType: 'Br',
                                                            format: {},
                                                        },
                                                    ],
                                                    format: {},
                                                    isImplicit: false,
                                                },
                                            ],
                                            levels: [
                                                {
                                                    listType: 'UL',
                                                    format: {
                                                        marginBlockStart: '0px',
                                                        marginBlockEnd: '0px',
                                                        listStyleType: 'disc',
                                                    },
                                                    dataset: {},
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
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {
                        useBorderBox: true,
                        borderCollapse: true,
                    },
                    widths: [120],
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                    },
                },
            ],
            format: {},
        };
        const result = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
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
                                            isImplicit: false,
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {
                        useBorderBox: true,
                        borderCollapse: true,
                    },
                    widths: [120],
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                    },
                },
            ],
            format: {},
        });
        expect(result.deleteResult).toEqual('range');
    });
});
