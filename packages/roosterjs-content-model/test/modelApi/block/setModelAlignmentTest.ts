import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { setModelAlignment } from '../../../lib/modelApi/block/setModelAlignment';

describe('align left', () => {
    it('Empty group', () => {
        const group = createContentModelDocument();

        const result = setModelAlignment(group, 'left');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(result).toBeFalse();
    });

    it('Group without selection', () => {
        const group = createContentModelDocument();
        const para = createParagraph();

        group.blocks.push(para);

        const result = setModelAlignment(group, 'left');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [para],
        });
        expect(result).toBeFalse();
    });

    it('Group with selected paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        group.blocks.push(para1);
        group.blocks.push(para2);
        group.blocks.push(para3);

        text2.isSelected = true;

        const result = setModelAlignment(group, 'left');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [text1],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        textAlign: 'start',
                    },
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [text3],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with multiple selected paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        group.blocks.push(para1);
        group.blocks.push(para2);
        group.blocks.push(para3);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        const result = setModelAlignment(group, 'left');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        textAlign: 'start',
                    },
                    segments: [text1],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        textAlign: 'start',
                    },
                    segments: [text2],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        textAlign: 'start',
                    },
                    segments: [text3],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with selected  paragraph in RTL', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, {
            direction: 'rtl',
        });
        const text1 = createText('test1');

        para1.segments.push(text1);
        group.blocks.push(para1);

        text1.isSelected = true;

        const result = setModelAlignment(group, 'left');
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        textAlign: 'end',
                        direction: 'rtl',
                    },
                    segments: [text1],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('Group with paragraph under OL', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const listItem = createListItem([{ listType: 'OL' }]);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        listItem.blocks.push(para1);
        listItem.blocks.push(para2);
        listItem.blocks.push(para3);
        group.blocks.push(listItem);

        text2.isSelected = true;

        const result = setModelAlignment(group, 'left');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [{ listType: 'OL' }],
                    blocks: [para1, para2, para3],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {
                        textAlign: 'start',
                    },
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('align table, list, paragraph left', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const listItem = createListItem([{ listType: 'OL' }]);
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        const para4 = createParagraph();
        para4.segments.push(text4);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);

        listItem.blocks.push(para1);
        listItem.blocks.push(para2);
        listItem.blocks.push(para3);
        group.blocks.push(listItem);
        group.blocks.push(table);
        group.blocks.push(para4);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;
        table.rows.every(row => row.cells.every(cell => (cell.isSelected = true)));

        const result = setModelAlignment(group, 'left');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        {
                            listType: 'OL',
                        },
                    ],
                    blocks: [para1, para2, para3],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {
                        textAlign: 'start',
                    },
                },
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                            ],
                        },
                        { format: {}, height: 0, cells: [] },
                    ],
                    format: {
                        marginLeft: '',
                        marginRight: 'auto',
                    },
                    widths: [],
                    dataset: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {
                        textAlign: 'start',
                    },
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('align table, list, paragraph center', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const listItem = createListItem([{ listType: 'OL' }]);
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        const para4 = createParagraph();
        para4.segments.push(text4);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);

        listItem.blocks.push(para1);
        listItem.blocks.push(para2);
        listItem.blocks.push(para3);
        group.blocks.push(listItem);
        group.blocks.push(table);
        group.blocks.push(para4);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;
        table.rows.every(row => row.cells.every(cell => (cell.isSelected = true)));

        const result = setModelAlignment(group, 'center');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        {
                            listType: 'OL',
                        },
                    ],
                    blocks: [para1, para2, para3],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: { textAlign: 'center' },
                },
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                            ],
                        },
                        { format: {}, height: 0, cells: [] },
                    ],
                    format: {
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    },
                    widths: [],
                    dataset: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {
                        textAlign: 'center',
                    },
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('align table, list, paragraph right', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const listItem = createListItem([{ listType: 'OL' }]);
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        const para4 = createParagraph();
        para4.segments.push(text4);

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);

        listItem.blocks.push(para1);
        listItem.blocks.push(para2);
        listItem.blocks.push(para3);
        group.blocks.push(listItem);
        group.blocks.push(table);
        group.blocks.push(para4);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;
        table.rows.every(row => row.cells.every(cell => (cell.isSelected = true)));

        const result = setModelAlignment(group, 'right');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        {
                            listType: 'OL',
                        },
                    ],
                    blocks: [para1, para2, para3],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: { textAlign: 'end' },
                },
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                            ],
                        },
                        { format: {}, height: 0, cells: [] },
                    ],
                    format: {
                        marginLeft: 'auto',
                        marginRight: '',
                    },
                    widths: [],
                    dataset: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {
                        textAlign: 'end',
                    },
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('[RTL] align table, list, paragraph left', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const listItem = createListItem([{ listType: 'OL' }]);
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        const para4 = createParagraph();
        para4.segments.push(text4);
        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);

        listItem.blocks.push(para1);
        listItem.blocks.push(para2);
        listItem.blocks.push(para3);
        group.blocks.push(listItem);
        group.blocks.push(table);
        group.blocks.push(para4);

        listItem.format.direction = 'rtl';
        table.format.direction = 'rtl';
        para4.format.direction = 'rtl';
        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;
        table.rows.every(row => row.cells.every(cell => (cell.isSelected = true)));

        const result = setModelAlignment(group, 'left');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        {
                            listType: 'OL',
                        },
                    ],
                    blocks: [para1, para2, para3],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {
                        direction: 'rtl',
                        textAlign: 'end',
                    },
                },
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                            ],
                        },
                        { format: {}, height: 0, cells: [] },
                    ],
                    format: {
                        marginLeft: 'auto',
                        marginRight: '',
                        direction: 'rtl',
                    },
                    widths: [],
                    dataset: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {
                        textAlign: 'end',
                        direction: 'rtl',
                    },
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('[RTL] align table, list, paragraph center', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const listItem = createListItem([{ listType: 'OL' }]);
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        const para4 = createParagraph();
        para4.segments.push(text4);
        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        para4.format.direction = 'rtl';

        listItem.blocks.push(para1);
        listItem.blocks.push(para2);
        listItem.blocks.push(para3);
        group.blocks.push(listItem);
        group.blocks.push(table);
        group.blocks.push(para4);

        listItem.format.direction = 'rtl';
        table.format.direction = 'rtl';
        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;
        table.rows.every(row => row.cells.every(cell => (cell.isSelected = true)));

        const result = setModelAlignment(group, 'center');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        {
                            listType: 'OL',
                        },
                    ],
                    blocks: [para1, para2, para3],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {
                        direction: 'rtl',
                        textAlign: 'center',
                    },
                },
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                            ],
                        },
                        { format: {}, height: 0, cells: [] },
                    ],
                    format: {
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        direction: 'rtl',
                    },
                    widths: [],
                    dataset: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {
                        textAlign: 'center',
                        direction: 'rtl',
                    },
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('[RTL] align table, list, paragraph right', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');
        const listItem = createListItem([{ listType: 'OL' }]);
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(1, 1, false));
        table.rows[0].cells.push(createTableCell(1, 1, false));
        const para4 = createParagraph();
        para4.segments.push(text4);
        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);

        listItem.blocks.push(para1);
        listItem.blocks.push(para2);
        listItem.blocks.push(para3);
        group.blocks.push(listItem);
        group.blocks.push(table);
        group.blocks.push(para4);

        listItem.format.direction = 'rtl';
        table.format.direction = 'rtl';

        para4.format.direction = 'rtl';
        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        text4.isSelected = true;
        table.rows.every(row => row.cells.every(cell => (cell.isSelected = true)));

        const result = setModelAlignment(group, 'right');

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    levels: [
                        {
                            listType: 'OL',
                        },
                    ],
                    blocks: [para1, para2, para3],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {
                        direction: 'rtl',
                        textAlign: 'start',
                    },
                },
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {},
                                    dataset: {},
                                    isHeader: false,
                                    isSelected: true,
                                },
                            ],
                        },
                        { format: {}, height: 0, cells: [] },
                    ],
                    format: {
                        marginLeft: '',
                        marginRight: 'auto',
                        direction: 'rtl',
                    },
                    widths: [],
                    dataset: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {
                        textAlign: 'start',
                        direction: 'rtl',
                    },
                },
            ],
        });
        expect(result).toBeTrue();
    });
});
