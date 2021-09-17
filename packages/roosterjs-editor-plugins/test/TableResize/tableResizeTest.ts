import * as TestHelper from '../../../roosterjs-editor-api/test/TestHelper';
import { CELL_RESIZER_WIDTH, ResizeState } from '../../lib/plugins/TableResize/TableResize';
import { DEFAULT_TABLE, EXCEL_TABLE, WORD_TABLE } from './tableData';
import { IEditor } from 'roosterjs-editor-types';
import { TableResize } from '../../lib/TableResize';

const RESIZING_DIVIATION = 4;

/* Used to specify mouse coordinates or cell locations in a table in this test set */
type Position = {
    x: number;
    y: number;
};

interface TestTable {
    htmlData: string;
    rows: number[];
    columns: number[];
    width: number;
    height: number;
    cellWidth: number;
    cellHeight: number;
}

/*******************************************************************
                              Test Table 1
                (default table inserted from table control)

                   8.5____131.5____254.5____377.5/8.5
                    | (0, 0) | (0, 1) | (0, 2) |
                    |________|________|________|30.5
                    | (1, 0) | (1, 1) | (1, 2) |
                    |________|________|________|52.5
                    | (2, 0) | (2, 1) | (2, 2) |
                    |________|________|________|74.5

        cell width: 123, cell height: 22 (getBoudingClientRect)
        table width: 370, table height: 67 (getBoudingClientRect)

                            Test Table 2
                            (Excel table)

                   8.5_____76.2____143.8____211.5/8.5
                    | (0, 0) | (0, 1) | (0, 2) |
                    |________|________|________|30.5
                    | (1, 0) | (1, 1) | (1, 2) |
                    |________|________|________|52.5
                    | (2, 0) | (2, 1) | (2, 2) |
                    |________|________|________|74.5

        cell width: 67.7, cell height: 22 (getBoudingClientRect)
        table width: 204, table height: 67 (getBoudingClientRect)

                            Test Table 3
                    (Word table with thick borders)

                    8.5_____98.9____189.3___279.7/8.5
                    | (0, 0) | (0, 1) | (0, 2) |
                    |________|________|________|50.4
                    | (1, 0) | (1, 1) | (1, 2) |
                    |________|________|________|92.4
                    | (2, 0) | (2, 1) | (2, 2) |
                    |________|________|________|135.5

        cell width: 90.4, cell height: 41.9 (getBoudingClientRect)
        table width: 272.2, table height: 128 (getBoudingClientRect)

*********************************************************************/

const defaultTable: TestTable = {
    htmlData: DEFAULT_TABLE,
    rows: [8.5, 30.5, 52.5, 74.5],
    columns: [8.5, 131.5, 254.5, 377.5],
    width: 370,
    height: 67,
    cellWidth: 123,
    cellHeight: 22,
};

const excelTable: TestTable = {
    htmlData: EXCEL_TABLE,
    rows: [8.5, 30.5, 52.5, 74.5],
    columns: [8.5, 76.2, 143.8, 211.5],
    width: 204,
    height: 67,
    cellWidth: 67.7,
    cellHeight: 22,
};

const wordTable: TestTable = {
    htmlData: WORD_TABLE,
    rows: [8.5, 50.4, 92.4, 135.5],
    columns: [8.5, 98.9, 189.3, 279.7],
    width: 272.2,
    height: 128,
    cellWidth: 90.4,
    cellHeight: 41.9,
};

const testTables = [defaultTable, excelTable, wordTable];

describe('Table Resizer/Inserter tests', () => {
    let editor: IEditor;
    let plugin: TableResize;
    const insideTheOffset = 5;
    const OFFSET_X = 5;
    const OFFSET_Y = 2;
    const TEST_TABLE_WIDTH = 3;
    const TEST_TABLE_HEIGHT = 3;
    const ADD_BUTTON = '</div>+</div>';
    const TEST_ID = 'inserterTest';

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        plugin = new TableResize();
        plugin.initialize(editor);
    });

    afterEach(() => {
        editor?.dispose();
        plugin?.dispose();
        TestHelper.removeElement(TEST_ID);
        document.body = document.createElement('body');
    });

    function getCellRect(i: number, j: number): DOMRect | undefined {
        const tables = editor.getDocument().getElementsByTagName('table');
        if (!tables || tables.length < 1) {
            return undefined;
        }

        const table = tables[0];
        if (i >= table.rows.length || j >= table.rows[i].cells.length) {
            return undefined;
        }

        const cell = table.rows[i].cells[j];
        return cell.getBoundingClientRect();
    }

    function initialize(tableIndex: number, isRtl: boolean = false): DOMRect {
        if (isRtl) {
            editor.getDocument().body.style.direction = 'rtl';
        }
        editor.setContent(testTables[tableIndex].htmlData);
        let tableRect: DOMRect = null;
        editor.queryElements('table', table => {
            const rect = table.getBoundingClientRect();
            tableRect = rect;
        });
        return tableRect;
    }

    function runInserterTest(
        mouseStart: Position,
        mouseEnd: Position,
        expectedResultBeforeMove: boolean,
        expectedResultAfterMove: boolean
    ) {
        const editorDiv = editor.getDocument().getElementById(TEST_ID);

        let mouseEvent = new MouseEvent('mousemove', {
            clientX: mouseStart.x,
            clientY: mouseStart.y,
        });

        editorDiv.dispatchEvent(mouseEvent);

        const body = editor.getDocument().body;

        mouseEvent = new MouseEvent('mousemove', {
            clientX: mouseEnd.x,
            clientY: mouseEnd.y,
        });

        // test
        expect(body.innerHTML.includes(ADD_BUTTON)).toBe(expectedResultBeforeMove);

        editorDiv.dispatchEvent(mouseEvent);

        expect(body.innerHTML.includes(ADD_BUTTON)).toBe(expectedResultAfterMove);
    }

    // inserter tests
    it('removes the vertical inserter when moving the cursor out of the offset zone', () => {
        const rect = initialize(0);
        runInserterTest(
            { x: rect.right, y: rect.top - OFFSET_Y },
            { x: rect.right / 2, y: rect.bottom },
            true,
            false
        );
    });

    it('keeps the vertical inserter when moving the cursor inside the safe zone', () => {
        const rect = initialize(0);
        runInserterTest(
            { x: rect.right, y: rect.top - OFFSET_Y },
            { x: rect.right - insideTheOffset, y: rect.top },
            true,
            true
        );
    });

    it('removes the horizontal inserter when moving the cursor out of the offset zone', () => {
        const rect = initialize(0);
        runInserterTest(
            { x: rect.left, y: rect.bottom },
            { x: (rect.right - rect.left) / 2, y: (rect.bottom - rect.top) / 2 },
            true,
            false
        );
    });

    it('keeps the horizontal inserter when moving the cursor inside the safe zone', () => {
        const rect = initialize(0);
        runInserterTest(
            { x: rect.left, y: rect.bottom },
            { x: rect.left, y: rect.bottom - insideTheOffset },
            true,
            true
        );
    });

    it('removes the horizontal inserter when moving the cursor out of the offset zone with culture language RTL', () => {
        const rect = initialize(0, true);
        runInserterTest(
            { x: rect.right, y: rect.bottom },
            { x: (rect.right - rect.left) / 2, y: (rect.bottom - rect.top) / 2 },
            true,
            false
        );
    });

    it('keeps the horizontal inserter when moving the cursor inside the safe zone with culture language RTL', () => {
        const rect = initialize(0, true);
        runInserterTest(
            { x: rect.right, y: rect.bottom },
            { x: rect.right + insideTheOffset / 2, y: rect.bottom },
            true,
            true
        );
    });

    it('removes the vertical inserter when moving the cursor out of the offset zone with culture language RTL', () => {
        const rect = initialize(0, true);
        const cellRect = getCellRect(0, 0);

        runInserterTest(
            { x: cellRect.left, y: cellRect.top },
            { x: rect.left + rect.width / 2, y: rect.bottom },
            true,
            false
        );
    });

    it('removes the vertical inserter for the first cell if the X coordinate of the cursor position is less than the half distance of the cell', () => {
        initialize(0);
        const cellRect = getCellRect(0, 0);

        runInserterTest(
            {
                x: cellRect.left + (cellRect.right - cellRect.left) / 2 + OFFSET_X,
                y: cellRect.top - OFFSET_Y,
            },
            {
                x: cellRect.left + (cellRect.right - cellRect.left) / 2 - OFFSET_X,
                y: cellRect.top - OFFSET_Y,
            },
            true,
            false
        );
    });

    it('sets the vertical inserter at the previous td for non-first cells if the X coordinate of the cursor position is less than the half distance of the cell', () => {
        initialize(0);
        const cellRect = getCellRect(0, 1);

        runInserterTest(
            {
                x: cellRect.left + (cellRect.right - cellRect.left) / 2 + OFFSET_X,
                y: cellRect.top - OFFSET_Y,
            },
            {
                x: cellRect.left + (cellRect.right - cellRect.left) / 2 - OFFSET_X,
                y: cellRect.top - OFFSET_Y,
            },
            true,
            true
        );
    });

    /************************ Resizer related tests ************************/

    function runShowResizerTest(resizerId: string, mousePos: Position, expectedPos: Position) {
        const editorDiv = editor.getDocument().getElementById(TEST_ID);
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: mousePos.x,
            clientY: mousePos.y,
        });
        editorDiv.dispatchEvent(mouseEvent);
        const resizer = editor.getDocument().getElementById(resizerId);
        expect(!!resizer).toBe(true);
        if (!!resizer) {
            const resizerX = resizer.getBoundingClientRect().x;
            const resizerY = resizer.getBoundingClientRect().y;
            expect(Math.abs(resizerX - expectedPos.x)).toBeLessThanOrEqual(RESIZING_DIVIATION);
            expect(Math.abs(resizerY - expectedPos.y)).toBeLessThanOrEqual(RESIZING_DIVIATION);
        }
    }

    function moveAndResize(mouseStart: Position, mouseEnd: Position, resizeState: ResizeState) {
        const editorDiv = editor.getDocument().getElementById(TEST_ID);
        let resizerId: string;
        switch (resizeState) {
            case ResizeState.Both:
                resizerId = 'tableResizer';
                break;
            case ResizeState.Horizontal:
                resizerId = 'horizontalResizer';
                break;
            case ResizeState.Vertical:
                resizerId = 'verticalResizer';
                break;
            default:
                resizerId = '';
        }
        // move mouse and show resizer
        const mouseMoveEvent = new MouseEvent('mousemove', {
            clientX: mouseStart.x,
            clientY: mouseStart.y,
        });
        editorDiv.dispatchEvent(mouseMoveEvent);

        const resizer = editor.getDocument().getElementById(resizerId);
        expect(!!resizer).toBe(true);

        // mouse down and start resizing (this will initiate currentCellsToResize and nextCellsToResize)
        const mouseClickEvent = new MouseEvent('mousedown', {
            clientX: mouseStart.x,
            clientY: mouseStart.y,
        });
        resizer.dispatchEvent(mouseClickEvent);

        const mouseMoveResize = new MouseEvent('mousemove', {
            clientX: mouseEnd.x,
            clientY: mouseEnd.y,
        });
        const doc = editor.getDocument();
        doc.dispatchEvent(mouseMoveResize);
        plugin.resizeCells(mouseMoveResize);

        // release mouse and stop resizing
        const mouseMoveEndEvent = new MouseEvent('mouseup', {
            clientX: mouseEnd.x,
            clientY: mouseEnd.y,
        });
        editorDiv.dispatchEvent(mouseMoveEndEvent);
    }

    function runResizeTableTest(
        mouseStart: Position,
        mouseEnd: Position,
        expectedTableWidth: number,
        expectedTableHeight: number
    ) {
        moveAndResize(mouseStart, mouseEnd, ResizeState.Both);

        const tableRect = editor
            .getDocument()
            .getElementsByTagName('table')[0]
            .getBoundingClientRect();
        expect(Math.abs(tableRect.width - expectedTableWidth)).toBeLessThanOrEqual(
            RESIZING_DIVIATION
        );
        expect(Math.abs(tableRect.height - expectedTableHeight)).toBeLessThanOrEqual(
            RESIZING_DIVIATION
        );
    }

    function runResizeRowTest(
        mouseStart: Position,
        mouseEnd: Position,
        expectedRow: Map<Position, DOMRect>,
        expectedTableWidth: number,
        expectedTableHeight: number
    ) {
        moveAndResize(mouseStart, mouseEnd, ResizeState.Horizontal);

        expectedRow.forEach((tRect, pos) => {
            const cellRect = getCellRect(pos.x, pos.y);
            expect(!!cellRect).toBe(true);
            expect(Math.abs(cellRect.width - tRect.width)).toBeLessThanOrEqual(RESIZING_DIVIATION);
            expect(Math.abs(cellRect.height - tRect.height)).toBeLessThanOrEqual(
                RESIZING_DIVIATION
            );
        });

        const table = editor.getDocument().getElementsByTagName('table')[0] as HTMLTableElement;
        const tableRect = table.getBoundingClientRect();
        expect(Math.abs(tableRect.width - expectedTableWidth)).toBeLessThanOrEqual(
            RESIZING_DIVIATION
        );
        expect(Math.abs(tableRect.height - expectedTableHeight)).toBeLessThanOrEqual(
            RESIZING_DIVIATION
        );
    }

    function runResizeColumnTest(
        mouseStart: Position,
        mouseEnd: Position,
        expectedLeftColumn: Map<Position, DOMRect>,
        expectedRightColumn: Map<Position, DOMRect> | undefined,
        expectedTableWidth: number,
        expectedTableHeight: number
    ) {
        moveAndResize(mouseStart, mouseEnd, ResizeState.Vertical);

        expectedLeftColumn.forEach((tRect, pos) => {
            const cellRect = getCellRect(pos.x, pos.y);
            expect(!!cellRect).toBe(true);
            expect(Math.abs(cellRect.width - tRect.width)).toBeLessThanOrEqual(RESIZING_DIVIATION);
            expect(Math.abs(cellRect.height - tRect.height)).toBeLessThanOrEqual(
                RESIZING_DIVIATION
            );
        });

        if (!!expectedRightColumn) {
            expectedRightColumn.forEach((tRect, pos) => {
                const cellRect = getCellRect(pos.x, pos.y);
                expect(!!cellRect).toBe(true);
                expect(Math.abs(cellRect.width - tRect.width)).toBeLessThanOrEqual(
                    RESIZING_DIVIATION
                );
                expect(Math.abs(cellRect.height - tRect.height)).toBeLessThanOrEqual(
                    RESIZING_DIVIATION
                );
            });
        }

        const table = editor.getDocument().getElementsByTagName('table')[0] as HTMLTableElement;
        const tableRect = table.getBoundingClientRect();
        expect(Math.abs(tableRect.width - expectedTableWidth)).toBeLessThanOrEqual(
            RESIZING_DIVIATION
        );
        expect(Math.abs(tableRect.height - expectedTableHeight)).toBeLessThanOrEqual(
            RESIZING_DIVIATION
        );
    }

    /************************** Resizier showing tests **************************/

    it('adds the vertical resizer when mouse lands inside each cell', () => {
        const tableRect = initialize(0);

        for (let i = 0; i < TEST_TABLE_WIDTH; i++) {
            for (let j = 0; j < TEST_TABLE_HEIGHT; j++) {
                const cellRect = getCellRect(i, j);
                runShowResizerTest(
                    'verticalResizer',
                    {
                        x: cellRect.left + cellRect.width / 2,
                        y: cellRect.top + cellRect.height / 2,
                    },
                    { x: cellRect.right - CELL_RESIZER_WIDTH + 1, y: tableRect.top }
                );
            }
        }
    });

    it('adds the horizontal resizer when mouse lands inside each cell', () => {
        const tableRect = initialize(0);
        for (let i = 0; i < TEST_TABLE_WIDTH; i++) {
            for (let j = 0; j < TEST_TABLE_HEIGHT; j++) {
                const cellRect = getCellRect(i, j);
                runShowResizerTest(
                    'horizontalResizer',
                    {
                        x: cellRect.left + cellRect.width / 2,
                        y: cellRect.top + cellRect.height / 2,
                    },
                    { x: tableRect.left, y: cellRect.bottom - CELL_RESIZER_WIDTH + 1 }
                );
            }
        }
    });

    /************************ Resizing row related tests ************************/

    function resizeFirstRowTest(i: number) {
        initialize(i);
        const delta = 50;
        const testTable = testTables[i];
        const cellRect = getCellRect(0, 0);
        const targetPos: number = testTable.rows[1] + delta;
        const expectedCellWidth = testTable.cellWidth;
        const expectedCellHeight: number = targetPos - testTable.rows[0];
        const expectedTableWidth = testTable.width;
        const expectedTableHeight = testTable.height + (targetPos - testTable.rows[1]);

        runResizeRowTest(
            { x: cellRect.left + cellRect.width / 2, y: cellRect.bottom },
            { x: cellRect.left + cellRect.width / 2, y: targetPos },
            new Map([
                [{ x: 0, y: 0 }, new DOMRect(0, 0, expectedCellWidth, expectedCellHeight)],
                [{ x: 0, y: 1 }, new DOMRect(0, 0, expectedCellWidth, expectedCellHeight)],
                [{ x: 0, y: 2 }, new DOMRect(0, 0, expectedCellWidth, expectedCellHeight)],
            ]),
            expectedTableWidth,
            expectedTableHeight
        );
    }

    function resizeLastRowTest(i: number) {
        initialize(i);
        const delta = 120;
        const testTable = testTables[i];
        const cellRect = getCellRect(2, 2);
        const targetPos: number = testTable.rows[testTable.rows.length - 1] + delta;
        const expectedCellWidth = testTable.cellWidth;
        const expectedCellHeight: number = targetPos - testTable.rows[2];
        const expectedTableWidth = testTable.width;
        const expectedTableHeight = testTable.height + (targetPos - testTable.rows[3]);

        runResizeRowTest(
            { x: cellRect.left + cellRect.width / 2, y: cellRect.bottom },
            { x: cellRect.left + cellRect.width / 2, y: targetPos },
            new Map([
                [{ x: 2, y: 0 }, new DOMRect(0, 0, expectedCellWidth, expectedCellHeight)],
                [{ x: 2, y: 1 }, new DOMRect(0, 0, expectedCellWidth, expectedCellHeight)],
                [{ x: 2, y: 2 }, new DOMRect(0, 0, expectedCellWidth, expectedCellHeight)],
            ]),
            expectedTableWidth,
            expectedTableHeight
        );
    }

    it('resizes the first row correctly with default table', () => {
        resizeFirstRowTest(0);
    });

    it('resizes the first row correctly with Excel table', () => {
        resizeFirstRowTest(1);
    });

    it('resizes the first row correctly with Word table', () => {
        resizeFirstRowTest(2);
    });

    it('resizes the last row correctly with default table', () => {
        resizeLastRowTest(0);
    });

    it('resizes the last row correctly with Excel table', () => {
        resizeLastRowTest(1);
    });

    it('resizes the last row correctly with Word table', () => {
        resizeLastRowTest(2);
    });

    /************************ Resizing column related tests ************************/

    function resizeColumnToLeftTest(i: number) {
        initialize(i);
        const delta = 20;
        const testTable = testTables[i];
        const cellRect = getCellRect(0, 0);
        const targetPos: number = testTable.columns[1] - delta;
        const expectedLeftWidth: number = targetPos - testTable.columns[0];
        const expectedRightWidth: number = testTable.columns[2] - targetPos;
        const expectedCellHeight = testTable.cellHeight;
        const expectedTableWidth = testTable.width;
        const expectedTableHeight = testTable.height;

        runResizeColumnTest(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 + 50 },
            new Map([
                [{ x: 0, y: 0 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 1, y: 0 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 2, y: 0 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
            ]),
            new Map([
                [{ x: 0, y: 1 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
                [{ x: 1, y: 1 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
                [{ x: 2, y: 1 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
            ]),
            expectedTableWidth,
            expectedTableHeight
        );
    }

    function resizeColumnToLeftTooNarrowTest(i: number) {
        initialize(i);
        const testTable = testTables[i];
        const cellRect = getCellRect(0, 1);
        const targetPos: number = testTable.columns[0] + 10;
        const expectedLeftWidth: number = testTable.cellWidth;
        const expectedRightWidth: number = testTable.cellWidth;
        const expectedCellHeight = testTable.cellHeight;
        const expectedTableWidth = testTable.width;
        const expectedTableHeight = testTable.height;

        runResizeColumnTest(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 - 20 },
            new Map([
                [{ x: 0, y: 1 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 1, y: 1 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 2, y: 1 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
            ]),
            new Map([
                [{ x: 0, y: 2 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
                [{ x: 1, y: 2 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
                [{ x: 2, y: 2 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
            ]),
            expectedTableWidth,
            expectedTableHeight
        );
    }

    function resizeColumnToRightTest(i: number) {
        initialize(i);
        const delta = 30;
        const testTable = testTables[i];
        const cellRect = getCellRect(1, 1);
        const targetPos: number = testTable.columns[2] + delta;
        const expectedLeftWidth: number = targetPos - testTable.columns[1];
        const expectedRightWidth: number = testTable.columns[3] - targetPos;
        const expectedCellHeight = testTable.cellHeight;
        const expectedTableWidth = testTable.width;
        const expectedTableHeight = testTable.height;

        runResizeColumnTest(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 - 15 },
            new Map([
                [{ x: 0, y: 1 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 1, y: 1 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 2, y: 1 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
            ]),
            new Map([
                [{ x: 0, y: 2 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
                [{ x: 1, y: 2 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
                [{ x: 2, y: 2 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
            ]),
            expectedTableWidth,
            expectedTableHeight
        );
    }

    function resizeColumnToRightTestTooNarrowTest(i: number) {
        initialize(i);
        const delta = 5;
        const testTable = testTables[i];
        const cellRect = getCellRect(2, 0);
        const targetPos: number = testTable.columns[2] - delta;
        const expectedLeftWidth: number = testTable.cellWidth;
        const expectedRightWidth: number = testTable.cellWidth;
        const expectedCellHeight = testTable.cellHeight;
        const expectedTableWidth = testTable.width;
        const expectedTableHeight = testTable.height;

        runResizeColumnTest(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 + 17 },
            new Map([
                [{ x: 0, y: 0 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 1, y: 0 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 2, y: 0 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
            ]),
            new Map([
                [{ x: 0, y: 1 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
                [{ x: 1, y: 1 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
                [{ x: 2, y: 1 }, new DOMRect(0, 0, expectedRightWidth, expectedCellHeight)],
            ]),
            expectedTableWidth,
            expectedTableHeight
        );
    }

    function resizeLastColumnToRightTest(i: number) {
        initialize(i);
        const delta = 350;
        const testTable = testTables[i];
        const cellRect = getCellRect(2, 2);
        const targetPos: number = testTable.columns[testTable.columns.length - 1] + delta;
        const expectedLeftWidth: number = targetPos - testTable.columns[2];
        const expectedCellHeight = testTable.cellHeight;
        const expectedTableWidth = targetPos - testTable.columns[0];
        const expectedTableHeight = testTable.height;

        runResizeColumnTest(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 - 5 },
            new Map([
                [{ x: 0, y: 2 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 1, y: 2 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
                [{ x: 2, y: 2 }, new DOMRect(0, 0, expectedLeftWidth, expectedCellHeight)],
            ]),
            undefined,
            expectedTableWidth,
            expectedTableHeight
        );
    }

    it('resizes the column to the left correctly with default table', () => {
        resizeColumnToLeftTest(0);
    });

    it('resizes the column to the left correctly with Excel table', () => {
        resizeColumnToLeftTest(1);
    });

    it('resizes the column to the left correctly with Word table', () => {
        resizeColumnToLeftTest(2);
    });

    it('does not resize the column to the left because it is too narrow with default table', () => {
        resizeColumnToLeftTooNarrowTest(0);
    });

    it('does not resize the column to the left because it is too narrow with Excel table', () => {
        resizeColumnToLeftTooNarrowTest(1);
    });

    it('does not resize the column to the left because it is too narrow with Word table', () => {
        resizeColumnToLeftTooNarrowTest(2);
    });

    it('resizes the column to the right correctly with default table', () => {
        resizeColumnToRightTest(0);
    });

    it('resizes the column to the right correctly with Excel table', () => {
        resizeColumnToRightTest(1);
    });

    it('resizes the column to the right correctly with Word table', () => {
        resizeColumnToRightTest(2);
    });

    it('does not resize the column to the right because it is too narrow with default table', () => {
        resizeColumnToRightTestTooNarrowTest(0);
    });

    it('does not resize the column to the right because it is too narrow with Excel table', () => {
        resizeColumnToRightTestTooNarrowTest(1);
    });

    it('does not resize the column to the right because it is too narrow with Word table', () => {
        resizeColumnToRightTestTooNarrowTest(2);
    });

    it('resizes the last column to the right correctly with default table', () => {
        resizeLastColumnToRightTest(0);
    });

    it('resizes the last column to the right correctly with Excel table', () => {
        resizeLastColumnToRightTest(1);
    });

    it('resizes the last column to the right correctly with Word table', () => {
        resizeLastColumnToRightTest(2);
    });

    /************************ Resizing table related tests ************************/

    function resizeTAbleWiderTest(i: number) {
        const tableRect = initialize(i);
        const testTable = testTables[i];
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: 700, y: testTable.rows[3] };
        const expectedTableWidth = 700 - testTable.columns[0];
        const expectedTableHeight = testTable.height;
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    }

    function resizeTableNarrowerTest(i: number) {
        const tableRect = initialize(i);
        const testTable = testTables[i];
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: 300, y: testTable.rows[3] };
        const expectedTableWidth = 300 - testTable.columns[0];
        const expectedTableHeight = testTable.height;
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    }

    function resizeTableTallerTest(i: number) {
        const tableRect = initialize(i);
        const testTable = testTables[i];
        const newBorderY = tableRect.bottom + 100;
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: tableRect.right, y: newBorderY };
        const expectedTableWidth = testTable.width;
        const expectedTableHeight = newBorderY - testTable.rows[0];
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    }

    function resizeTableNarrowerTallerTest(i: number) {
        const tableRect = initialize(i);
        const testTable = testTables[i];
        const newBorderX = tableRect.left + tableRect.width * 0.7;
        const newBorderY = tableRect.bottom + 100;
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: newBorderX, y: newBorderY };
        const expectedTableWidth = newBorderX - testTable.columns[0];
        const expectedTableHeight = newBorderY - testTable.rows[0];
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    }

    function resizeTableWiderTallerTest(i: number) {
        const tableRect = initialize(i);
        const testTable = testTables[i];
        const newBorderX = tableRect.left + tableRect.width * 2.0;
        const newBorderY = tableRect.bottom + 250;
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: newBorderX, y: newBorderY };
        const expectedTableWidth = newBorderX - testTable.columns[0];
        const expectedTableHeight = newBorderY - testTable.rows[0];
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    }

    it('resizes the table to be wider correctly with default table', () => {
        resizeTAbleWiderTest(0);
    });

    it('resizes the table to be wider correctly with Excel table', () => {
        resizeTAbleWiderTest(1);
    });

    it('resizes the table to be wider correctly with Word table', () => {
        resizeTAbleWiderTest(2);
    });

    it('resizes the table to be narrower correctly with default table', () => {
        resizeTableNarrowerTest(0);
    });

    it('resizes the table to be narrower correctly with Excel table', () => {
        resizeTableNarrowerTest(1);
    });

    it('resizes the table to be narrower correctly with Word table', () => {
        resizeTableNarrowerTest(2);
    });

    it('resizes the table to be taller correctly with default table', () => {
        resizeTableTallerTest(0);
    });

    it('resizes the table to be taller correctly with Excel table', () => {
        resizeTableTallerTest(1);
    });

    it('resizes the table to be taller correctly with Word table', () => {
        resizeTableTallerTest(2);
    });

    it('resizes the table to be narrower and taller correctly with default table', () => {
        resizeTableNarrowerTallerTest(0);
    });

    it('resizes the table to be narrower and taller correctly with Excel table', () => {
        resizeTableNarrowerTallerTest(1);
    });

    it('resizes the table to be narrower and taller correctly with Word table', () => {
        resizeTableNarrowerTallerTest(2);
    });

    it('resizes the table to be wider and taller correctly with default table', () => {
        resizeTableWiderTallerTest(0);
    });

    it('resizes the table to be wider and taller correctly with Excel table', () => {
        resizeTableWiderTallerTest(1);
    });

    it('resizes the table to be wider and taller correctly with Word table', () => {
        resizeTableWiderTallerTest(2);
    });

    /************************ Other utilities ************************/

    it('returns the actual plugin name', () => {
        const expectedName = 'TableResize';
        const pluginName = plugin.getName();
        expect(pluginName).toBe(expectedName);
    });
});
