import * as applyTableFormat from '../../../lib/modelApi/table/applyTableFormat';
import * as normalizeTable from '../../../lib/modelApi/table/normalizeTable';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { mergeModel } from '../../../lib/modelApi/common/mergeModel';

function onDeleteEntityMock() {
    return false;
}

describe('mergeModel', () => {
    it('empty to single selection', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        para.segments.push(marker);
        majorModel.blocks.push(para);

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

        expect(majorModel).toEqual({
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
                },
            ],
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
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
                },
            ],
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

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
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                textColor: 'green',
                            },
                        },
                    ],
                    format: {},
                },
            ],
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'newText2',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                textColor: 'green',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {
                                textColor: 'yellow',
                            },
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('text to list', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();

        const list1 = createListItem([{ listType: 'OL' }]);
        const list2 = createListItem([{ listType: 'OL' }]);

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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

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
                                    text: 'newText3',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'test21',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
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
        const newList1 = createListItem([{ listType: 'OL' }]);
        const newList2 = createListItem([{ listType: 'OL' }]);

        newPara1.segments.push(newText1);
        newPara2.segments.push(newText2);
        newPara3.segments.push(newText3);

        newList1.blocks.push(newPara1);
        newList2.blocks.push(newPara2);
        newList2.blocks.push(newPara3);

        sourceModel.blocks.push(newList1);
        sourceModel.blocks.push(newList2);

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

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
                },
            ],
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
            { listType: 'OL', startNumberOverride: 1, unorderedStyleType: 2 },
        ]);
        const list2 = createListItem([
            { listType: 'OL', startNumberOverride: 1, unorderedStyleType: 2 },
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
            { listType: 'UL', startNumberOverride: 3, unorderedStyleType: 4 },
        ]);
        const newList2 = createListItem([
            { listType: 'UL', startNumberOverride: 3, unorderedStyleType: 4 },
            { listType: 'UL', startNumberOverride: 5, unorderedStyleType: 6 },
        ]);

        newPara1.segments.push(newText1);
        newPara2.segments.push(newText2);

        newList1.blocks.push(newPara1);
        newList2.blocks.push(newPara2);

        sourceModel.blocks.push(newList1);
        sourceModel.blocks.push(newList2);

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

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
                            startNumberOverride: 1,
                            unorderedStyleType: 2,
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
                            startNumberOverride: 1,
                            unorderedStyleType: 2,
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
                            startNumberOverride: 1,
                            unorderedStyleType: 2,
                        },
                        {
                            listType: 'UL',
                            startNumberOverride: 5,
                            unorderedStyleType: 6,
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
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'test22',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            startNumberOverride: 1,
                            unorderedStyleType: 2,
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

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
                },
            ],
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

        expect(normalizeTable.normalizeTable).not.toHaveBeenCalled();
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        { format: {}, height: 0, cells: [cell11, cell12] },
                        {
                            format: {},
                            height: 0,
                            cells: [
                                cell21,
                                {
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
                                        {
                                            blockType: 'Paragraph',
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
            ],
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock, {
            mergeTable: true,
        });

        expect(normalizeTable.normalizeTable).toHaveBeenCalledTimes(1);
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
                            cells: [
                                cell11,
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
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        backgroundColor: 'n11',
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                newCell12,
                            ],
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
                },
            ],
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock, {
            mergeTable: true,
        });

        expect(normalizeTable.normalizeTable).toHaveBeenCalledTimes(1);
        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        { format: {}, height: 0, cells: [cell01, cell02, cell03, cell04] },
                        {
                            format: {},
                            height: 0,
                            cells: [
                                cell11,
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
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        backgroundColor: 'n11',
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                newCell12,
                                cell14,
                            ],
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
                },
            ],
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock, {
            mergeTable: true,
        });

        expect(normalizeTable.normalizeTable).toHaveBeenCalledTimes(1);
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
                            cells: [
                                cell11,
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
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        backgroundColor: 'n11',
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                newCell12,
                            ],
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
                },
            ],
        });
    });

    it('Use customized insert position', () => {
        const majorModel = createContentModelDocument();
        const sourceModel = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();
        const marker3 = createSelectionMarker();

        para1.segments.push(marker1, text1, marker2, text2, marker3);
        majorModel.blocks.push(para1);

        const newPara = createParagraph();
        const newText = createText('new text');

        newPara.segments.push(newText);
        sourceModel.blocks.push(newPara);

        mergeModel(majorModel, sourceModel, onDeleteEntityMock, {
            insertPosition: {
                marker: marker2,
                paragraph: para1,
                path: [majorModel],
            },
        });

        expect(majorModel).toEqual({
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
                            text: 'test1',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'new text',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
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
                },
            ],
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock, {
            mergeFormat: 'mergeAll',
        });

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: MockedFormat,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: MockedFormat,
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock, {
            mergeFormat: 'keepSourceEmphasisFormat',
        });

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: MockedFormat,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: MockedFormat,
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
                                italic: 'sourceItalic',
                                underline: 'sourceUnderline',
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock, {
            mergeFormat: 'keepSourceEmphasisFormat',
        });

        expect(majorModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                formatName: 'mocked',
                                fontWeight: 'sourceFontWeight',
                                italic: 'sourceItalic',
                                underline: 'sourceUnderline',
                            } as any,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: MockedFormat,
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
                                        italic: 'sourceItalic',
                                        underline: 'sourceUnderline',
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock, {
            mergeFormat: 'keepSourceEmphasisFormat',
        });

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
                    levels: [{ listType: 'OL' }],
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
                                        italic: 'sourceItalic',
                                        underline: 'sourceUnderline',
                                    } as any,
                                },
                            ],
                            format: {},
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        { segmentType: 'Br', format: {} },
                    ],
                    format: {},
                },
            ],
            format: MockedFormat,
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

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
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                        { segmentType: 'Text', text: 'test2', format: {} },
                    ],
                    format: {},
                    segmentFormat: { fontFamily: 'Arial' },
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

        mergeModel(majorModel, sourceModel, onDeleteEntityMock);

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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'newText2',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                textColor: 'green',
                            },
                        },
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
                },
            ],
        });
    });
});
