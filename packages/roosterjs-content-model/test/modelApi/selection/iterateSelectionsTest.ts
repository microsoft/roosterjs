import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createEntity } from '../../../lib/modelApi/creators/createEntity';
import { createGeneralBlock } from '../../../lib/modelApi/creators/createGeneralBlock';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import {
    iterateSelections,
    IterateSelectionsCallback,
} from '../../../lib/modelApi/selection/iterateSelections';

describe('iterateSelections', () => {
    let callback: jasmine.Spy<IterateSelectionsCallback>;

    beforeEach(() => {
        callback = jasmine.createSpy<IterateSelectionsCallback>();
    });

    it('empty group', () => {
        const group = createContentModelDocument();
        iterateSelections([group], callback);

        expect(callback).not.toHaveBeenCalled();
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

        iterateSelections([group], callback);

        expect(callback).not.toHaveBeenCalled();
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

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([group], undefined, para1, [text1]);
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

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith([group], undefined, para1, [text1]);
        expect(callback).toHaveBeenCalledWith([group], undefined, para2, [text2]);
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

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith([listItem, group], undefined, para1, [text1]);
        expect(callback).toHaveBeenCalledWith([listItem, group], undefined, undefined, [
            listItem.formatHolder,
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

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([quote, group], undefined, para1, [text1]);
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
        table.rows = [{ format: {}, height: 0, cells: [cell] }];

        group.blocks.push(table);
        group.blocks.push(para2);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(
            [cell, group],
            {
                table: table,
                rowIndex: 0,
                colIndex: 0,
                isWholeTableSelected: false,
            },
            para1,
            [text1]
        );
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
        table.rows = [{ format: {}, height: 0, cells: [cell] }];

        group.blocks.push(table);
        group.blocks.push(para2);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith(
            [listItem, quote, cell, group],
            {
                table: table,
                colIndex: 0,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
            para1,
            [text1]
        );
        expect(callback).toHaveBeenCalledWith(
            [listItem, quote, cell, group],
            {
                table: table,
                colIndex: 0,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
            undefined,
            [listItem.formatHolder]
        );
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
        table.rows = [{ format: {}, height: 0, cells: [cell1, cell2] }];

        group.blocks.push(table);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenCalledWith(
            [group],
            {
                table: table,
                colIndex: 0,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
            undefined,
            undefined
        );
        expect(callback).toHaveBeenCalledWith(
            [cell1, group],
            {
                table: table,
                colIndex: 0,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
            para1,
            [text1]
        );
        expect(callback).toHaveBeenCalledWith(
            [cell1, group],
            {
                table: table,
                colIndex: 0,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
            para2,
            [text2]
        );
    });

    it('Group with table selection and ignore selected table cell content', () => {
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
        table.rows = [{ format: {}, height: 0, cells: [cell1, cell2] }];

        group.blocks.push(table);

        iterateSelections([group], callback, {
            contentUnderSelectedTableCell: 'ignoreForTableOrCell',
        });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(
            [group],
            {
                table: table,
                colIndex: 0,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
            undefined,
            undefined
        );
    });

    it('Group with table selection and ignore selected table content', () => {
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
        table.rows = [{ format: {}, height: 0, cells: [cell1, cell2] }];

        group.blocks.push(table);

        iterateSelections([group], callback, {
            contentUnderSelectedTableCell: 'ignoreForTable',
        });

        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenCalledWith(
            [group],
            {
                table: table,
                colIndex: 0,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
            undefined,
            undefined
        );
        expect(callback).toHaveBeenCalledWith(
            [cell1, group],
            {
                table: table,
                colIndex: 0,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
            para1,
            [text1]
        );
        expect(callback).toHaveBeenCalledWith(
            [cell1, group],
            {
                table: table,
                colIndex: 0,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
            para2,
            [text2]
        );
    });

    it('Group with whole table selection and ignore selected table cell content', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        cell1.isSelected = true;
        cell2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);

        cell1.blocks.push(para1);
        cell2.blocks.push(para2);
        table.rows = [{ format: {}, height: 0, cells: [cell1, cell2] }];

        group.blocks.push(table);

        iterateSelections([group], callback, { contentUnderSelectedTableCell: 'ignoreForTable' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([group], undefined, table, undefined);
    });

    it('Select from the end of paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '20px' });
        const para2 = createParagraph(false, { lineHeight: '30px' });
        const marker = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(marker);
        para2.segments.push(text);
        group.blocks.push(para1);
        group.blocks.push(para2);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith([group], undefined, para1, [marker]);
        expect(callback).toHaveBeenCalledWith([group], undefined, para2, [text]);
    });

    it('Select to the start of paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '20px' });
        const para2 = createParagraph(false, { lineHeight: '30px' });
        const marker = createSelectionMarker();
        const text = createText('test');

        text.isSelected = true;
        para1.segments.push(text);
        para2.segments.push(marker);
        group.blocks.push(para1);
        group.blocks.push(para2);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith([group], undefined, para1, [text]);
        expect(callback).toHaveBeenCalledWith([group], undefined, para2, [marker]);
    });

    it('Select from the end of paragraph and allow unmeaningful paragraph', () => {
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

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith([group], undefined, para1, [marker]);
        expect(callback).toHaveBeenCalledWith([group], undefined, para2, [text]);
    });

    it('Select from the end to the start of paragraph', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '20px' });
        const para2 = createParagraph(false, { lineHeight: '30px' });
        const para3 = createParagraph(false, { lineHeight: '40px' });
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

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenCalledWith([group], undefined, para1, [marker1]);
        expect(callback).toHaveBeenCalledWith([group], undefined, para2, [text]);
        expect(callback).toHaveBeenCalledWith([group], undefined, para3, [marker2]);
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

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenCalledWith([group], undefined, para1, [marker1, text1]);
        expect(callback).toHaveBeenCalledWith([group], undefined, para2, [text2]);
        expect(callback).toHaveBeenCalledWith([group], undefined, para3, [text3, marker2]);
    });

    it('Selection includes format holder from a list item', () => {
        const group = createContentModelDocument();
        const listItem = createListItem([]);
        const para = createParagraph();
        const text = createText('test1');

        text.isSelected = true;
        para.segments.push(text);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith([listItem, group], undefined, para, [text]);
        expect(callback).toHaveBeenCalledWith([listItem, group], undefined, undefined, [
            listItem.formatHolder,
        ]);
    });

    it('Selection does not include format holder from a list item since not all segments are selected', () => {
        const group = createContentModelDocument();
        const listItem = createListItem([]);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test1');

        text1.isSelected = true;
        para.segments.push(text1);
        para.segments.push(text2);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([listItem, group], undefined, para, [text1]);
    });

    it('Get Selection from model that contains general node', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        text1.isSelected = true;
        para.segments.push(text1);
        para.segments.push(text2);
        generalSpan.blocks.push(para);
        group.blocks.push(generalSpan);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([generalSpan, group], undefined, para, [text1]);
    });

    it('Get Selection from model that contains general segment', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        text1.isSelected = true;
        para1.segments.push(generalSpan);
        generalSpan.blocks.push(para2);
        para2.segments.push(text1, text2);
        group.blocks.push(para1);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [text1]);
    });

    it('Get Selection from model that contains empty general segment with different options', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);

        para1.segments.push(generalSpan);
        group.blocks.push(para1);

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback);
        iterateSelections([group], callback1, {
            contentUnderSelectedGeneralElement: 'contentOnly',
        });
        iterateSelections([group], callback2, {
            contentUnderSelectedGeneralElement: 'generalElementOnly',
        });
        iterateSelections([group], callback3, { contentUnderSelectedGeneralElement: 'both' });

        expect(callback).toHaveBeenCalledTimes(0);
        expect(callback1).toHaveBeenCalledTimes(0);
        expect(callback2).toHaveBeenCalledTimes(0);
        expect(callback3).toHaveBeenCalledTimes(0);
    });

    it('Get Selection from model that contains general segment with content for different options', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        para2.segments.push(text1, text2);
        generalSpan.blocks.push(para2);
        para1.segments.push(generalSpan);
        group.blocks.push(para1);

        text2.isSelected = true;

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback);
        iterateSelections([group], callback1, {
            contentUnderSelectedGeneralElement: 'contentOnly',
        });
        iterateSelections([group], callback2, {
            contentUnderSelectedGeneralElement: 'generalElementOnly',
        });
        iterateSelections([group], callback3, { contentUnderSelectedGeneralElement: 'both' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [text2]);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [text2]);
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [text2]);
        expect(callback3).toHaveBeenCalledTimes(1);
        expect(callback3).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [text2]);
    });

    it('Get Selection from model that contains empty selected general', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);

        generalSpan.isSelected = true;
        para1.segments.push(generalSpan);
        group.blocks.push(para1);

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback);
        iterateSelections([group], callback1, {
            contentUnderSelectedGeneralElement: 'contentOnly',
        });
        iterateSelections([group], callback2, {
            contentUnderSelectedGeneralElement: 'generalElementOnly',
        });
        iterateSelections([group], callback3, { contentUnderSelectedGeneralElement: 'both' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([group], undefined, para1, [generalSpan]);

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith([group], undefined, para1, [generalSpan]);

        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith([group], undefined, para1, [generalSpan]);

        expect(callback3).toHaveBeenCalledTimes(1);
        expect(callback3).toHaveBeenCalledWith([group], undefined, para1, [generalSpan]);
    });

    it('Get Selection from model that contains selected general segment', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        generalSpan.isSelected = true;
        para1.segments.push(generalSpan);
        generalSpan.blocks.push(para2);
        para2.segments.push(text1, text2);
        group.blocks.push(para1);

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback);
        iterateSelections([group], callback1, {
            contentUnderSelectedGeneralElement: 'contentOnly',
        });
        iterateSelections([group], callback2, {
            contentUnderSelectedGeneralElement: 'generalElementOnly',
        });
        iterateSelections([group], callback3, { contentUnderSelectedGeneralElement: 'both' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [
            text1,
            text2,
        ]);

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [
            text1,
            text2,
        ]);

        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith([group], undefined, para1, [generalSpan]);

        expect(callback3).toHaveBeenCalledTimes(2);
        expect(callback3).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [
            text1,
            text2,
        ]);
        expect(callback3).toHaveBeenCalledWith([group], undefined, para1, [generalSpan]);
    });

    it('Get Selection from model that contains general segment, treat all as selected', () => {
        const group = createContentModelDocument();
        const generalSpan = createGeneralSegment(document.createElement('span'));
        const para1 = createParagraph(true /*implicit*/);
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        para1.segments.push(generalSpan);
        generalSpan.blocks.push(para2);
        para2.segments.push(text1, text2);
        group.blocks.push(para1);

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback, undefined, undefined, true);
        iterateSelections(
            [group],
            callback1,
            {
                contentUnderSelectedGeneralElement: 'contentOnly',
            },
            undefined,
            true
        );
        iterateSelections(
            [group],
            callback2,
            {
                contentUnderSelectedGeneralElement: 'generalElementOnly',
            },
            undefined,
            true
        );
        iterateSelections(
            [group],
            callback3,
            { contentUnderSelectedGeneralElement: 'both' },
            undefined,
            true
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [
            text1,
            text2,
        ]);

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [
            text1,
            text2,
        ]);

        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith([group], undefined, para1, [generalSpan]);

        expect(callback3).toHaveBeenCalledTimes(2);
        expect(callback3).toHaveBeenCalledWith([generalSpan, group], undefined, para2, [
            text1,
            text2,
        ]);
        expect(callback3).toHaveBeenCalledWith([group], undefined, para1, [generalSpan]);
    });

    it('Get Selection from model that contains general block', () => {
        const group = createContentModelDocument();
        const generalDiv = createGeneralBlock(document.createElement('div'));
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        text1.isSelected = true;
        generalDiv.blocks.push(para2);
        para2.segments.push(text1, text2);
        group.blocks.push(generalDiv);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [text1]);
    });

    it('Get Selection from model that contains empty general block with different options', () => {
        const group = createContentModelDocument();
        const generalDiv = createGeneralBlock(document.createElement('div'));

        group.blocks.push(generalDiv);

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback);
        iterateSelections([group], callback1, {
            contentUnderSelectedGeneralElement: 'contentOnly',
        });
        iterateSelections([group], callback2, {
            contentUnderSelectedGeneralElement: 'generalElementOnly',
        });
        iterateSelections([group], callback3, { contentUnderSelectedGeneralElement: 'both' });

        expect(callback).toHaveBeenCalledTimes(0);
        expect(callback1).toHaveBeenCalledTimes(0);
        expect(callback2).toHaveBeenCalledTimes(0);
        expect(callback3).toHaveBeenCalledTimes(0);
    });

    it('Get Selection from model that contains general block with content for different options', () => {
        const group = createContentModelDocument();
        const generalDiv = createGeneralBlock(document.createElement('div'));
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        para2.segments.push(text1, text2);
        generalDiv.blocks.push(para2);
        group.blocks.push(generalDiv);

        text2.isSelected = true;

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback);
        iterateSelections([group], callback1, {
            contentUnderSelectedGeneralElement: 'contentOnly',
        });
        iterateSelections([group], callback2, {
            contentUnderSelectedGeneralElement: 'generalElementOnly',
        });
        iterateSelections([group], callback3, { contentUnderSelectedGeneralElement: 'both' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [text2]);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [text2]);
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [text2]);
        expect(callback3).toHaveBeenCalledTimes(1);
        expect(callback3).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [text2]);
    });

    it('Get Selection from model that contains empty selected general block', () => {
        const group = createContentModelDocument();
        const generalDiv = createGeneralBlock(document.createElement('div'));

        generalDiv.isSelected = true;
        group.blocks.push(generalDiv);

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback);
        iterateSelections([group], callback1, {
            contentUnderSelectedGeneralElement: 'contentOnly',
        });
        iterateSelections([group], callback2, {
            contentUnderSelectedGeneralElement: 'generalElementOnly',
        });
        iterateSelections([group], callback3, { contentUnderSelectedGeneralElement: 'both' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([group], undefined, generalDiv, undefined);

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith([group], undefined, generalDiv, undefined);

        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith([group], undefined, generalDiv, undefined);

        expect(callback3).toHaveBeenCalledTimes(1);
        expect(callback3).toHaveBeenCalledWith([group], undefined, generalDiv, undefined);
    });

    it('Get Selection from model that contains selected general block', () => {
        const group = createContentModelDocument();
        const generalDiv = createGeneralBlock(document.createElement('div'));
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        generalDiv.isSelected = true;
        generalDiv.blocks.push(para2);
        para2.segments.push(text1, text2);
        group.blocks.push(generalDiv);

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback);
        iterateSelections([group], callback1, {
            contentUnderSelectedGeneralElement: 'contentOnly',
        });
        iterateSelections([group], callback2, {
            contentUnderSelectedGeneralElement: 'generalElementOnly',
        });
        iterateSelections([group], callback3, { contentUnderSelectedGeneralElement: 'both' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [
            text1,
            text2,
        ]);

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [
            text1,
            text2,
        ]);

        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith([group], undefined, generalDiv, undefined);

        expect(callback3).toHaveBeenCalledTimes(2);
        expect(callback3).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [
            text1,
            text2,
        ]);
        expect(callback3).toHaveBeenCalledWith([group], undefined, generalDiv, undefined);
    });

    it('Get Selection from model that contains general block, treat all as selected', () => {
        const group = createContentModelDocument();
        const generalDiv = createGeneralBlock(document.createElement('div'));
        const para2 = createParagraph(true /*implicit*/);
        const text1 = createText('test1');
        const text2 = createText('test1');

        generalDiv.blocks.push(para2);
        para2.segments.push(text1, text2);
        group.blocks.push(generalDiv);

        const callback1 = jasmine.createSpy('callback1');
        const callback2 = jasmine.createSpy('callback2');
        const callback3 = jasmine.createSpy('callback3');

        iterateSelections([group], callback, undefined, undefined, true);
        iterateSelections(
            [group],
            callback1,
            {
                contentUnderSelectedGeneralElement: 'contentOnly',
            },
            undefined,
            true
        );
        iterateSelections(
            [group],
            callback2,
            {
                contentUnderSelectedGeneralElement: 'generalElementOnly',
            },
            undefined,
            true
        );
        iterateSelections(
            [group],
            callback3,
            { contentUnderSelectedGeneralElement: 'both' },
            undefined,
            true
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [
            text1,
            text2,
        ]);

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [
            text1,
            text2,
        ]);

        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith([group], undefined, generalDiv, undefined);

        expect(callback3).toHaveBeenCalledTimes(2);
        expect(callback3).toHaveBeenCalledWith([generalDiv, group], undefined, para2, [
            text1,
            text2,
        ]);
        expect(callback3).toHaveBeenCalledWith([group], undefined, generalDiv, undefined);
    });

    it('Divider selection', () => {
        const group = createContentModelDocument();
        const divider = createDivider('div');

        divider.isSelected = true;
        group.blocks.push(divider);

        iterateSelections([group], callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([group], undefined, divider, undefined);
    });

    it('Return true from first selection', () => {
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

        const newCallback = jasmine
            .createSpy()
            .and.callFake((path, tableContext, block, segments) => {
                return block == para1;
            });

        iterateSelections([group], newCallback);

        expect(newCallback).toHaveBeenCalledTimes(1);
        expect(newCallback).toHaveBeenCalledWith([group], undefined, para1, [text1]);
    });

    it('Return true from divider', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const divider = createDivider('hr');
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;
        divider.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        group.blocks.push(para1, divider, para2);

        const newCallback = jasmine
            .createSpy()
            .and.callFake((path, tableContext, block, segments) => {
                return block == divider;
            });

        iterateSelections([group], newCallback);

        expect(newCallback).toHaveBeenCalledTimes(2);
        expect(newCallback).toHaveBeenCalledWith([group], undefined, para1, [text1]);
        expect(newCallback).toHaveBeenCalledWith([group], undefined, divider, undefined);
    });

    it('Return true from first selection in nested block group', () => {
        const group = createContentModelDocument();
        const quote1 = createQuote();
        const quote2 = createQuote();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        quote1.blocks.push(para1);
        quote2.blocks.push(para2);
        group.blocks.push(quote1);
        group.blocks.push(quote2);

        const newCallback = jasmine
            .createSpy()
            .and.callFake((path, tableContext, block, segments) => {
                return block == para1;
            });

        iterateSelections([group], newCallback);

        expect(newCallback).toHaveBeenCalledTimes(1);
        expect(newCallback).toHaveBeenCalledWith([quote1, group], undefined, para1, [text1]);
    });

    it('Return true from whole table selection', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph();
        const text = createText('text');

        cell.isSelected = true;
        text.isSelected = true;

        para.segments.push(text);
        table.rows[0].cells.push(cell);
        group.blocks.push(table);
        group.blocks.push(para);

        const newCallback = jasmine
            .createSpy()
            .and.callFake((path, tableContext, block, segments) => {
                return block == table;
            });

        iterateSelections([group], newCallback, {
            contentUnderSelectedTableCell: 'ignoreForTable',
        });

        expect(newCallback).toHaveBeenCalledTimes(1);
        expect(newCallback).toHaveBeenCalledWith([group], undefined, table, undefined);
    });

    it('Return true from table cell selection', () => {
        const group = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell(false, false, false, { textAlign: 'start' });
        const cell2 = createTableCell(false, false, false, { textAlign: 'center' });
        const cell3 = createTableCell(false, false, false, { textAlign: 'end' });

        cell1.isSelected = true;
        cell2.isSelected = true;
        cell3.isSelected = true;

        table.rows[0].cells.push(cell1, cell2, cell3);
        group.blocks.push(table);

        const newCallback = jasmine
            .createSpy()
            .and.callFake((path, tableContext, block, segments) => {
                if (tableContext) {
                    const { table, colIndex, rowIndex } = tableContext;

                    if (table.rows[rowIndex].cells[colIndex] == cell2) {
                        return true;
                    }
                }
            });

        iterateSelections([group], newCallback);

        expect(newCallback).toHaveBeenCalledTimes(2);
        expect(newCallback).toHaveBeenCalledWith(
            [group],
            {
                table: table,
                rowIndex: 0,
                colIndex: 0,
                isWholeTableSelected: true,
            },
            undefined,
            undefined
        );
        expect(newCallback).toHaveBeenCalledWith(
            [group],
            {
                table: table,
                rowIndex: 0,
                colIndex: 1,
                isWholeTableSelected: true,
            },
            undefined,
            undefined
        );
    });

    it('includeListFormatHolder=anySegment', () => {
        const doc = createContentModelDocument();
        const list = createListItem([{ listType: 'OL' }]);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        text2.isSelected = true;

        para.segments.push(text1, text2);
        list.blocks.push(para);
        doc.blocks.push(list);

        iterateSelections([doc], callback, { includeListFormatHolder: 'anySegment' });

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith([list, doc], undefined, para, [text2]);
        expect(callback).toHaveBeenCalledWith([list, doc], undefined, undefined, [
            {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
        ]);
    });

    it('includeListFormatHolder=allSegment', () => {
        const doc = createContentModelDocument();
        const list = createListItem([{ listType: 'OL' }]);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        text2.isSelected = true;

        para.segments.push(text1, text2);
        list.blocks.push(para);
        doc.blocks.push(list);

        iterateSelections([doc], callback, { includeListFormatHolder: 'allSegments' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([list, doc], undefined, para, [text2]);
    });

    it('includeListFormatHolder=allSegment 2', () => {
        const doc = createContentModelDocument();
        const list = createListItem([{ listType: 'OL' }]);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        text1.isSelected = true;
        text2.isSelected = true;

        para.segments.push(text1, text2);
        list.blocks.push(para);
        doc.blocks.push(list);

        iterateSelections([doc], callback, { includeListFormatHolder: 'allSegments' });

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith([list, doc], undefined, para, [text1, text2]);
        expect(callback).toHaveBeenCalledWith([list, doc], undefined, undefined, [
            {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
        ]);
    });

    it('includeListFormatHolder=never', () => {
        const doc = createContentModelDocument();
        const list = createListItem([{ listType: 'OL' }]);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        text1.isSelected = true;
        text2.isSelected = true;

        para.segments.push(text1, text2);
        list.blocks.push(para);
        doc.blocks.push(list);

        iterateSelections([doc], callback, { includeListFormatHolder: 'never' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([list, doc], undefined, para, [text1, text2]);
    });

    it('With selected entity', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const entity = createEntity(null!, true);

        entity.isSelected = true;

        para.segments.push(entity);
        doc.blocks.push(para);

        iterateSelections([doc], callback, { includeListFormatHolder: 'never' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([doc], undefined, para, [entity]);
    });

    it('Check cachedElement is cleared', () => {
        const quote1 = createQuote();
        const para1 = createParagraph();
        const divider1 = createDivider('hr');
        const quote2 = createQuote();
        const para2 = createParagraph();
        const divider2 = createDivider('hr');
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();
        const cache = 'CACHE' as any;

        quote1.cachedElement = cache;
        para1.cachedElement = cache;
        divider1.cachedElement = cache;
        quote2.cachedElement = cache;
        para2.cachedElement = cache;
        divider2.cachedElement = cache;

        addSegment(quote1, marker1);
        para1.segments.push(marker2);
        divider1.isSelected = true;

        const doc = createContentModelDocument();

        doc.blocks.push(quote1, quote2, para1, para2, divider1, divider2);

        iterateSelections([doc], callback);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [marker1],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    format: {},
                    cachedElement: cache,
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {},
                    cachedElement: cache,
                },
                {
                    blockType: 'Paragraph',
                    segments: [marker2],
                    format: {},
                },
                { blockType: 'Paragraph', segments: [], format: {}, cachedElement: cache },
                { blockType: 'Divider', tagName: 'hr', format: {}, isSelected: true },
                { blockType: 'Divider', tagName: 'hr', format: {}, cachedElement: cache },
            ],
        });
    });
});
