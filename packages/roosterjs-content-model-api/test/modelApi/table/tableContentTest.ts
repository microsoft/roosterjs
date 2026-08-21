import {
    getSelectedContentForTable,
    insertTableContent,
} from '../../../lib/modelApi/table/tableContent';
import {
    ContentModelBlock,
    ContentModelDocument,
    ContentModelSettings,
    DOMSelection,
    DomToModelOption,
    DomToModelSettings,
    EditorEnvironment,
    IEditor,
    ModelToDomOption,
    ModelToDomSettings,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createParagraph,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('getSelectedContentForTable', () => {
    let mockDocument: Document;

    function createMockEditor(
        selection: DOMSelection | null,
        model: ContentModelDocument
    ): IEditor {
        mockDocument = document.implementation.createHTMLDocument('test');

        return {
            getDocument: (): Document => mockDocument,
            getDOMSelection: (): DOMSelection | null => selection,
            getContentModelCopy: (): ContentModelDocument => model,
            getEnvironment: (): EditorEnvironment => {
                return {
                    document: mockDocument,
                    isSafari: false,
                    domToModelSettings: {} as ContentModelSettings<
                        DomToModelOption,
                        DomToModelSettings
                    >,
                    modelToDomSettings: {} as ContentModelSettings<
                        ModelToDomOption,
                        ModelToDomSettings
                    >,
                };
            },
        } as any;
    }

    it('should return empty array when no selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createText('text'));
        model.blocks.push(para);

        const editor = createMockEditor(null, model);

        const result = getSelectedContentForTable(editor);

        expect(result).toEqual([]);
    });

    it('should return empty array when selection is collapsed', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createText('text'));
        model.blocks.push(para);

        const range = document.createRange();

        const selection: DOMSelection = {
            type: 'range',
            range,
            isReverted: false,
        };

        const editor = createMockEditor(selection, model);

        const result = getSelectedContentForTable(editor);

        expect(result).toEqual([]);
    });

    it('should return single paragraph with selected text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('selected text');
        text.isSelected = true;
        para.segments.push(text);
        model.blocks.push(para);

        mockDocument = document.implementation.createHTMLDocument('test');
        const div = mockDocument.createElement('div');
        div.textContent = 'selected text';
        mockDocument.body.appendChild(div);

        const range = mockDocument.createRange();
        range.selectNodeContents(div);

        const selection: DOMSelection = {
            type: 'range',
            range,
            isReverted: false,
        };

        const editor = createMockEditor(selection, model);

        const result = getSelectedContentForTable(editor);

        expect(result.length).toBe(1);
        expect(result[0].length).toBe(1);
        expect(result[0][0].blockType).toBe('Paragraph');
    });

    it('should extract content from table cells preserving rows', () => {
        const model = createContentModelDocument();

        // Create a 2x2 table with content
        const table = createTable(2);

        // Row 0
        const cell00 = createTableCell();
        const para00 = createParagraph();
        const text00 = createText('Cell 0,0');
        text00.isSelected = true;
        para00.segments.push(text00);
        cell00.blocks.push(para00);
        cell00.isSelected = true;

        const cell01 = createTableCell();
        const para01 = createParagraph();
        const text01 = createText('Cell 0,1');
        text01.isSelected = true;
        para01.segments.push(text01);
        cell01.blocks.push(para01);
        cell01.isSelected = true;

        table.rows[0].cells.push(cell00, cell01);

        // Row 1
        const cell10 = createTableCell();
        const para10 = createParagraph();
        const text10 = createText('Cell 1,0');
        text10.isSelected = true;
        para10.segments.push(text10);
        cell10.blocks.push(para10);
        cell10.isSelected = true;

        const cell11 = createTableCell();
        const para11 = createParagraph();
        const text11 = createText('Cell 1,1');
        text11.isSelected = true;
        para11.segments.push(text11);
        cell11.blocks.push(para11);
        cell11.isSelected = true;

        table.rows[1].cells.push(cell10, cell11);

        model.blocks.push(table);

        mockDocument = document.implementation.createHTMLDocument('test');
        const tableElement = mockDocument.createElement('table');
        mockDocument.body.appendChild(tableElement);

        const selection: DOMSelection = {
            type: 'table',
            table: tableElement,
            firstColumn: 0,
            lastColumn: 1,
            firstRow: 0,
            lastRow: 1,
        };

        const editor = createMockEditor(selection, model);

        const result = getSelectedContentForTable(editor);

        // Should have 2 rows with 2 blocks each
        expect(result.length).toBe(2);
        expect(result[0].length).toBe(2);
        expect(result[1].length).toBe(2);
    });
});

describe('insertTableContent', () => {
    it('should insert content into existing rows', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());

        const para1 = createParagraph();
        para1.segments.push(createText('Row 1'));

        const para2 = createParagraph();
        para2.segments.push(createText('Row 2'));

        const contentRows: ContentModelBlock[][] = [[para1], [para2]];

        insertTableContent(table, contentRows, 2);

        expect(table.rows[0].cells[0].blocks[0]).toBe(para1);
        expect(table.rows[1].cells[0].blocks[0]).toBe(para2);
    });

    it('should create new rows when content exceeds existing rows', () => {
        const table = createTable(1);
        table.rows[0].cells.push(createTableCell(), createTableCell());

        const para1 = createParagraph();
        para1.segments.push(createText('Row 1'));

        const para2 = createParagraph();
        para2.segments.push(createText('Row 2'));

        const para3 = createParagraph();
        para3.segments.push(createText('Row 3'));

        const contentRows: ContentModelBlock[][] = [[para1], [para2], [para3]];

        insertTableContent(table, contentRows, 2);

        expect(table.rows.length).toBe(3);
        expect(table.rows[0].cells[0].blocks[0]).toBe(para1);
        expect(table.rows[1].cells[0].blocks[0]).toBe(para2);
        expect(table.rows[2].cells[0].blocks[0]).toBe(para3);

        // New rows should have correct number of cells
        expect(table.rows[1].cells.length).toBe(2);
        expect(table.rows[2].cells.length).toBe(2);
    });

    it('should insert multiple blocks per row into corresponding cells', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());

        const para00 = createParagraph();
        para00.segments.push(createText('Cell 0,0'));

        const para01 = createParagraph();
        para01.segments.push(createText('Cell 0,1'));

        const para10 = createParagraph();
        para10.segments.push(createText('Cell 1,0'));

        const para11 = createParagraph();
        para11.segments.push(createText('Cell 1,1'));

        const contentRows: ContentModelBlock[][] = [
            [para00, para01],
            [para10, para11],
        ];

        insertTableContent(table, contentRows, 2);

        expect(table.rows[0].cells[0].blocks[0]).toBe(para00);
        expect(table.rows[0].cells[1].blocks[0]).toBe(para01);
        expect(table.rows[1].cells[0].blocks[0]).toBe(para10);
        expect(table.rows[1].cells[1].blocks[0]).toBe(para11);
    });

    it('should apply custom cell format to new rows', () => {
        const table = createTable(1);
        table.rows[0].cells.push(createTableCell());

        const para1 = createParagraph();
        para1.segments.push(createText('Row 1'));

        const para2 = createParagraph();
        para2.segments.push(createText('Row 2'));

        const contentRows: ContentModelBlock[][] = [[para1], [para2]];
        const customFormat = { minWidth: '50px' };

        insertTableContent(table, contentRows, 2, customFormat);

        expect(table.rows.length).toBe(2);
        expect(table.rows[1].cells[0].format).toEqual(customFormat);
        expect(table.rows[1].cells[1].format).toEqual(customFormat);
    });

    it('should not insert content beyond available cells', () => {
        const table = createTable(1);
        table.rows[0].cells.push(createTableCell()); // Only 1 cell

        const para1 = createParagraph();
        para1.segments.push(createText('Cell 1'));

        const para2 = createParagraph();
        para2.segments.push(createText('Cell 2'));

        const para3 = createParagraph();
        para3.segments.push(createText('Cell 3'));

        // 3 blocks but only 1 cell
        const contentRows: ContentModelBlock[][] = [[para1, para2, para3]];

        insertTableContent(table, contentRows, 1);

        // Only first block should be inserted
        expect(table.rows[0].cells[0].blocks[0]).toBe(para1);
        expect(table.rows[0].cells.length).toBe(1);
    });

    it('should handle empty content rows', () => {
        const table = createTable(2);
        table.rows[0].cells.push(createTableCell(), createTableCell());
        table.rows[1].cells.push(createTableCell(), createTableCell());

        const contentRows: ContentModelBlock[][] = [];

        insertTableContent(table, contentRows, 2);

        // Table should remain unchanged
        expect(table.rows.length).toBe(2);
        expect(table.rows[0].cells[0].blocks.length).toBe(0);
    });
});
