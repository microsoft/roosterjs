import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { getSelections } from '../../../lib/modelApi/selection/getSelections';

describe('getSelections', () => {
    it('empty group', () => {
        const group = createContentModelDocument();

        const result = getSelections(group);

        expect(result).toEqual([]);
    });

    it('Group without selection', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelections(group);

        expect(result).toEqual([]);
    });

    it('Group with single selection', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [group],
                segments: [text1],
            },
        ]);
    });

    it('Group with multiple selection', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [group],
                segments: [text1],
            },
            {
                paragraph: para2,
                path: [group],
                segments: [text2],
            },
        ]);
    });

    it('Group with selection inside list', () => {
        const group = createContentModelDocument();
        const listItem = createListItem([]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        listItem.blocks.push(para1);

        group.blocks.push(listItem);
        group.blocks.push(para2);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [listItem, group],
                segments: [text1],
            },
        ]);
    });

    it('Group with selection inside quote', () => {
        const group = createContentModelDocument();
        const quote = createQuote();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        quote.blocks.push(para1);

        group.blocks.push(quote);
        group.blocks.push(para2);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [quote, group],
                segments: [text1],
            },
        ]);
    });

    it('Group with selection inside table', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        cell.blocks.push(para1);
        table.cells = [[cell]];

        group.blocks.push(table);
        group.blocks.push(para2);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [cell, group],
                segments: [text1],
            },
        ]);
    });

    it('Group with selection inside table, list and quote', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const quote = createQuote();
        const listItem = createListItem([]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        listItem.blocks.push(para1);
        quote.blocks.push(listItem);
        cell.blocks.push(quote);
        table.cells = [[cell]];

        group.blocks.push(table);
        group.blocks.push(para2);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [listItem, quote, cell, group],
                segments: [text1],
            },
        ]);
    });

    it('Group with table selection', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        cell1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        cell1.blocks.push(para1);
        cell1.blocks.push(para2);
        table.cells = [[cell1, cell2]];

        group.blocks.push(table);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [cell1, group],
                segments: [text1],
            },
            {
                paragraph: para2,
                path: [cell1, group],
                segments: [text2],
            },
        ]);
    });

    it('Select from the end of paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(marker);
        para2.segments.push(text);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para2,
                path: [group],
                segments: [text],
            },
        ]);
    });

    it('Select to the start of paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(text);
        para2.segments.push(marker);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [group],
                segments: [text],
            },
        ]);
    });

    it('Select from the end of paragraph and allow unmeaningful paragraph', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(marker);
        para2.segments.push(text);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelections(group, { includeUnmeaningfulSelectedParagraph: true });

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [group],
                segments: [marker],
            },
            {
                paragraph: para2,
                path: [group],
                segments: [text],
            },
        ]);
    });

    it('Select to the start of paragraph and allow unmeaningful paragraph', () => {
        const group = createContentModelDocument(document);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(text);
        para2.segments.push(marker);
        group.blocks.push(para1);
        group.blocks.push(para2);

        const result = getSelections(group, { includeUnmeaningfulSelectedParagraph: true });

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [group],
                segments: [text],
            },
            {
                paragraph: para2,
                path: [group],
                segments: [marker],
            },
        ]);
    });

    it('Select from the end to the start of paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(marker1);
        para2.segments.push(text);
        para3.segments.push(marker2);
        group.blocks.push(para1);
        group.blocks.push(para2);
        group.blocks.push(para3);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para2,
                path: [group],
                segments: [text],
            },
        ]);
    });

    it('Select not from the end, and not to the start of paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;
        para1.segments.push(marker1);
        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        para3.segments.push(marker2);
        group.blocks.push(para1);
        group.blocks.push(para2);
        group.blocks.push(para3);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para1,
                path: [group],
                segments: [marker1, text1],
            },
            {
                paragraph: para2,
                path: [group],
                segments: [text2],
            },
            {
                paragraph: para3,
                path: [group],
                segments: [text3, marker2],
            },
        ]);
    });

    it('Selection includes format holder from a list item', () => {
        const group = createContentModelDocument(document);
        const listItem = createListItem([]);
        const para = createParagraph();
        const text = createText('test1');

        text.isSelected = true;
        para.segments.push(text);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        const result = getSelections(group, { includeFormatHolder: true });

        expect(result).toEqual([
            {
                paragraph: null,
                path: [listItem, group],
                segments: [listItem.formatHolder],
            },
            {
                paragraph: para,
                path: [listItem, group],
                segments: [text],
            },
        ]);
    });

    it('Selection does not include format holder from a list item since not all segments are selected', () => {
        const group = createContentModelDocument(document);
        const listItem = createListItem([]);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test1');

        text1.isSelected = true;
        para.segments.push(text1);
        para.segments.push(text2);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        const result = getSelections(group, { includeFormatHolder: true });

        expect(result).toEqual([
            {
                paragraph: para,
                path: [listItem, group],
                segments: [text1],
            },
        ]);
    });

    it('Get Selection from model that contains general node', () => {
        const group = createContentModelDocument(document);
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        text1.isSelected = true;
        para.segments.push(text1);
        para.segments.push(text2);
        generalSpan.blocks.push(para);
        group.blocks.push(generalSpan);

        const result = getSelections(group);

        expect(result).toEqual([
            {
                paragraph: para,
                path: [generalSpan, group],
                segments: [text1],
            },
        ]);
    });
});
