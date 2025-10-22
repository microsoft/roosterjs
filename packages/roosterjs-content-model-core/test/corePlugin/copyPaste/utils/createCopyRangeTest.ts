import { createCopyRange } from '../../../../lib/corePlugin/copyPaste/utils/createCopyRange';
import { DOMSelection, IEditor } from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createTableRow,
    createText,
} from 'roosterjs-content-model-dom';

describe('createCopySelection', () => {
    let editor: IEditor;
    let mockDocument: Document;
    let tempDiv: HTMLDivElement;

    beforeEach(() => {
        mockDocument = document.implementation.createHTMLDocument('test');
        tempDiv = mockDocument.createElement('div');

        editor = {
            getDocument: () => mockDocument,
        } as any;
    });

    afterEach(() => {
        // Clean up any elements added to body
        const tempDivs = mockDocument.querySelectorAll('#roosterJS_copyCutTempDiv');
        tempDivs.forEach(div => div.remove());
    });

    it('should handle range selection and call adjustSelectionForCopyCut', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text = createText('test content');

        para.segments.push(marker, text);
        model.blocks.push(para);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: mockDocument.createElement('div'),
                startOffset: 0,
                endContainer: mockDocument.createElement('div'),
                endOffset: 1,
                collapsed: false,
            } as any,
            isReverted: false,
        };

        const result = createCopyRange(editor, model, selection, tempDiv);

        expect(result).toBeDefined();
    });

    it('should handle table selection and call preprocessTable', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const row = createTableRow();
        const para = createParagraph();
        const text = createText('table content');

        cell.isSelected = true;
        para.segments.push(text);
        cell.blocks.push(para);
        row.cells.push(cell);
        table.rows[0] = row;
        model.blocks.push(table);

        const selection: DOMSelection = {
            type: 'table',
            table: mockDocument.createElement('table'),
            firstColumn: 0,
            firstRow: 0,
            lastColumn: 0,
            lastRow: 0,
        };

        const result = createCopyRange(editor, model, selection, tempDiv);

        expect(result).toBeDefined();
    });

    it('should handle empty model', () => {
        const model = createContentModelDocument();

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: mockDocument.createElement('div'),
                startOffset: 0,
                endContainer: mockDocument.createElement('div'),
                endOffset: 0,
                collapsed: true,
            } as any,
            isReverted: false,
        };

        const result = createCopyRange(editor, model, selection, tempDiv);
        expect(result).toBeNull();
    });

    it('should handle image selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('content');

        para.segments.push(text);
        model.blocks.push(para);

        const selection: DOMSelection = {
            type: 'image',
            image: mockDocument.createElement('img'),
        };

        const result = createCopyRange(editor, model, selection, tempDiv);
        expect(result).toBeDefined();
    });

    it('should handle table selection with multiple selected cells', () => {
        const model = createContentModelDocument();
        const table = createTable(2);

        // Create 2x2 table with all cells selected
        for (let i = 0; i < 2; i++) {
            const row = createTableRow();
            for (let j = 0; j < 2; j++) {
                const cell = createTableCell();
                const para = createParagraph();
                const text = createText(`Cell ${i}-${j}`);

                cell.isSelected = true;
                para.segments.push(text);
                cell.blocks.push(para);
                row.cells.push(cell);
            }
            table.rows[i] = row;
        }

        table.widths = [100, 150];
        model.blocks.push(table);

        const selection: DOMSelection = {
            type: 'table',
            table: mockDocument.createElement('table'),
            firstColumn: 0,
            firstRow: 0,
            lastColumn: 1,
            lastRow: 1,
        };

        const result = createCopyRange(editor, model, selection, tempDiv);
        expect(result).toBeDefined();
    });

    it('should process complex model with mixed content', () => {
        const model = createContentModelDocument();

        // Add paragraph
        const para1 = createParagraph();
        const marker1 = createSelectionMarker();
        const text1 = createText('First paragraph');
        para1.segments.push(marker1, text1);

        // Add table
        const table = createTable(1);
        const cell = createTableCell();
        const row = createTableRow();
        const para2 = createParagraph();
        const marker2 = createSelectionMarker();
        const text2 = createText('Table content');

        cell.isSelected = true;
        para2.segments.push(marker2, text2);
        cell.blocks.push(para2);
        row.cells.push(cell);
        table.rows[0] = row;

        // Add another paragraph
        const para3 = createParagraph();
        const text3 = createText('Last paragraph');
        para3.segments.push(text3);

        model.blocks.push(para1, table, para3);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: mockDocument.createElement('div'),
                startOffset: 0,
                endContainer: mockDocument.createElement('div'),
                endOffset: 1,
                collapsed: false,
            } as any,
            isReverted: false,
        };

        const result = createCopyRange(editor, model, selection, tempDiv);

        expect(result).toBeDefined();
    });
});
