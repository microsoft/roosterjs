import * as TestHelper from '../../../roosterjs-editor-api/test/TestHelper';
import { CELL_RESIZER_WIDTH, ResizeState } from '../../lib/plugins/TableResize/TableResize';
import { DEFAULT_TABLE, EXCEL_TABLE } from './tableData';
import { TableResize } from '../../lib/TableResize';
//import { Rect } from 'roosterjs-editor-types';
//import * as DomTestHelper from 'roosterjs-editor-dom/test/DomTestHelper';
import { IEditor /*PluginEventType*/ } from 'roosterjs-editor-types';

/* Used to specify mouse coordinates or cell locations in a table in this test set */
type Position = {
    x: number;
    y: number;
};

describe('Table Inserter tests', () => {
    let editor: IEditor;
    let plugin: TableResize;
    const insideTheOffset = 5;
    //const MIN_CELL_WIDTH = 30;
    //const CELL_RESIZER_WIDTH = 4;
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

    function initialize(isRtl: boolean = false): DOMRect {
        if (isRtl) {
            editor.getDocument().body.style.direction = 'rtl';
        }
        editor.setContent(DEFAULT_TABLE);
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
        expectedResultAfterMove: boolean,
        rect?: DOMRect // expect inserter to show in rect when specified
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
        const rect = initialize();
        runInserterTest(
            { x: rect.right, y: rect.top - OFFSET_Y },
            { x: rect.right / 2, y: rect.bottom },
            true,
            false
        );
    });

    it('keeps the vertical inserter when moving the cursor inside the safe zone', () => {
        const rect = initialize();
        runInserterTest(
            { x: rect.right, y: rect.top - OFFSET_Y },
            { x: rect.right - insideTheOffset, y: rect.top },
            true,
            true
        );
    });

    it('removes the horizontal inserter when moving the cursor out of the offset zone', () => {
        const rect = initialize();
        runInserterTest(
            { x: rect.left, y: rect.bottom },
            { x: (rect.right - rect.left) / 2, y: (rect.bottom - rect.top) / 2 },
            true,
            false
        );
    });

    it('keeps the horizontal inserter when moving the cursor inside the safe zone', () => {
        const rect = initialize();
        runInserterTest(
            { x: rect.left, y: rect.bottom },
            { x: rect.left, y: rect.bottom - insideTheOffset },
            true,
            true
        );
    });

    it('removes the horizontal inserter when moving the cursor out of the offset zone with culture language RTL', () => {
        const rect = initialize(true);
        runInserterTest(
            { x: rect.right, y: rect.bottom },
            { x: (rect.right - rect.left) / 2, y: (rect.bottom - rect.top) / 2 },
            true,
            false
        );
    });

    it('keeps the horizontal inserter when moving the cursor inside the safe zone with culture language RTL', () => {
        const rect = initialize(true);
        runInserterTest(
            { x: rect.right, y: rect.bottom },
            { x: rect.right + insideTheOffset / 2, y: rect.bottom },
            true,
            true
        );
    });

    it('removes the vertical inserter when moving the cursor out of the offset zone with culture language RTL', () => {
        const rect = initialize(true);
        const cellRect = getCellRect(0, 2);

        runInserterTest(
            { x: cellRect.left, y: cellRect.top },
            { x: (rect.right - rect.left) / 2, y: rect.bottom },
            true,
            false
        );
    });

    it('removes the vertical inserter for the first cell if the X coordinate of the cursor position is less than the half distance of the cell in LTR', () => {
        initialize(false);
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

    it('sets the vertical inserter at the previous td for non-first cells if the X coordinate of the cursor position is less than the half distance of the cell in LTR', () => {
        initialize(false);
        const cellRect = getCellRect(0, 1);
        const expectedRect = getCellRect(0, 0);

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
            true,
            expectedRect
        );
    });

    xit('sets the vertical inserter at the current td for non-first cells if the X coordinate of the cursor position is greater than the half distance of the cell in LTR', () => {});

    xit('removes the vertical inserter for the first cell if the X coordinate of the cursor position is less than the half distance of the cell in RTL', () => {});
    xit('sets the vertical inserter at the previous td for non-first cells if the X coordinate of the cursor position is greater than the half distance of the cell in RTL', () => {});
    xit('sets the vertical inserter at the current td for non-first cells if the X coordinate of the cursor position is less than the half distance of the cell in RTL', () => {});

    // insert Td correctly vertical/horizonal    RTL/LTR

    it('adds the horizontal resizer when mouse lands on each horizontal border', () => {});

    /************************ Resizer related tests ************************/

    /*function getTableCell(table: HTMLTableElement, x: number, y: number): HTMLTableCellElement {
        return table.rows[x].cells[y];
    }

    function getTableRowCells(
        table: HTMLTableElement,
        row: number
    ): Map<HTMLTableCellElement, DOMRect> {
        const cells: Map<HTMLTableCellElement, DOMRect> = new Map();
        if (row >= table.rows.length) {
            return cells;
        }
        for (let i = 0; i < table.rows[row].cells.length; i++) {
            cells.set(table.rows[row].cells[i], table.rows[row].cells[i].getBoundingClientRect());
        }
        return cells;
    }

    function getTableColumnCells(
        table: HTMLTableElement,
        column: number
    ): Map<HTMLTableCellElement, DOMRect> {
        const cells: Map<HTMLTableCellElement, DOMRect> = new Map();
        if (table.rows.length == 0 || column >= table.rows[0].cells.length) {
            return cells;
        }
        for (let i = 0; i < table.rows.length; i++) {
            cells.set(
                table.rows[i].cells[column],
                table.rows[i].cells[column].getBoundingClientRect()
            );
        }
        return cells;
    }*/

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
            expect(resizerX).toBeGreaterThan(expectedPos.x - 1);
            expect(resizerX).toBeLessThan(expectedPos.x + 1);
            expect(resizerY).toBeGreaterThan(expectedPos.y - 1);
            expect(resizerY).toBeLessThan(expectedPos.y + 1);
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

        // trigger mousemove again (this would trigger resizeCells => plugin.resizeColumns(90, true)), and then verify if currentCellsToResize, nextCellsToResize width and table width

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
        expect(Math.abs(tableRect.width - expectedTableWidth)).toBeLessThan(3);
        expect(Math.abs(tableRect.height - expectedTableHeight)).toBeLessThan(3);
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
            expect(Math.abs(cellRect.width - tRect.width)).toBeLessThan(1);
            expect(Math.abs(cellRect.height - tRect.height)).toBeLessThan(1);
        });

        const table = editor.getDocument().getElementsByTagName('table')[0] as HTMLTableElement;
        const tableRect = table.getBoundingClientRect();
        expect(Math.abs(tableRect.width - expectedTableWidth)).toBeLessThan(1);
        expect(Math.abs(tableRect.height - expectedTableHeight)).toBeLessThan(1);
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
            expect(Math.abs(cellRect.width - tRect.width)).toBeLessThan(1);
            expect(Math.abs(cellRect.height - tRect.height)).toBeLessThan(1);
        });

        if (!!expectedRightColumn) {
            expectedRightColumn.forEach((tRect, pos) => {
                const cellRect = getCellRect(pos.x, pos.y);
                expect(!!cellRect).toBe(true);
                expect(Math.abs(cellRect.width - tRect.width)).toBeLessThan(1);
                expect(Math.abs(cellRect.height - tRect.height)).toBeLessThan(1);
            });
        }

        const table = editor.getDocument().getElementsByTagName('table')[0] as HTMLTableElement;
        const tableRect = table.getBoundingClientRect();
        expect(Math.abs(tableRect.width - expectedTableWidth)).toBeLessThan(1);
        expect(Math.abs(tableRect.height - expectedTableHeight)).toBeLessThan(1);
    }

    /************************** Resizier showing tests **************************/

    it('adds the vertical resizer when mouse lands inside each cell with LTR', () => {
        const tableRect = initialize(false);

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

    it('adds the horizontal resizer when mouse lands inside each cell with LTR', () => {
        const tableRect = initialize(false);
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

    /**** The x (horizontal) and y (vertical) coordinates of the test table *****

                   58.5____181.5____304.5____427.5/50.5
                    | (0, 0) | (0, 1) | (0, 2) |
                    |________|________|________|72.5
                    | (1, 0) | (1, 1) | (1, 2) |
                    |________|________|________|94.5
                    | (2, 0) | (2, 1) | (2, 2) |
                    |________|________|________|116.5

        each cell width: 123, each cell height: 22 (getBoudingClientRect)
        table width: 370, table height: 67 (getBoudingClientRect)

    /************************ Resizing row related tests ************************/

    it('resizes the first row correctly', () => {
        initialize(false);
        const cellRect = getCellRect(0, 0);
        const targetPos: number = 100;
        const expectedCellWidth = 123;
        const expectedCellHeight: number = targetPos - 50.5;
        const expectedTableWidth = 370;
        const expectedTableHeight = 67 + (targetPos - 72.5);

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
    });

    it('resizes the last row correctly', () => {
        initialize(false);
        const cellRect = getCellRect(2, 2);
        const targetPos: number = 500;
        const expectedCellWidth = 123;
        const expectedCellHeight: number = targetPos - 94.5;
        const expectedTableWidth = 370;
        const expectedTableHeight = 67 + (targetPos - 116.5);

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
    });

    /************************ Resizing column related tests ************************/

    it('resizes the column to the left correctly', () => {
        initialize(false);
        const cellRect = getCellRect(0, 0);
        const targetPos: number = 90;
        const expectedLeftWidth: number = 90 - 58.5;
        const expectedRightWidth: number = 304.5 - 90;
        const expectedCellHeight = 21.5;
        const expectedTableWidth = 370;
        const expectedTableHeight = 67;

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
    });

    it('does not resize the column to the left because it is too narrow', () => {
        initialize(false);
        const cellRect = getCellRect(0, 1);
        const targetPos: number = 200;
        const expectedLeftWidth: number = 123;
        const expectedRightWidth: number = 123;
        const expectedCellHeight = 21.5;
        const expectedTableWidth = 370;
        const expectedTableHeight = 67;

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
    });

    it('resizes the column to the right correctly', () => {
        initialize(false);
        const cellRect = getCellRect(1, 1);
        const targetPos: number = 360;
        const expectedLeftWidth: number = 360 - 181.5;
        const expectedRightWidth: number = 427.5 - 360;
        const expectedCellHeight = 21.5;
        const expectedTableWidth = 370;
        const expectedTableHeight = 67;

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
    });

    it('does not resize the column to the right because it is too narrow', () => {
        initialize(false);
        const cellRect = getCellRect(2, 0);
        const targetPos: number = 300;
        const expectedLeftWidth: number = 123;
        const expectedRightWidth: number = 123;
        const expectedCellHeight = 21.5;
        const expectedTableWidth = 370;
        const expectedTableHeight = 67;

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
    });

    it('resizes the last column to the right correctly', () => {
        initialize(false);
        const cellRect = getCellRect(2, 2);
        const targetPos: number = 800;
        const expectedLeftWidth: number = 800 - 304.5;
        const expectedCellHeight = 21.5;
        const expectedTableWidth = 800 - 58.5;
        const expectedTableHeight = 67;

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
    });

    /************************ Resizing table related tests ************************/

    it('resizes the table to be wider correctly', () => {
        const tableRect = initialize(false);
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: 700, y: 116.5 };
        const expectedTableWidth = 700 - 58.5;
        const expectedTableHeight = 67;
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    });

    it('resizes the table to be narrower correctly', () => {
        const tableRect = initialize(false);
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: 300, y: 116.5 };
        const expectedTableWidth = 300 - 58.5;
        const expectedTableHeight = 67;
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    });

    it('resizes the table to be taller correctly', () => {
        const tableRect = initialize(false);
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: tableRect.right, y: 250 };
        const expectedTableWidth = 370;
        const expectedTableHeight = 250 - 50.5;
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    });

    it('resizes the table to be narrower and taller correctly', () => {
        const tableRect = initialize(false);
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: 250, y: 300 };
        const expectedTableWidth = 250 - 58.5;
        const expectedTableHeight = 300 - 50.5;
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    });

    it('resizes the table to be wider and taller correctly', () => {
        const tableRect = initialize(false);
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: 600, y: 200 };
        const expectedTableWidth = 600 - 58.5;
        const expectedTableHeight = 200 - 50.5;
        runResizeTableTest(mouseStart, mouseEnd, expectedTableWidth, expectedTableHeight);
    });

    /************************ Other utilities ************************/

    it('returns the actual plugin name', () => {
        const expectedName = 'TableResize';
        const pluginName = plugin.getName();
        expect(pluginName).toBe(expectedName);
    });
});
