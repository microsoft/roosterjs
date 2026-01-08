import { ContentModelDocument } from 'roosterjs-content-model-types';
import { deleteList } from '../../../lib/edit/deleteSteps/deleteList';
import {
    createContentModelDocument,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createText,
    deleteSelection,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';

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
        });

        const result2 = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(result2.deleteResult).toEqual('notDeleted');

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
                    isImplicit: true,
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

        const result2 = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);

        expect(result2.deleteResult).toBe('notDeleted');
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
        });
    });

    it('Delete list with displayForDummyItem', () => {
        const list = createListItem([createListLevel('UL', { displayForDummyItem: 'block' })]);
        const paragraph = createParagraph();
        const SelectionMarker = createSelectionMarker();
        const model = createContentModelDocument();

        paragraph.segments.push(SelectionMarker);
        list.blocks.push(paragraph);
        model.blocks.push(list);

        const result = deleteSelection(model, [deleteList]);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {},
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
                            ],
                        },
                    ],
                    levels: [],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                },
            ],
        });
        expect(result.deleteResult).toBe('range');
    });

    it('Delete at beginning of list item with list item format', () => {
        const list = createListItem([createListLevel('UL'), createListLevel('OL')], {
            textColor: 'red',
        });
        const paragraph = createParagraph();
        const SelectionMarker = createSelectionMarker();
        const model = createContentModelDocument();

        paragraph.segments.push(SelectionMarker);
        list.blocks.push(paragraph);
        model.blocks.push(list);

        const result = deleteSelection(model, [deleteList]);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {
                            textColor: 'red',
                        },
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
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {
                            textColor: 'red',
                        },
                    },
                    format: {},
                },
            ],
        });
        expect(result.deleteResult).toBe('range');
    });

    it('Delete at beginning of list item with previous list item', () => {
        const list1 = createListItem([createListLevel('UL')]);
        const paragraph1 = createParagraph();
        const list2 = createListItem([createListLevel('UL')]);
        const paragraph2 = createParagraph();
        const SelectionMarker = createSelectionMarker();
        const model = createContentModelDocument();

        paragraph2.segments.push(SelectionMarker);
        list1.blocks.push(paragraph1);
        list2.blocks.push(paragraph2);
        model.blocks.push(list1, list2);

        const result = deleteSelection(model, [deleteList]);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [],
                        },
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
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
        expect(result.deleteResult).toBe('range');
    });

    it('Delete at beginning of list item with previous list item with different levels', () => {
        const list1 = createListItem([createListLevel('UL'), createListLevel('OL')]);
        const paragraph1 = createParagraph();
        const list2 = createListItem([createListLevel('UL')]);
        const paragraph2 = createParagraph();
        const SelectionMarker = createSelectionMarker();
        const model = createContentModelDocument();

        paragraph2.segments.push(SelectionMarker);
        list1.blocks.push(paragraph1);
        list2.blocks.push(paragraph2);
        model.blocks.push(list1, list2);

        const result = deleteSelection(model, [deleteList]);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
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
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(result.deleteResult).toBe('range');
    });

    it('Delete at beginning of a paragraph in middle of list item', () => {
        const list1 = createListItem([createListLevel('UL')]);
        const paragraph1 = createParagraph();
        const paragraph2 = createParagraph();
        const paragraph3 = createParagraph();
        const SelectionMarker = createSelectionMarker();
        const model = createContentModelDocument();

        paragraph2.segments.push(SelectionMarker);
        list1.blocks.push(paragraph1, paragraph2, paragraph3);
        model.blocks.push(list1);

        const result = deleteSelection(model, [deleteList]);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                },
            ],
        });
        expect(result.deleteResult).toBe('range');
    });

    it('Delete at beginning of a paragraph in middle of list item with multiple levels', () => {
        const list1 = createListItem([createListLevel('UL'), createListLevel('OL')]);
        const paragraph1 = createParagraph();
        const paragraph2 = createParagraph();
        const paragraph3 = createParagraph();
        const SelectionMarker = createSelectionMarker();
        const model = createContentModelDocument();

        paragraph2.segments.push(SelectionMarker);
        list1.blocks.push(paragraph1, paragraph2, paragraph3);
        model.blocks.push(list1);

        const result = deleteSelection(model, [deleteList]);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
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
                            ],
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
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
        });
        expect(result.deleteResult).toBe('range');
    });

    it('Delete under a list in middle of a paragraph', () => {
        const list1 = createListItem([createListLevel('UL')]);
        const paragraph1 = createParagraph();
        const SelectionMarker = createSelectionMarker();
        const model = createContentModelDocument();

        paragraph1.segments.push(createText('text1'), SelectionMarker, createText('text2'));
        list1.blocks.push(paragraph1);
        model.blocks.push(list1);

        const result = deleteSelection(model, [deleteList]);

        expect(model).toEqual({
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
                                    text: 'text1',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'text2',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
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
        });
        expect(result.deleteResult).toBe('notDeleted');
    });
});
