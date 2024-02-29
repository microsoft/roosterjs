import { ContentModelTable, DOMEventHandlerFunction, IEditor } from 'roosterjs-content-model-types';
import { getMergedCenterColumnTable, getModelTable } from './tableData';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';
import {
    afterTableTest,
    beforeTableTest,
    getCellRect,
    getCurrentTable,
    initialize,
    moveAndResize,
} from './TableEditTestHelper';

describe('Cell Resizer tests', () => {
    let editor: IEditor;
    let plugin: TableEditPlugin;
    const TEST_ID = 'cellResizerTest';
    let handler: Record<string, DOMEventHandlerFunction>;

    beforeEach(() => {
        const setup = beforeTableTest(TEST_ID);
        editor = setup.editor;
        plugin = setup.plugin;
        handler = setup.handler;
    });

    afterEach(() => {
        afterTableTest(editor, plugin, TEST_ID);
    });

    /************************ Resizing row related tests ************************/

    function resizeRowTest(
        table: ContentModelTable,
        growth: number,
        cellRow: number,
        cellColumn: number
    ) {
        initialize(editor, table);
        const delta = 50 * growth;
        const cellRect = getCellRect(editor, cellRow, cellColumn);
        const targetPos: number = cellRect.bottom + delta;

        const beforeHeight = getCurrentTable(editor).rows[cellRow].getBoundingClientRect().height;
        moveAndResize(
            { x: cellRect.left + cellRect.width / 2, y: cellRect.bottom },
            { x: cellRect.left + cellRect.width / 2, y: targetPos },
            'horizontal',
            editor,
            handler,
            TEST_ID
        );
        const afterHeight = getCurrentTable(editor).rows[cellRow].getBoundingClientRect().height;

        growth > 0
            ? expect(afterHeight).toBeGreaterThan(beforeHeight)
            : expect(afterHeight).toBeLessThan(beforeHeight);
    }

    it('increases the height of the first row', () => {
        resizeRowTest(getModelTable(), 1, 0, 0);
    });

    it('increases the height of the last row', () => {
        const MODEL_TABLE = getModelTable();
        resizeRowTest(MODEL_TABLE, 1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1);
    });

    it('decreases the height of the first row', () => {
        resizeRowTest(getModelTable(), -1, 0, 0);
    });

    it('decreases the height of the last row', () => {
        const MODEL_TABLE = getModelTable();
        resizeRowTest(MODEL_TABLE, -1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1);
    });

    /************************ Resizing column related tests ************************/

    function resizeColumnTest(
        table: ContentModelTable,
        direction: number,
        cellRow: number,
        cellColumn: number
    ) {
        initialize(editor, table);
        const delta = 20 * direction;
        const cellRect = getCellRect(editor, cellRow, cellColumn);
        const targetPos: number = cellRect.right + delta;

        const beforeWidth = getCurrentTable(editor).rows[cellRow].cells[
            cellColumn
        ].getBoundingClientRect().width;
        const beforeNextWidth =
            cellColumn < table.widths.length - 1
                ? getCurrentTable(editor).rows[cellRow].cells[
                      cellColumn + 1
                  ].getBoundingClientRect().width
                : undefined;

        moveAndResize(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 },
            'vertical',
            editor,
            handler,
            TEST_ID
        );

        const afterWidth = getCurrentTable(editor).rows[cellRow].cells[
            cellColumn
        ].getBoundingClientRect().width;
        const afterNextWidth =
            cellColumn < table.widths.length - 1
                ? getCurrentTable(editor).rows[cellRow].cells[
                      cellColumn + 1
                  ].getBoundingClientRect().width
                : undefined;

        direction > 0
            ? expect(afterWidth).toBeGreaterThan(beforeWidth)
            : expect(afterWidth).toBeLessThan(beforeWidth);

        if (beforeNextWidth && afterNextWidth) {
            direction > 0
                ? expect(afterNextWidth).toBeLessThan(beforeNextWidth)
                : expect(afterNextWidth).toBeGreaterThan(beforeNextWidth);
        }
    }

    it('increases the width of the first column', () => {
        resizeColumnTest(getModelTable(), 1, 0, 0);
    });

    it('increases the width of the last column', () => {
        const MODEL_TABLE = getModelTable();
        resizeColumnTest(
            MODEL_TABLE,
            1,
            MODEL_TABLE.rows.length - 1,
            MODEL_TABLE.widths.length - 1
        );
    });

    it('decreases the width of the first column', () => {
        resizeColumnTest(getModelTable(), -1, 0, 0);
    });

    it('decreases the width of the last column', () => {
        const MODEL_TABLE = getModelTable();
        resizeColumnTest(
            MODEL_TABLE,
            -1,
            MODEL_TABLE.rows.length - 1,
            MODEL_TABLE.widths.length - 1
        );
    });
});
