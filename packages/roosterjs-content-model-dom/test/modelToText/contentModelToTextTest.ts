import { contentModelToText } from '../../lib/modelToText/contentModelToText';
import { createBr } from '../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../lib/modelApi/creators/createDivider';
import { createEntity } from '../../lib/modelApi/creators/createEntity';
import { createImage } from '../../lib/modelApi/creators/createImage';
import { createListItem } from '../../lib/modelApi/creators/createListItem';
import { createListLevel } from '../../lib/modelApi/creators/createListLevel';
import { createParagraph } from '../../lib/modelApi/creators/createParagraph';
import { createTable } from '../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../lib/modelApi/creators/createTableCell';
import { createText } from '../../lib/modelApi/creators/createText';

describe('modelToText', () => {
    it('Empty model', () => {
        const model = createContentModelDocument();

        const text = contentModelToText(model);

        expect(text).toBe('');
    });

    it('model with paragraphs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();

        para1.segments.push(createText('text1'));
        para2.segments.push(createText('text2'));

        model.blocks.push(para1, para2);

        const text = contentModelToText(model);

        expect(text).toBe('text1\r\ntext2');
    });

    it('model with paragraphs and customized separator', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();

        para1.segments.push(createText('text1'));
        para2.segments.push(createText('text2'));

        model.blocks.push(para1, para2);

        const text = contentModelToText(model, '-');

        expect(text).toBe('text1-text2');
    });

    it('model with paragraph and br', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();

        para1.segments.push(createText('text1'), createBr(), createText('text2'));

        model.blocks.push(para1);

        const text = contentModelToText(model);

        expect(text).toBe('text1\r\ntext2');
    });

    it('model with empty lines (BR only in paragraph)', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();

        para1.segments.push(createBr());
        para2.segments.push(createBr());

        model.blocks.push(para1, para2);

        const text = contentModelToText(model);

        expect(text).toBe('\r\n');
    });

    it('model with paragraph and image', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();

        para1.segments.push(createText('text1'), createImage('src'), createText('text2'));

        model.blocks.push(para1);

        const text = contentModelToText(model);

        expect(text).toBe('text1 text2');
    });

    it('model with divider (DIV)', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();

        para1.segments.push(createText('text1'));
        para2.segments.push(createText('text2'));

        model.blocks.push(para1, createDivider('div'), para2);

        const text = contentModelToText(model);

        expect(text).toBe('text1\r\n\r\ntext2');
    });

    it('model with divider (HR)', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();

        para1.segments.push(createText('text1'));
        para2.segments.push(createText('text2'));

        model.blocks.push(para1, createDivider('hr'), para2);

        const text = contentModelToText(model);

        expect(text).toBe('text1\r\n________________________________________\r\ntext2');
    });

    it('model with list', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const list1 = createListItem([createListLevel('OL')]);
        const list2 = createListItem([createListLevel('UL')]);

        para1.segments.push(createText('text1'));
        para2.segments.push(createText('text2'));

        list1.blocks.push(para1);
        list2.blocks.push(para2);

        model.blocks.push(list1, list2);

        const text = contentModelToText(model);

        expect(text).toBe('text1\r\ntext2');
    });

    it('model with table', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const para4 = createParagraph();
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const cell4 = createTableCell();
        const table = createTable(2);

        para1.segments.push(createText('text1'));
        para2.segments.push(createText('text2'));
        para3.segments.push(createText('text3'));
        para4.segments.push(createText('text4'));

        cell1.blocks.push(para1);
        cell2.blocks.push(para2);
        cell3.blocks.push(para3);
        cell4.blocks.push(para4);

        table.rows[0].cells.push(cell1, cell2);
        table.rows[1].cells.push(cell3, cell4);

        model.blocks.push(table);

        const text = contentModelToText(model);

        expect(text).toBe('text1\r\ntext2\r\ntext3\r\ntext4');
    });

    it('model with entity', () => {
        const div = document.createElement('div');

        div.innerText = 'test entity';

        const model = createContentModelDocument();
        const para1 = createParagraph();

        para1.segments.push(createText('text1'), createEntity(div), createText('text2'));

        model.blocks.push(para1);

        const text = contentModelToText(model);

        expect(text).toBe('text1test entitytext2');
    });
});
