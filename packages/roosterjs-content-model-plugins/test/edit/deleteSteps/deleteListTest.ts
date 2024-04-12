import { ContentModelDocument } from 'roosterjs-content-model-types';
import { deleteList } from '../../../lib/edit/deleteSteps/deleteList';
import { deleteSelection, normalizeContentModel } from 'roosterjs-content-model-dom';

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
                        isSelected: false,
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
                            format: {
                                displayForDummyItem: 'block',
                            },
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                },
            ],
        });

        const result2 = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(result2.deleteResult).toEqual('range');

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

        const result3 = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(result3.deleteResult).toEqual('notDeleted');

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
                        isSelected: false,
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
                        isSelected: false,
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
                        isSelected: false,
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
                        isSelected: false,
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
                                                        marginTop: '0px',
                                                        marginBottom: '0px',
                                                        listStyleType: 'disc',
                                                    },
                                                    dataset: {},
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

        expect(result.deleteResult).toBe('range');
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
                                                        marginTop: '0px',
                                                        marginBottom: '0px',
                                                        listStyleType: 'disc',
                                                        displayForDummyItem: 'block',
                                                    },
                                                    dataset: {},
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

        const result2 = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);

        expect(result2.deleteResult).toBe('range');
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
    });

    it('delete list if the cursor is before text', () => {
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
                                    segmentType: 'Text',
                                    text: 'text',
                                    format: {},
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
                        isSelected: false,
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
                                    segmentType: 'Text',
                                    text: 'text',
                                    format: {},
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
                            format: {
                                displayForDummyItem: 'block',
                            },
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                },
            ],
        });

        const result2 = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(result2.deleteResult).toEqual('range');

        expect(model).toEqual({
            blockGroupType: 'Document',
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
                            text: 'text',
                            format: {},
                        },
                    ],
                    format: {},
                    isImplicit: false,
                },
            ],
        });
    });
});
