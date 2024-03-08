import * as applyTableFormat from '../../../lib/publicApi/table/applyTableFormat';
import * as normalizeTable from '../../../lib/publicApi/table/normalizeTable';
import { mergeModel } from '../../../lib/publicApi/model/mergeModel';
import {
    ContentModelDocument,
    ContentModelImage,
    ContentModelListItem,
    ContentModelParagraph,
    ContentModelSelectionMarker,
    ContentModelTable,
    ContentModelTableCell,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';
import {
    createBr,
    createContentModelDocument,
    createDivider,
    createEntity,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('mergeModel', () => {
    it('empty to single selection', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        para.segments.push(marker);
        majorModel.blocks.push(para);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });

        const paragraph: ContentModelParagraph = {
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
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });

        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('para to single selection', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        para2.segments.push(text1, text2);
        sourceModel.blocks.push(para2);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });

        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('para to para with text selection, with format', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1', { textColor: 'red' });
        const text2 = createText('test2', { textColor: 'green' });

        const para2 = createParagraph();
        const text3 = createText('test3', { textColor: 'blue' });
        const text4 = createText('test4', { textColor: 'yellow' });

        text2.isSelected = true;

        para1.segments.push(text1, text2);
        para2.segments.push(text3, text4);

        majorModel.blocks.push(para1);
        sourceModel.blocks.push(para2);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {
                textColor: 'green',
            },
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {
                        textColor: 'red',
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'test3',
                    format: {
                        textColor: 'blue',
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'test4',
                    format: {
                        textColor: 'yellow',
                    },
                },
                marker,
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('text to divider', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1', { textColor: 'red' });
        const text2 = createText('test2', { textColor: 'green' });

        const divider1 = createDivider('div');
        divider1.isSelected = true;

        const para2 = createParagraph();
        const text3 = createText('test3', { textColor: 'blue' });
        const text4 = createText('test4', { textColor: 'yellow' });

        text2.isSelected = true;
        text3.isSelected = true;

        para1.segments.push(text1, text2);
        para2.segments.push(text3, text4);

        majorModel.blocks.push(para1);
        majorModel.blocks.push(divider1);
        majorModel.blocks.push(para2);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newPara2 = createParagraph();
        const newText2 = createText('newText2');

        newPara1.segments.push(newText1);
        newPara2.segments.push(newText2);

        sourceModel.blocks.push(newPara1);
        sourceModel.blocks.push(newPara2);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {
                textColor: 'green',
            },
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'newText2',
                    format: {},
                },
                marker,
                {
                    segmentType: 'Text',
                    text: 'test4',
                    format: {
                        textColor: 'yellow',
                    },
                },
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            format: {
                                textColor: 'red',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'newText1',
                            format: {},
                        },
                    ],
                    format: {},
                },
                paragraph,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('text to list', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const list1 = createListItem([createListLevel('OL')]);
        const list2 = createListItem([createListLevel('OL')]);

        const para1 = createParagraph();
        const para2 = createParagraph();
        const text11 = createText('test11');
        const text12 = createText('test12');
        const text21 = createText('test21');
        const text22 = createText('test21');

        para1.segments.push(text11);
        para1.segments.push(text12);
        para2.segments.push(text21);
        para2.segments.push(text22);

        text12.isSelected = true;
        text21.isSelected = true;

        list1.blocks.push(para1);
        list2.blocks.push(para2);

        majorModel.blocks.push(list1);
        majorModel.blocks.push(list2);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newPara2 = createParagraph();
        const newText2 = createText('newText2');
        const newPara3 = createParagraph();
        const newText3 = createText('newText3');

        newPara1.segments.push(newText1);
        newPara2.segments.push(newText2);
        newPara3.segments.push(newText3);

        sourceModel.blocks.push(newPara1);
        sourceModel.blocks.push(newPara2);
        sourceModel.blocks.push(newPara3);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'newText3',
                    format: {},
                },
                marker,
                {
                    segmentType: 'Text',
                    text: 'test21',
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [paragraph],
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
            format: {},
        };

        expect(majorModel).toEqual({
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
                                    text: 'test11',
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'newText1',
                                    format: {},
                                },
                            ],
                            format: {},
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
                                    text: 'newText2',
                                    format: {},
                                },
                            ],
                            format: {},
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
                    format: {},
                },
                listItem,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [listItem, majorModel],
            tableContext: undefined,
        });
    });

    it('list to text', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1');

        para1.segments.push(text1);

        text1.isSelected = true;

        majorModel.blocks.push(para1);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newPara2 = createParagraph();
        const newText2 = createText('newText2');
        const newPara3 = createParagraph();
        const newText3 = createText('newText3');
        const newList1 = createListItem([createListLevel('OL')]);
        const newList2 = createListItem([createListLevel('OL')]);

        newPara1.segments.push(newText1);
        newPara2.segments.push(newText2);
        newPara3.segments.push(newText3);

        newList1.blocks.push(newPara1);
        newList2.blocks.push(newPara2);
        newList2.blocks.push(newPara3);

        sourceModel.blocks.push(newList1);
        sourceModel.blocks.push(newList2);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                marker,
                {
                    segmentType: 'Br',
                    format: {},
                },
            ],
            format: {},
        };

        expect(majorModel).toEqual({
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
                                    text: 'newText1',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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
                                    text: 'newText2',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'newText3',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
                paragraph,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('list to list', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text11 = createText('test11');
        const text12 = createText('test12');
        const para2 = createParagraph();
        const text21 = createText('test21');
        const text22 = createText('test22');
        const list1 = createListItem([
            createListLevel(
                'OL',
                {},
                { editingInfo: JSON.stringify({ startNumberOverride: 1, unorderedStyleType: 2 }) }
            ),
        ]);
        const list2 = createListItem([
            createListLevel(
                'OL',
                {},
                { editingInfo: JSON.stringify({ startNumberOverride: 1, unorderedStyleType: 2 }) }
            ),
        ]);

        para1.segments.push(text11);
        para1.segments.push(text12);
        para2.segments.push(text21);
        para2.segments.push(text22);
        list1.blocks.push(para1);
        list2.blocks.push(para2);

        text12.isSelected = true;
        text21.isSelected = true;

        majorModel.blocks.push(list1);
        majorModel.blocks.push(list2);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newPara2 = createParagraph();
        const newText2 = createText('newText2');
        const newList1 = createListItem([
            createListLevel(
                'UL',
                {},
                { editingInfo: JSON.stringify({ startNumberOverride: 3, unorderedStyleType: 4 }) }
            ),
        ]);
        const newList2 = createListItem([
            createListLevel(
                'UL',
                {},
                { editingInfo: JSON.stringify({ startNumberOverride: 3, unorderedStyleType: 4 }) }
            ),
            createListLevel(
                'UL',
                {},
                { editingInfo: JSON.stringify({ startNumberOverride: 5, unorderedStyleType: 6 }) }
            ),
        ]);

        newPara1.segments.push(newText1);
        newPara2.segments.push(newText2);

        newList1.blocks.push(newPara1);
        newList2.blocks.push(newPara2);

        sourceModel.blocks.push(newList1);
        sourceModel.blocks.push(newList2);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });

        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                marker,
                {
                    segmentType: 'Text',
                    text: 'test22',
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [paragraph],
            levels: [
                {
                    listType: 'OL',
                    dataset: {
                        editingInfo: JSON.stringify({
                            startNumberOverride: 1,
                            unorderedStyleType: 2,
                        }),
                    },
                    format: {},
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: {},
            },
            format: {},
        };

        expect(majorModel).toEqual({
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
                                    text: 'test11',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {
                                editingInfo: JSON.stringify({
                                    startNumberOverride: 1,
                                    unorderedStyleType: 2,
                                }),
                            },
                            format: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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
                                    text: 'newText1',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {
                                editingInfo: JSON.stringify({
                                    startNumberOverride: 1,
                                    unorderedStyleType: 2,
                                }),
                            },
                            format: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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
                                    text: 'newText2',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {
                                editingInfo: JSON.stringify({
                                    startNumberOverride: 1,
                                    unorderedStyleType: 2,
                                }),
                            },
                            format: {},
                        },
                        {
                            listType: 'UL',
                            dataset: {
                                editingInfo: JSON.stringify({
                                    startNumberOverride: 5,
                                    unorderedStyleType: 6,
                                }),
                            },
                            format: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
                listItem,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [listItem, majorModel],
            tableContext: undefined,
        });
    });

    it('table to text', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1');

        para1.segments.push(text1);

        text1.isSelected = true;

        majorModel.blocks.push(para1);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newCell1 = createTableCell(false, false);
        const newTable1 = createTable(1);

        newPara1.segments.push(newText1);
        newCell1.blocks.push(newPara1);
        newTable1.rows[0].cells.push(newCell1);

        sourceModel.blocks.push(newTable1);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });

        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                marker,
                {
                    segmentType: 'Br',
                    format: {},
                },
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'newText1',
                                                    format: {},
                                                },
                                            ],
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
                    format: {},
                    widths: [],
                    dataset: {},
                },
                paragraph,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('table to table, no merge table', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1');
        const cell11 = createTableCell();
        const cell12 = createTableCell();
        const cell21 = createTableCell();
        const cell22 = createTableCell();
        const table1 = createTable(2);

        para1.segments.push(text1);
        text1.isSelected = true;
        cell22.blocks.push(para1);
        table1.rows = [
            { format: {}, height: 0, cells: [cell11, cell12] },
            { format: {}, height: 0, cells: [cell21, cell22] },
        ];

        majorModel.blocks.push(table1);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newCell11 = createTableCell();
        const newCell12 = createTableCell();
        const newCell21 = createTableCell();
        const newCell22 = createTableCell();
        const newTable1 = createTable(2);

        newPara1.segments.push(newText1);
        newCell12.blocks.push(newPara1);
        newTable1.rows = [
            { format: {}, height: 0, cells: [newCell11, newCell12] },
            { format: {}, height: 0, cells: [newCell21, newCell22] },
        ];

        sourceModel.blocks.push(newTable1);

        spyOn(applyTableFormat, 'applyTableFormat');
        spyOn(normalizeTable, 'normalizeTable');

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });

        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                marker,
                {
                    segmentType: 'Br',
                    format: {},
                },
            ],
            format: {},
        };
        const tableCell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    widths: [],
                    dataset: {},
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [newCell11, newCell12],
                        },
                        {
                            format: {},
                            height: 0,
                            cells: [newCell21, newCell22],
                        },
                    ],
                },
                paragraph,
            ],
            format: {},
            spanLeft: false,
            spanAbove: false,
            isHeader: false,
            dataset: {},
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            rows: [
                { format: {}, height: 0, cells: [cell11, cell12] },
                {
                    format: {},
                    height: 0,
                    cells: [cell21, tableCell],
                },
            ],
            format: {},
            widths: [],
            dataset: {},
        };

        expect(normalizeTable.normalizeTable).not.toHaveBeenCalled();
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [table],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [tableCell, majorModel],
            tableContext: {
                table,
                rowIndex: 1,
                colIndex: 1,
                isWholeTableSelected: false,
            },
        });
    });

    it('table to table, merge table 1', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1');
        const cell01 = createTableCell(false, false, false, { backgroundColor: '01' });
        const cell02 = createTableCell(false, false, false, { backgroundColor: '02' });
        const cell11 = createTableCell(false, false, false, { backgroundColor: '11' });
        const cell12 = createTableCell(false, false, false, { backgroundColor: '12' });
        const cell21 = createTableCell(false, false, false, { backgroundColor: '21' });
        const cell22 = createTableCell(false, false, false, { backgroundColor: '22' });
        const cell31 = createTableCell(false, false, false, { backgroundColor: '31' });
        const cell32 = createTableCell(false, false, false, { backgroundColor: '32' });
        const table1 = createTable(4);

        para1.segments.push(text1);
        text1.isSelected = true;
        cell12.blocks.push(para1);
        table1.rows = [
            { format: {}, height: 0, cells: [cell01, cell02] },
            { format: {}, height: 0, cells: [cell11, cell12] },
            { format: {}, height: 0, cells: [cell21, cell22] },
            { format: {}, height: 0, cells: [cell31, cell32] },
        ];

        majorModel.blocks.push(table1);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newCell11 = createTableCell(false, false, false, { backgroundColor: 'n11' });
        const newCell12 = createTableCell(false, false, false, { backgroundColor: 'n12' });
        const newCell21 = createTableCell(false, false, false, { backgroundColor: 'n21' });
        const newCell22 = createTableCell(false, false, false, { backgroundColor: 'n22' });
        const newTable1 = createTable(2);

        newPara1.segments.push(newText1);
        newCell12.blocks.push(newPara1);
        newTable1.rows = [
            { format: {}, height: 0, cells: [newCell11, newCell12] },
            { format: {}, height: 0, cells: [newCell21, newCell22] },
        ];

        sourceModel.blocks.push(newTable1);

        spyOn(applyTableFormat, 'applyTableFormat');
        spyOn(normalizeTable, 'normalizeTable');

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeTable: true,
            }
        );

        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker],
            format: {},
            isImplicit: true,
        };
        const tableCell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            blocks: [paragraph],
            format: {
                backgroundColor: 'n11',
            },
            spanLeft: false,
            spanAbove: false,
            isHeader: false,
            dataset: {},
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [
                        cell01,
                        cell02,
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {
                                backgroundColor: '02',
                            },
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            dataset: {},
                        },
                    ],
                },
                {
                    format: {},
                    height: 0,
                    cells: [cell11, tableCell, newCell12],
                },
                { format: {}, height: 0, cells: [cell21, newCell21, newCell22] },
                {
                    format: {},
                    height: 0,
                    cells: [
                        cell31,
                        cell32,
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {
                                backgroundColor: '32',
                            },
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            dataset: {},
                        },
                    ],
                },
            ],
            format: {},
            widths: [],
            dataset: {},
        };

        expect(normalizeTable.normalizeTable).toHaveBeenCalledTimes(1);
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [table],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [tableCell, majorModel],
            tableContext: {
                table,
                rowIndex: 1,
                colIndex: 1,
                isWholeTableSelected: false,
            },
        });
    });

    it('table to table, merge table 2', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1');
        const cell01 = createTableCell(false, false, false, { backgroundColor: '01' });
        const cell02 = createTableCell(false, false, false, { backgroundColor: '02' });
        const cell03 = createTableCell(false, false, false, { backgroundColor: '03' });
        const cell04 = createTableCell(false, false, false, { backgroundColor: '04' });
        const cell11 = createTableCell(false, false, false, { backgroundColor: '11' });
        const cell12 = createTableCell(false, false, false, { backgroundColor: '12' });
        const cell13 = createTableCell(false, false, false, { backgroundColor: '13' });
        const cell14 = createTableCell(false, false, false, { backgroundColor: '14' });
        const table1 = createTable(2);

        para1.segments.push(text1);
        text1.isSelected = true;
        cell12.blocks.push(para1);
        table1.rows = [
            { format: {}, height: 0, cells: [cell01, cell02, cell03, cell04] },
            { format: {}, height: 0, cells: [cell11, cell12, cell13, cell14] },
        ];

        majorModel.blocks.push(table1);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newCell11 = createTableCell(false, false, false, { backgroundColor: 'n11' });
        const newCell12 = createTableCell(false, false, false, { backgroundColor: 'n12' });
        const newCell21 = createTableCell(false, false, false, { backgroundColor: 'n21' });
        const newCell22 = createTableCell(false, false, false, { backgroundColor: 'n22' });
        const newTable1 = createTable(2);

        newPara1.segments.push(newText1);
        newCell12.blocks.push(newPara1);
        newTable1.rows = [
            { format: {}, height: 0, cells: [newCell11, newCell12] },
            { format: {}, height: 0, cells: [newCell21, newCell22] },
        ];

        sourceModel.blocks.push(newTable1);

        spyOn(applyTableFormat, 'applyTableFormat');
        spyOn(normalizeTable, 'normalizeTable');

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeTable: true,
            }
        );
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker],
            format: {},
            isImplicit: true,
        };
        const tableCell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            blocks: [paragraph],
            format: {
                backgroundColor: 'n11',
            },
            spanLeft: false,
            spanAbove: false,
            isHeader: false,
            dataset: {},
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            rows: [
                { format: {}, height: 0, cells: [cell01, cell02, cell03, cell04] },
                {
                    format: {},
                    height: 0,
                    cells: [cell11, tableCell, newCell12, cell14],
                },
                {
                    format: {},
                    height: 0,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {
                                backgroundColor: '11',
                            },
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            dataset: {},
                        },
                        newCell21,
                        newCell22,
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {
                                backgroundColor: '14',
                            },
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            dataset: {},
                        },
                    ],
                },
            ],
            format: {},
            widths: [],
            dataset: {},
        };

        expect(normalizeTable.normalizeTable).toHaveBeenCalledTimes(1);
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [table],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [tableCell, majorModel],
            tableContext: {
                table,
                rowIndex: 1,
                colIndex: 1,
                isWholeTableSelected: false,
            },
        });
    });

    it('table to table, merge table 3', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1');
        const cell01 = createTableCell(false, false, false, { backgroundColor: '01' });
        const cell02 = createTableCell(false, false, false, { backgroundColor: '02' });
        const cell11 = createTableCell(false, false, false, { backgroundColor: '11' });
        const cell12 = createTableCell(false, false, false, { backgroundColor: '12' });
        const table1 = createTable(2);

        para1.segments.push(text1);
        text1.isSelected = true;
        cell12.blocks.push(para1);
        table1.rows = [
            { format: {}, height: 0, cells: [cell01, cell02] },
            { format: {}, height: 0, cells: [cell11, cell12] },
        ];

        majorModel.blocks.push(table1);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newCell11 = createTableCell(false, false, false, { backgroundColor: 'n11' });
        const newCell12 = createTableCell(false, false, false, { backgroundColor: 'n12' });
        const newCell21 = createTableCell(false, false, false, { backgroundColor: 'n21' });
        const newCell22 = createTableCell(false, false, false, { backgroundColor: 'n22' });
        const newTable1 = createTable(2);

        newPara1.segments.push(newText1);
        newCell12.blocks.push(newPara1);
        newTable1.rows = [
            { format: {}, height: 0, cells: [newCell11, newCell12] },
            { format: {}, height: 0, cells: [newCell21, newCell22] },
        ];

        sourceModel.blocks.push(newTable1);

        spyOn(applyTableFormat, 'applyTableFormat');
        spyOn(normalizeTable, 'normalizeTable');

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeTable: true,
            }
        );

        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker],
            format: {},
            isImplicit: true,
        };
        const tableCell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            blocks: [paragraph],
            format: {
                backgroundColor: 'n11',
            },
            spanLeft: false,
            spanAbove: false,
            isHeader: false,
            dataset: {},
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [
                        cell01,
                        cell02,
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {
                                backgroundColor: '02',
                            },
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            dataset: {},
                        },
                    ],
                },
                {
                    format: {},
                    height: 0,
                    cells: [cell11, tableCell, newCell12],
                },
                {
                    format: {},
                    height: 0,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {
                                backgroundColor: '11',
                            },
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            dataset: {},
                        },
                        newCell21,
                        newCell22,
                    ],
                },
            ],
            format: {},
            widths: [],
            dataset: {},
        };
        expect(normalizeTable.normalizeTable).toHaveBeenCalledTimes(1);
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [table],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [tableCell, majorModel],
            tableContext: {
                table,
                rowIndex: 1,
                colIndex: 1,
                isWholeTableSelected: false,
            },
        });
    });

    it('Use customized insert position', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker({ fontSize: '10pt' });
        const marker3 = createSelectionMarker();

        para1.segments.push(marker1, text1, marker2, text2, marker3);
        majorModel.blocks.push(para1);

        const newPara = createParagraph();
        const newText = createText('new text');

        newPara.segments.push(newText);
        sourceModel.blocks.push(newPara);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                insertPosition: {
                    marker: marker2,
                    paragraph: para1,
                    path: [majorModel],
                },
            }
        );

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'new text',
                    format: {},
                },
                marker2,
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(result).toEqual({
            marker: marker2,
            paragraph,
            path: [majorModel],
        });
    });

    it('Merge with default format', () => {
        const MockedFormat = {
            formatName: 'mocked',
        } as any;
        const majorModel = createContentModelDocument(MockedFormat);
        const sourceModel: ContentModelDocument = {
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
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'mergeAll',
            }
        );

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: MockedFormat,
                },
                marker,
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
            format: MockedFormat,
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge with default format', () => {
        const MockedFormat = {
            formatName: 'mocked',
        } as any;
        const majorModel = createContentModelDocument(MockedFormat);
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                formatName: 'ToBeRemoved',
                            } as any,
                        },
                    ],
                    format: {},
                },
            ],
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
            }
        );

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: MockedFormat,
                },
                marker,
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
            format: MockedFormat,
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge with default format, keep the source bold, italic and underline', () => {
        const MockedFormat = {
            formatName: 'mocked',
            fontWeight: 'ToBeRemoved',
            italic: 'ToBeRemoved',
            underline: 'ToBeRemoved',
        } as any;
        const majorModel = createContentModelDocument(MockedFormat);
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                formatName: 'ToBeRemoved',
                                fontWeight: 'sourceFontWeight',
                                italic: true,
                                underline: true,
                            } as any,
                        },
                    ],
                    format: {},
                },
            ],
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
            }
        );

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {
                        formatName: 'mocked',
                        fontWeight: 'sourceFontWeight',
                        italic: true,
                        underline: true,
                    } as any,
                },
                marker,
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
            format: MockedFormat,
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge with keepSourceEmphasisFormat and remove background color of model', () => {
        const MockedFormat = {
            formatName: 'mocked',
        } as any;
        const majorModel = createContentModelDocument(MockedFormat);
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                formatName: 'ToBeRemoved',
                                fontWeight: 'sourceFontWeight',
                                italic: true,
                                underline: true,
                            } as any,
                        },
                    ],
                    format: {
                        backgroundColor: 'ToBeRemoved',
                    },
                },
            ],
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
            }
        );

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {
                        formatName: 'mocked',
                        fontWeight: 'sourceFontWeight',
                        italic: true,
                        underline: true,
                    } as any,
                },
                marker,
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
            format: MockedFormat,
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge model with List Item with default format, keep the source bold, italic and underline', () => {
        const MockedFormat = {
            formatName: 'mocked',
            backgroundColor: 'rgb(0,0,0)',
            color: 'rgb(255,255,255)',
        } as any;
        const majorModel = createContentModelDocument(MockedFormat);
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {},
                    formatHolder: {
                        format: {
                            backgroundColor: 'blue',
                            color: 'red',
                            formatName: 'ToBeRemoved',
                        } as any,
                        isSelected: true,
                        segmentType: 'SelectionMarker',
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
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {
                                        formatName: 'ToBeRemoved',
                                        fontWeight: 'sourceFontWeight',
                                        italic: true,
                                        underline: true,
                                    } as any,
                                },
                            ],
                            format: {},
                        },
                    ],
                },
            ],
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
            }
        );

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker, { segmentType: 'Br', format: {} }],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {},
                    formatHolder: {
                        format: {
                            formatName: 'mocked',
                            backgroundColor: 'rgb(0,0,0)',
                            color: 'rgb(255,255,255)',
                        } as any,
                        isSelected: true,
                        segmentType: 'SelectionMarker',
                    },
                    levels: [{ listType: 'OL', dataset: {}, format: {} }],
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {
                                        formatName: 'mocked',
                                        backgroundColor: 'rgb(0,0,0)',
                                        color: 'rgb(255,255,255)',
                                        fontWeight: 'sourceFontWeight',
                                        italic: true,
                                        underline: true,
                                    } as any,
                                },
                            ],
                            format: {},
                        },
                    ],
                },
                paragraph,
            ],
            format: MockedFormat,
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Divider to single selected paragraph with inline format', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();
        const para1 = createParagraph(false, undefined, { fontFamily: 'Arial' });
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        const divider = createDivider('hr');

        para1.segments.push(text1, marker, text2);
        majorModel.blocks.push(para1);

        sourceModel.blocks.push(divider);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker, { segmentType: 'Text', text: 'test2', format: {} }],
            format: {},
            segmentFormat: { fontFamily: 'Arial' },
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test1', format: {} }],
                    format: {},
                    segmentFormat: { fontFamily: 'Arial' },
                },
                { blockType: 'Divider', tagName: 'hr', format: {} },
                paragraph,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Divider to single selected paragraph both models with block format', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();
        const para1 = createParagraph(false, {
            marginBottom: 'ShouldBeRemoved',
            marginTop: 'ShouldBeRemoved',
            marginLeft: 'ShouldBeRemoved',
            marginRight: 'ShouldBeRemoved',
        });
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        const divider = createParagraph(false, {
            marginBottom: 'KeepThisStyle',
            marginTop: 'KeepThisStyle',
            marginLeft: 'KeepThisStyle',
            marginRight: 'KeepThisStyle',
        });

        para1.segments.push(text1, marker, text2);
        majorModel.blocks.push(para1);

        sourceModel.blocks.push(divider);

        mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'test1', format: {} },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        { segmentType: 'Text', text: 'test2', format: {} },
                    ],
                    format: {
                        marginBottom: 'KeepThisStyle',
                        marginTop: 'KeepThisStyle',
                        marginLeft: 'KeepThisStyle',
                        marginRight: 'KeepThisStyle',
                    },
                },
            ],
        });
    });

    it('Keep Paragraph format of source on merge', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph();
        const text1 = createText('test1', { textColor: 'red' });
        const text2 = createText('test2', { textColor: 'green' });

        const divider1 = createDivider('div');
        divider1.isSelected = true;

        const para2 = createParagraph();
        const text3 = createText('test3', { textColor: 'blue' });
        const text4 = createText('test4', { textColor: 'yellow' });

        text2.isSelected = true;
        text3.isSelected = true;

        para1.segments.push(text1, text2);
        para2.segments.push(text3, text4);
        para2.format = {
            backgroundColor: 'blue',
        };

        majorModel.blocks.push(para1);
        majorModel.blocks.push(divider1);
        majorModel.blocks.push(para2);

        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newPara2 = createParagraph();
        const newText2 = createText('newText2');

        newPara1.segments.push(newText1);
        newPara2.segments.push(newText2);
        newPara2.format = {
            backgroundColor: 'red',
        };

        sourceModel.blocks.push(newPara1);
        sourceModel.blocks.push(newPara2);

        const result = mergeModel(majorModel, sourceModel, {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });

        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {
                textColor: 'green',
            },
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'newText2',
                    format: {},
                },
                marker,
                {
                    segmentType: 'Text',
                    text: 'test4',
                    format: {
                        textColor: 'yellow',
                    },
                },
            ],
            format: {
                backgroundColor: 'red',
            },
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            format: {
                                textColor: 'red',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'newText1',
                            format: {},
                        },
                    ],
                    format: {},
                },
                paragraph,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge with default format paragraph and paragraph with decorator, keepSourceEmphasisFormat', () => {
        const MockedFormat = {
            formatName: 'mocked',
            fontWeight: 'ToBeRemoved',
            italic: 'ToBeRemoved',
            underline: 'ToBeRemoved',
        } as any;
        const majorModel = createContentModelDocument(MockedFormat);
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                formatName: 'ToBeRemoved',
                                fontWeight: 'sourceFontWeight',
                                italic: true,
                                underline: true,
                            } as any,
                        },
                    ],
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: {
                            fontWeight: 'sourceDecoratorFontWeight',
                            fontSize: 'sourceDecoratorFontSize',
                            fontFamily: 'sourceDecoratorFontName',
                        },
                    },
                },
            ],
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
            }
        );

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {
                        formatName: 'mocked',
                        fontWeight: 'sourceFontWeight',
                        italic: true,
                        underline: true,
                    } as any,
                },
                marker,
            ],
            format: {},
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
            format: MockedFormat,
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge with default format paragraph and paragraph with decorator, mergeAll', () => {
        const MockedFormat = {
            fontFamily: 'mocked',
            fontWeight: 'ToBeRemoved',
            italic: 'ToBeRemoved',
            underline: 'ToBeRemoved',
        } as any;
        const majorModel = createContentModelDocument(MockedFormat);
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                fontFamily: 'sourceFontFamily',
                                italic: true,
                                underline: true,
                                fontSize: 'sourcefontSize',
                            },
                        },
                    ],
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: {
                            fontWeight: 'sourceDecoratorFontWeight',
                            fontSize: 'sourceDecoratorFontSize',
                            fontFamily: 'sourceDecoratorFontName',
                        },
                    },
                },
            ],
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'mergeAll',
            }
        );

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {
                        fontWeight: 'sourceDecoratorFontWeight',
                        italic: true,
                        underline: true,
                        fontFamily: 'sourceFontFamily',
                        fontSize: 'sourcefontSize',
                    },
                },
                marker,
            ],
            format: {},
            decorator: {
                tagName: 'h1',
                format: {
                    fontWeight: 'sourceDecoratorFontWeight',
                    fontSize: 'sourceDecoratorFontSize',
                    fontFamily: 'sourceDecoratorFontName',
                },
            },
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
            format: MockedFormat,
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge with default format paragraph and paragraph, mergeFormat: none', () => {
        const MockedFormat = {
            fontFamily: 'sourceSegmentFormatFontFamily',
            italic: true,
            underline: true,
            fontSize: 'sourceSegmentFormatFontSize',
        } as any;
        const majorModel = createContentModelDocument(MockedFormat);
        majorModel.blocks.push({
            blockType: 'Paragraph',
            segmentFormat: MockedFormat,
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {
                        fontFamily: 'sourceFontFamily',
                    } as any,
                },
                createSelectionMarker(),
            ],
            format: {},
        });
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                fontFamily: 'sourceFontFamily',
                                italic: true,
                                underline: true,
                                fontSize: 'sourcefontSize',
                            },
                        },
                    ],
                    format: {},
                },
            ],
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'none',
            }
        );

        const resultMarker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {
                fontFamily: 'sourceSegmentFormatFontFamily',
                italic: true,
                underline: true,
                fontSize: 'sourceSegmentFormatFontSize',
            },
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {
                        fontFamily: 'sourceFontFamily',
                        italic: true,
                        underline: true,
                        fontSize: 'sourceSegmentFormatFontSize',
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {
                        fontFamily: 'sourceFontFamily',
                        italic: true,
                        underline: true,
                        fontSize: 'sourcefontSize',
                    },
                },
                resultMarker,
            ],
            format: {},
            segmentFormat: { fontFamily: 'sourceFontFamily' },
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
            format: MockedFormat,
        });
        expect(result).toEqual({
            marker: resultMarker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge Table + Paragraph', () => {
        const majorModel = createContentModelDocument();
        const sourceModel: ContentModelDocument = {
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
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
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
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
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
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
                                    },
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
                    widths: [120, 120, 120],
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0}',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'black',
                                fontWeight: 'bold',
                            },
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const result = mergeModel(
            majorModel,
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'mergeAll',
            }
        );

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'Test',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'black',
                        fontWeight: 'bold',
                    },
                },
                marker,
            ],
            format: {},
            segmentFormat: { fontFamily: 'Calibri', fontSize: '11pt', textColor: 'black' },
        };

        expect(majorModel).toEqual({
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
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
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
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
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
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
                                    },
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
                    widths: [120, 120, 120],
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0}',
                    },
                },
                paragraph,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge Paragraph with default format and a Heading element', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const para1 = createParagraph(false, undefined, {
            fontFamily: 'Arial',
            fontSize: '15px',
            backgroundColor: 'red',
            textColor: 'blue',
            italic: false,
        });
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker, text2);
        majorModel.blocks.push(para1);

        const heading = createParagraph(false, undefined, undefined, {
            tagName: 'h1',
            format: {
                fontFamily: 'Calibri',
                fontSize: '16pt',
                textColor: 'aliceblue',
                italic: true,
            },
        });
        heading.segments.push(createText('sourceTest1'), createText('sourceTest2'));

        sourceModel.blocks.push(heading);

        const result = mergeModel(majorModel, sourceModel);

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                { segmentType: 'Text', text: 'sourceTest1', format: {} },
                { segmentType: 'Text', text: 'sourceTest2', format: {} },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test2', format: {} },
            ],
            format: {},
            decorator: {
                tagName: 'h1',
                format: {
                    fontFamily: 'Calibri',
                    fontSize: '16pt',
                    textColor: 'aliceblue',
                    italic: true,
                },
            },
            segmentFormat: { backgroundColor: 'red' },
        };
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge Table with styles into paragraph, paragraph after table should not inherit styles from table', () => {
        const majorModel = createContentModelDocument();
        const para1 = createParagraph(false, undefined, {
            fontFamily: 'Arial',
            fontSize: '15px',
            backgroundColor: 'red',
            textColor: 'blue',
            italic: false,
        });
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker, text2);
        majorModel.blocks.push(para1);

        const sourceModel: ContentModelDocument = createContentModelDocument();
        const newPara1 = createParagraph();
        const newText1 = createText('newText1');
        const newCell1 = createTableCell(false, false);
        const newTable1 = createTable(1, {
            textAlign: 'start',
            whiteSpace: 'normal',
            borderTop: '1px solid black',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            borderLeft: '1px solid black',
            backgroundColor: 'rgb(255, 255, 255)',
            useBorderBox: true,
            borderCollapse: true,
        });

        newPara1.segments.push(newText1);
        newCell1.blocks.push(newPara1);
        newTable1.rows[0].cells.push(newCell1);
        sourceModel.blocks.push(newTable1);

        const result = mergeModel(majorModel, sourceModel);

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test2', format: {} },
            ],
            format: {},
            segmentFormat: {
                fontFamily: 'Arial',
                fontSize: '15px',
                backgroundColor: 'red',
                textColor: 'blue',
                italic: false,
            },
        };
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test1', format: {} }],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Arial',
                        fontSize: '15px',
                        backgroundColor: 'red',
                        textColor: 'blue',
                        italic: false,
                    },
                },
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'newText1',
                                                    format: {},
                                                },
                                            ],
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
                        textAlign: 'start',
                        whiteSpace: 'normal',
                        borderTop: '1px solid black',
                        borderRight: '1px solid black',
                        borderBottom: '1px solid black',
                        borderLeft: '1px solid black',
                        backgroundColor: 'rgb(255, 255, 255)',
                        useBorderBox: true,
                        borderCollapse: true,
                    },
                    widths: [],
                    dataset: {},
                },
                paragraph,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge Divider with styles into paragraph, paragraph after table should not inherit styles from Divider', () => {
        const majorModel = createContentModelDocument();
        const para1 = createParagraph(false, undefined, {
            fontFamily: 'Arial',
            fontSize: '15px',
            backgroundColor: 'red',
            textColor: 'blue',
            italic: false,
        });
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker, text2);
        majorModel.blocks.push(para1);

        const sourceModel: ContentModelDocument = createContentModelDocument();
        const newDiv = createDivider('div', {
            textAlign: 'start',
            whiteSpace: 'normal',
            borderTop: '1px solid black',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            borderLeft: '1px solid black',
            backgroundColor: 'rgb(255, 255, 255)',
        });

        sourceModel.blocks.push(newDiv);
        const result = mergeModel(majorModel, sourceModel);

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test2', format: {} },
            ],
            format: {},
            segmentFormat: {
                fontFamily: 'Arial',
                fontSize: '15px',
                backgroundColor: 'red',
                textColor: 'blue',
                italic: false,
            },
        };
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test1', format: {} }],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Arial',
                        fontSize: '15px',
                        backgroundColor: 'red',
                        textColor: 'blue',
                        italic: false,
                    },
                },
                {
                    blockType: 'Divider',
                    tagName: 'div',
                    format: {
                        textAlign: 'start',
                        whiteSpace: 'normal',
                        borderTop: '1px solid black',
                        borderRight: '1px solid black',
                        borderBottom: '1px solid black',
                        borderLeft: '1px solid black',
                        backgroundColor: 'rgb(255, 255, 255)',
                    },
                },
                paragraph,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge ListItem with styles into paragraph, paragraph after table should not inherit styles from ListItem', () => {
        const majorModel = createContentModelDocument();
        const para1 = createParagraph(false, undefined, {
            fontFamily: 'Arial',
            fontSize: '15px',
            backgroundColor: 'red',
            textColor: 'blue',
            italic: false,
        });
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker, text2);
        majorModel.blocks.push(para1);

        const sourceModel: ContentModelDocument = createContentModelDocument();
        const newList = createListItem([
            createListLevel('OL', {
                marginBottom: '100px',
            }),
        ]);
        const para2 = createParagraph(false, undefined, {
            fontFamily: 'Arial',
            fontSize: '15px',
            backgroundColor: 'red',
            textColor: 'blue',
            italic: false,
        });
        const text3 = createText('test1');
        newList.blocks.push(para2);
        para2.segments.push(text3);

        sourceModel.blocks.push(newList);
        const result = mergeModel(majorModel, sourceModel);

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test2', format: {} },
            ],
            format: {},
            segmentFormat: {
                fontFamily: 'Arial',
                fontSize: '15px',
                backgroundColor: 'red',
                textColor: 'blue',
                italic: false,
            },
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test1', format: {} }],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Arial',
                        fontSize: '15px',
                        backgroundColor: 'red',
                        textColor: 'blue',
                        italic: false,
                    },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [{ segmentType: 'Text', text: 'test1', format: {} }],
                            format: {},
                            segmentFormat: {
                                fontFamily: 'Arial',
                                fontSize: '15px',
                                backgroundColor: 'red',
                                textColor: 'blue',
                                italic: false,
                            },
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: { marginBottom: '100px' },
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
                paragraph,
            ],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge Entity with styles into paragraph, paragraph after table should not inherit styles from Entity', () => {
        const majorModel = createContentModelDocument();
        const para1 = createParagraph(false, undefined, {
            fontFamily: 'Arial',
            fontSize: '15px',
            backgroundColor: 'red',
            textColor: 'blue',
            italic: false,
        });
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker, text2);
        majorModel.blocks.push(para1);

        const sourceModel: ContentModelDocument = createContentModelDocument();
        const newEntity = createEntity(document.createElement('div'), false, {
            fontFamily: 'Corbel',
            fontSize: '20px',
            backgroundColor: 'blue',
            textColor: 'aliceblue',
            italic: true,
        });
        const context: FormatContentModelContext = {
            deletedEntities: [],
            newImages: [],
            newEntities: [],
        };

        sourceModel.blocks.push(newEntity);
        const result = mergeModel(majorModel, sourceModel, context);

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test2', format: {} },
            ],
            format: {},
            segmentFormat: {
                fontFamily: 'Arial',
                fontSize: '15px',
                backgroundColor: 'red',
                textColor: 'blue',
                italic: false,
            },
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'test1', format: {} }],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Arial',
                        fontSize: '15px',
                        backgroundColor: 'red',
                        textColor: 'blue',
                        italic: false,
                    },
                },
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: {
                        fontFamily: 'Corbel',
                        fontSize: '20px',
                        backgroundColor: 'blue',
                        textColor: 'aliceblue',
                        italic: true,
                    },
                    entityFormat: {
                        id: undefined,
                        entityType: undefined,
                        isReadonly: false,
                    },
                    wrapper: newEntity.wrapper,
                },
                paragraph,
            ],
        });
        expect(context).toEqual({
            newEntities: [newEntity],
            deletedEntities: [],
            newImages: [],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge and replace inline entities', () => {
        const majorModel = createContentModelDocument();
        const para1 = createParagraph();
        const sourceEntity = createEntity('wrapper1' as any, true, undefined, 'E0');
        const sourceBr = createBr();

        sourceEntity.isSelected = true;
        para1.segments.push(sourceEntity, sourceBr);
        majorModel.blocks.push(para1);

        const sourceModel: ContentModelDocument = createContentModelDocument();
        const newPara = createParagraph();
        const newEntity1 = createEntity('wrapper2' as any, true, undefined, 'E1');
        const newEntity2 = createEntity('wrapper2' as any, true, undefined, 'E2');
        const text = createText('test');

        newPara.segments.push(newEntity1, text, newEntity2);
        sourceModel.blocks.push(newPara);

        const context: FormatContentModelContext = {
            deletedEntities: [],
            newImages: [],
            newEntities: [],
        };
        const result = mergeModel(majorModel, sourceModel, context);

        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [newEntity1, text, newEntity2, marker],
        };

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(context).toEqual({
            newEntities: [newEntity1, newEntity2],
            deletedEntities: [
                {
                    entity: sourceEntity,
                    operation: 'overwrite',
                },
            ],
            newImages: [],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge Image', () => {
        const majorModel = createContentModelDocument();
        const newImage: ContentModelImage = {
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
        };
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [newImage],
                    format: {},
                },
            ],
            format: {},
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const context: FormatContentModelContext = {
            deletedEntities: [],
            newImages: [],
            newEntities: [],
        };

        const result = mergeModel(majorModel, sourceModel, context, {
            mergeFormat: 'mergeAll',
        });

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                newImage,
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });

        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [newImage],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge two Images', () => {
        const majorModel = createContentModelDocument();
        const newImage: ContentModelImage = {
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
        };
        const newImage1: ContentModelImage = {
            segmentType: 'Image',
            src: 'test1',
            format: {},
            dataset: {},
        };
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [newImage, newImage1],
                    format: {},
                },
            ],
            format: {},
        };
        const para1 = createParagraph();
        const marker = createSelectionMarker();

        para1.segments.push(marker);
        majorModel.blocks.push(para1);

        const context: FormatContentModelContext = {
            deletedEntities: [],
            newImages: [],
            newEntities: [],
        };

        const result = mergeModel(majorModel, sourceModel, context, {
            mergeFormat: 'mergeAll',
        });

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                newImage,
                newImage1,
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });

        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [newImage, newImage1],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });

    it('Merge into a paragraph with image', () => {
        const majorModel = createContentModelDocument();
        const newImage: ContentModelImage = {
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
        };
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [newImage],
                    format: {},
                },
            ],
            format: {},
        };
        const para1 = createParagraph();
        const image: ContentModelImage = {
            segmentType: 'Image',
            src: 'test1',
            format: {},
            dataset: {},
        };
        const marker = createSelectionMarker();

        para1.segments.push(image, marker);
        majorModel.blocks.push(para1);

        const context: FormatContentModelContext = {
            deletedEntities: [],
            newEntities: [],
            newImages: [image],
        };

        const result = mergeModel(majorModel, sourceModel, context, {
            mergeFormat: 'mergeAll',
        });

        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                image,
                newImage,
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });

        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [image, newImage],
        });
        expect(result).toEqual({
            marker,
            paragraph,
            path: [majorModel],
            tableContext: undefined,
        });
    });
});
