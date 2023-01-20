import { ContentModelListItemLevelFormat } from '../../../lib/publicTypes/format/ContentModelListItemLevelFormat';
import { ContentModelSegmentFormat } from '../../../lib/publicTypes/format/ContentModelSegmentFormat';
import { ContentModelTableCellFormat } from '../../../lib/publicTypes/format/ContentModelTableCellFormat';
import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createEntity } from '../../../lib/modelApi/creators/createEntity';
import { createFormatContainer } from '../../../lib/modelApi/creators/createFormatContainer';
import { createGeneralBlock } from '../../../lib/modelApi/creators/createGeneralBlock';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createParagraphDecorator } from '../../../lib/modelApi/creators/createParagraphDecorator';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';

describe('Creators', () => {
    it('createContentModelDocument', () => {
        const result = createContentModelDocument();

        expect(result).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('createContentModelDocument with default format', () => {
        const result = createContentModelDocument({
            fontSize: '10pt',
        });

        expect(result).toEqual({
            blockGroupType: 'Document',
            blocks: [],
            format: {
                fontSize: '10pt',
            },
        });
    });

    it('createGeneralBlock', () => {
        const element = document.createElement('div');
        const result = createGeneralBlock(element);

        expect(result).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: element,
            blocks: [],
            format: {},
        });
    });

    it('createGeneralSegment', () => {
        const element = document.createElement('div');
        const result = createGeneralSegment(element);

        expect(result).toEqual({
            segmentType: 'General',
            blocks: [],
            element: element,
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            format: {},
        });
    });

    it('createGeneralSegment with format', () => {
        const element = document.createElement('div');
        const format = { a: 1 } as any;
        const result = createGeneralSegment(element, format);

        expect(result).toEqual({
            segmentType: 'General',
            blocks: [],
            element: element,
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            format: { a: 1 } as any,
        });

        (<any>result.format).a = 2;

        expect(format).toEqual({ a: 1 });
    });

    it('createParagraph - not implicit block', () => {
        const result = createParagraph(false);

        expect(result).toEqual({
            blockType: 'Paragraph',
            segments: [],
            format: {},
        });
    });

    it('createParagraph - implicit block', () => {
        const result = createParagraph(true);

        expect(result).toEqual({
            blockType: 'Paragraph',
            segments: [],
            format: {},
            isImplicit: true,
        });
    });

    it('createParagraph - with segment format', () => {
        const result = createParagraph(false, undefined, { fontSize: '10px' });

        expect(result).toEqual({
            blockType: 'Paragraph',
            segments: [],
            format: {},
            segmentFormat: { fontSize: '10px' },
        });
    });

    it('createParagraph - with decorator', () => {
        const result = createParagraph(false, undefined, undefined, {
            tagName: 'p',
            format: {
                fontSize: '10px',
            },
        });

        expect(result).toEqual({
            blockType: 'Paragraph',
            segments: [],
            format: {},
            decorator: {
                tagName: 'p',
                format: {
                    fontSize: '10px',
                },
            },
        });
    });

    it('createParagraphDecorator', () => {
        const format = {
            fontSize: '10px',
        };
        const result = createParagraphDecorator('p', format);

        expect(result).toEqual({
            tagName: 'p',
            format: format,
        });

        result.format.fontSize = '12px';

        expect(format).toEqual({
            fontSize: '10px',
        });
    });

    it('createText', () => {
        const text = 'test';
        const result = createText(text);

        expect(result).toEqual({
            segmentType: 'Text',
            format: {},
            text: text,
        });
    });

    it('createText', () => {
        const format = { a: 1 } as any;
        const text = 'test';
        const result = createText(text, format);

        expect(result).toEqual({
            segmentType: 'Text',
            format: { a: 1 } as any,
            text: text,
        });

        (<any>result.format).a = 2;

        expect(format).toEqual({ a: 1 });
    });

    it('createTable', () => {
        const tableModel = createTable(2);

        expect(tableModel).toEqual({
            blockType: 'Table',
            rows: [
                { format: {}, height: 0, cells: [] },
                { format: {}, height: 0, cells: [] },
            ],
            format: {},
            widths: [],
            dataset: {},
        });
    });

    it('createTableCell from Table Cell - no span', () => {
        const tdModel = createTableCell(1 /*colSpan*/, 1 /*rowSpan*/, false /*isHeader*/);
        expect(tdModel).toEqual({
            blockGroupType: 'TableCell',
            blocks: [],
            spanLeft: false,
            spanAbove: false,
            isHeader: false,
            format: {},
            dataset: {},
        });
    });

    it('createTableCell from Table Cell - span left', () => {
        const tdModel = createTableCell(2 /*colSpan*/, 1 /*rowSpan*/, false /*isHeader*/);
        expect(tdModel).toEqual({
            blockGroupType: 'TableCell',
            blocks: [],
            spanLeft: true,
            spanAbove: false,
            isHeader: false,
            format: {},
            dataset: {},
        });
    });

    it('createTableCell from Table Cell - span above', () => {
        const tdModel = createTableCell(1 /*colSpan*/, 3 /*rowSpan*/, false /*isHeader*/);
        expect(tdModel).toEqual({
            blockGroupType: 'TableCell',
            blocks: [],
            spanLeft: false,
            spanAbove: true,
            isHeader: false,
            format: {},
            dataset: {},
        });
    });

    it('createTableCell from Table Header', () => {
        const tdModel = createTableCell(1 /*colSpan*/, 1 /*rowSpan*/, true /*isHeader*/);
        expect(tdModel).toEqual({
            blockGroupType: 'TableCell',
            blocks: [],
            spanLeft: false,
            spanAbove: false,
            isHeader: true,
            format: {},
            dataset: {},
        });
    });

    it('createTableCell with format', () => {
        const format: ContentModelTableCellFormat = {
            textAlign: 'start',
        };
        const tdModel = createTableCell(1 /*colSpan*/, 1 /*rowSpan*/, true /*isHeader*/, format);

        expect(tdModel).toEqual({
            blockGroupType: 'TableCell',
            blocks: [],
            spanLeft: false,
            spanAbove: false,
            isHeader: true,
            format: { textAlign: 'start' },
            dataset: {},
        });

        // Change original format object should not impact the created table cell
        format.textAlign = 'end';

        expect(tdModel).toEqual({
            blockGroupType: 'TableCell',
            blocks: [],
            spanLeft: false,
            spanAbove: false,
            isHeader: true,
            format: { textAlign: 'start' },
            dataset: {},
        });
    });

    it('createSelectionMarker', () => {
        const marker = createSelectionMarker();

        expect(marker).toEqual({
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        });
    });

    it('createSelectionMarker with selection', () => {
        const format = { a: 1 } as any;
        const marker = createSelectionMarker(format);

        expect(marker).toEqual({
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: { a: 1 } as any,
        });

        (<any>marker.format).a = 2;

        expect(format).toEqual({ a: 1 });
    });

    it('createBr', () => {
        const br = createBr();

        expect(br).toEqual({
            segmentType: 'Br',
            format: {},
        });
    });

    it('createBr with format', () => {
        const format = { a: 1 } as any;
        const br = createBr(format);

        expect(br).toEqual({
            segmentType: 'Br',
            format: { a: 1 } as any,
        });

        (<any>br.format).a = 2;

        expect(format).toEqual({ a: 1 });
    });

    it('createListItem', () => {
        const listItem = createListItem([]);

        expect(listItem).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [],
            levels: [],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: {},
            },
            format: {},
        });
    });

    it('createListItem with format and levels', () => {
        const format: ContentModelSegmentFormat = { fontSize: 'a' };
        const levels: ContentModelListItemLevelFormat[] = [{ listType: 'OL' }];
        const listItem = createListItem(levels, format);

        expect(listItem).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [],
            levels: [{ listType: 'OL' }],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: { fontSize: 'a' },
            },
            format: {},
        });

        format.fontSize = 'b';
        levels[0].listType = 'UL';
        levels.push({ listType: 'UL' });

        // format and levels in list item should not be impacted by the change of format and levels object
        expect(listItem).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [],
            levels: [{ listType: 'OL' }],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: { fontSize: 'a' },
            },
            format: {},
        });
    });

    it('createQuote', () => {
        const quote = createQuote();

        expect(quote).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'blockquote',
            blocks: [],
            format: {},
        });
    });

    it('createQuote with format', () => {
        const quote = createQuote({
            borderLeft: 'solid 1px black',
        });

        expect(quote).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'blockquote',
            blocks: [],
            format: { borderLeft: 'solid 1px black' },
        });
    });

    it('createFormatContainer with format', () => {
        const quote = createFormatContainer('pre', {
            borderLeft: 'solid 1px black',
        });

        expect(quote).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'pre',
            blocks: [],
            format: { borderLeft: 'solid 1px black' },
        });
    });

    it('createEntity', () => {
        const id = 'entity_1';
        const type = 'entity';
        const isReadonly = true;
        const wrapper = document.createElement('div');
        const entityModel = createEntity(wrapper, isReadonly, undefined, id, type);

        expect(entityModel).toEqual({
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            id,
            type,
            isReadonly,
            wrapper,
        });
    });

    it('createEntity with format', () => {
        const id = 'entity_1';
        const type = 'entity';
        const isReadonly = true;
        const wrapper = document.createElement('div');
        const entityModel = createEntity(
            wrapper,
            isReadonly,
            {
                fontSize: '10pt',
            },
            id,
            type
        );

        expect(entityModel).toEqual({
            blockType: 'Entity',
            segmentType: 'Entity',
            format: { fontSize: '10pt' },
            id,
            type,
            isReadonly,
            wrapper,
        });
    });

    it('createImage', () => {
        const imageModel = createImage('test');

        expect(imageModel).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {},
        });
    });

    it('createDivider', () => {
        const hr = createDivider('hr');

        expect(hr).toEqual({
            blockType: 'Divider',
            tagName: 'hr',
            format: {},
        });
    });

    it('createDivider with format', () => {
        const hr = createDivider('div', { marginTop: '10px' });

        expect(hr).toEqual({
            blockType: 'Divider',
            tagName: 'div',
            format: { marginTop: '10px' },
        });
    });
});
