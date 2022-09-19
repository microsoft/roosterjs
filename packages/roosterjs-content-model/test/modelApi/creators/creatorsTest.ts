import { ContentModelTableCellFormat } from '../../../lib/publicTypes/format/ContentModelTableCellFormat';
import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createGeneralBlock } from '../../../lib/modelApi/creators/createGeneralBlock';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';

describe('Creators', () => {
    it('createContentModelDocument', () => {
        const result = createContentModelDocument(document);

        expect(result).toEqual({
            blockGroupType: 'Document',
            blocks: [],
            document: document,
        });
    });

    it('createContentModelDocument with different document', () => {
        const anotherDoc = ({} as any) as Document;
        const result = createContentModelDocument(anotherDoc);

        expect(result).toEqual({
            blockGroupType: 'Document',
            blocks: [],
            document: anotherDoc,
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

    it('createParagraph - not dummy block', () => {
        const result = createParagraph(false);

        expect(result).toEqual({
            blockType: 'Paragraph',
            segments: [],
        });
    });

    it('createParagraph - dummy block', () => {
        const result = createParagraph(true);

        expect(result).toEqual({
            blockType: 'Paragraph',
            segments: [],
            isImplicit: true,
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
            cells: [[], []],
            format: {},
            widths: [],
            heights: [],
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
});
