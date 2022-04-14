import * as TestHelper from 'roosterjs-editor-api/test/TestHelper';
import { DEFAULT_TABLE, DEFAULT_TABLE_MERGED, EXCEL_TABLE, WORD_TABLE } from './tableData';
import { TableResize } from '../../lib/TableResize';
import {
    IEditor,
    PluginEvent,
    PluginEventType,
    DOMEventHandlerFunction,
} from 'roosterjs-editor-types';

const VERTICAL_INSERTER = 'verticalInserter';
const HORIZONTAL_INSERTER = 'horizontalInserter';
const TABLE_RESIZER = 'tableResizer';

/* Used to specify mouse coordinates or cell locations in a table in this test set */
type Position = {
    x: number;
    y: number;
};

enum ResizeState {
    None,
    Horizontal,
    Vertical,
    Both, // when resizing the whole table
}
interface TestTable {
    htmlData: string;
    rows: number[];
    columns: number[];
    width: number;
    height: number;
    cellWidth?: number;
    cellHeight?: number;
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
                            (Word table)

                    8.5_____98.9____189.3___279.7/8.5
                    | (0, 0) | (0, 1) | (0, 2) |
                    |________|________|________|50.4
                    | (1, 0) | (1, 1) | (1, 2) |
                    |________|________|________|92.4
                    | (2, 0) | (2, 1) | (2, 2) |
                    |________|________|________|135.5

        cell width: 90.4, cell height: 41.9 (getBoudingClientRect)
        table width: 272.2, table height: 128 (getBoudingClientRect)


                            Test Table 4
                        (Default table merged)

                    8.5_____131.5____254.5___377.5___500.5/8.5
                    | (0, 0) | (0, 1) | (0, 2) | (0, 3) |
                    |________|________|________|________|30.5
                    | (1, 0) |      (1, 1)     | (1, 2) |
                    |        |_________________|________|71.5
                    |        | (2, 0) | (2, 1) | (2, 2) |
                    |________|________|________|________|93.5
                    | (3, 0) | (3, 1) | (3, 2) | (3, 3) |
                    |________|________|________|________|115.5

        table width: 493, table height: 108 (getBoudingClientRect)

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

const defaultTableMerged: TestTable = {
    htmlData: DEFAULT_TABLE_MERGED,
    rows: [8.5, 30.5, 71.5, 93.5, 115.5],
    columns: [8.5, 131.5, 254.5, 377.5, 500.5],
    width: 493,
    height: 108,
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

const testTables = [defaultTable, excelTable, wordTable, defaultTableMerged];

xdescribe('Table Resizer/Inserter tests', () => {
    let editor: IEditor;
    let plugin: TableResize;
    const insideTheOffset = 5;
    const TEST_ID = 'inserterTest';

    let handler: Record<string, DOMEventHandlerFunction>;
    let addDomEventHandler: jasmine.Spy;

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        plugin = new TableResize();

        handler = null;
        addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.callFake((handlerParam: Record<string, DOMEventHandlerFunction>) => {
                handler = handlerParam;
                return () => {
                    handler = null;
                };
            });

        editor = <IEditor>(<any>{
            ...editor,
            addDomEventHandler,
            addUndoSnapshot: (f: () => void) => f(),
            insertNode: (node: HTMLElement) => {
                document.body.appendChild(node);
            },
            runAsync: (callback: () => void) => {
                handler.resizeCells = callback;
            },
            getDocument: () => document,
            select: () => {},
            getDefaultFormat: () => {
                return {
                    backgroundColor: 'black',
                };
            },
            isDarkMode: () => false,
            queryElements: (table: string, callback: (table: HTMLTableElement) => void) => {
                const tables = document.getElementsByTagName(table);
                const tableList = Array.from(tables);
                tableList.forEach(table => {
                    callback(table as HTMLTableElement);
                });
            },
            dispose: () => {},
        });

        plugin.initialize(editor);
    });

    afterEach(() => {
        editor.dispose();
        plugin.dispose();
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
        const editorDiv = editor.getDocument().getElementById(TEST_ID);
        editorDiv.innerHTML = testTables[tableIndex].htmlData;
        const table = document.getElementsByTagName('table')[0];
        return table.getBoundingClientRect();
    }

    function getCurrentTable(): HTMLTableElement {
        return editor.getDocument().getElementsByTagName('table')[0] as HTMLTableElement;
    }

    function getTableRows(table: HTMLTableElement): number {
        return table.rows.length;
    }

    function getTableColumns(table: HTMLTableElement): number {
        return table.rows[0].cells.length;
    }

    function runInserterTest(inserterType: string, mouseEnd: Position) {
        handler.mousemove(
            new MouseEvent('mousemove', {
                clientX: mouseEnd.x,
                clientY: mouseEnd.y,
            })
        );

        const inserter = editor.getDocument().getElementById(inserterType);
        if (!!inserter) {
            const table = getCurrentTable();
            const rows = getTableRows(table);
            const cols = getTableColumns(table);
            inserter.dispatchEvent(new MouseEvent('click'));
            const newRows = getTableRows(table);
            const newCols = getTableColumns(table);
            expect(newRows).toBe(inserterType == VERTICAL_INSERTER ? rows : rows + 1);
            expect(newCols).toBe(inserterType == HORIZONTAL_INSERTER ? cols : cols + 1);
        }
    }

    // inserter tests
    it('adds a new row if the vertical inserter is detected and clicked', () => {
        const rect = initialize(0);
        runInserterTest(VERTICAL_INSERTER, { x: rect.right - insideTheOffset, y: rect.top });
    });

    it('adds a new column if the horizontal inserter is detected and clicked', () => {
        const rect = initialize(0);
        runInserterTest(HORIZONTAL_INSERTER, { x: rect.left, y: rect.bottom - insideTheOffset });
    });

    /************************ Resizer related tests ************************/

    function getTableRectSet(table: HTMLTableElement): DOMRect[] {
        const rectSet: DOMRect[] = [];
        if (!!table) {
            rectSet.push(table.getBoundingClientRect());
        }
        for (let i = 0; i < table.rows.length; i++) {
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                rectSet.push(table.rows[i].cells[j].getBoundingClientRect());
            }
        }
        return rectSet;
    }

    function runTableShapeTest(tableRectSet1: DOMRect[], tableRectSet2: DOMRect[]) {
        expect(tableRectSet1.length).toBe(tableRectSet2.length);
        const isSameRect = (rect1: DOMRect, rect2: DOMRect): boolean => {
            return (
                rect1.left == rect2.left &&
                rect1.right == rect2.right &&
                rect1.top == rect2.top &&
                rect1.bottom == rect2.bottom
            );
        };
        tableRectSet1.forEach((rect, i) => {
            expect(isSameRect(rect, tableRectSet2[i])).toBe(true);
        });
    }

    function moveAndResize(mouseStart: Position, mouseEnd: Position, resizeState: ResizeState) {
        const editorDiv = editor.getDocument().getElementById(TEST_ID);
        let resizerId: string;
        switch (resizeState) {
            case ResizeState.Both:
                resizerId = TABLE_RESIZER;
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
        handler.mousemove(mouseMoveEvent);

        let resizer = editor.getDocument().getElementById(resizerId);
        if (!!resizer) {
            const tableBeforeClick = getTableRectSet(getCurrentTable());
            const mouseClickEvent = new MouseEvent('mousedown');
            resizer.dispatchEvent(mouseClickEvent);
            const tableAfterClick = getTableRectSet(getCurrentTable());
            // validate the table doesn't shift after clicking on the resizer
            runTableShapeTest(tableBeforeClick, tableAfterClick);

            const mouseMoveResize = new MouseEvent('mousemove', {
                clientX: mouseEnd.x,
                clientY: mouseEnd.y,
            });
            const doc = editor.getDocument();
            // this will assign handler.resizeCells with the actual handler
            doc.dispatchEvent(mouseMoveResize);
            handler.resizeCells(mouseMoveResize);

            // release mouse and stop resizing
            const mouseMoveEndEvent = new MouseEvent('mouseup');
            editorDiv.dispatchEvent(mouseMoveEndEvent);

            resizer = editor.getDocument().getElementById(resizerId);
            expect(!!resizer).toBe(false);
        }
    }

    /************************** Resizier removing tests **************************/

    function removeResizerTest(pluginEvent: PluginEvent) {
        plugin.onPluginEvent(pluginEvent);
        const resizer = editor.getDocument().getElementById(TABLE_RESIZER);
        expect(!!resizer).toBe(false);
    }

    it('removes table resisizer on input', () => {
        const pluginEvent: PluginEvent = {
            eventType: PluginEventType.Input,
            rawEvent: null,
        };
        removeResizerTest(pluginEvent);
    });

    it('removes table resisizer on content change', () => {
        const pluginEvent: PluginEvent = {
            eventType: PluginEventType.ContentChanged,
            source: null,
        };
        removeResizerTest(pluginEvent);
    });

    it('removes table resisizer on scrolling', () => {
        const pluginEvent: PluginEvent = {
            eventType: PluginEventType.Scroll,
            scrollContainer: editor.getDocument().body as HTMLElement,
            rawEvent: null,
        };
        removeResizerTest(pluginEvent);
    });

    /************************ Resizing row related tests ************************/

    function resizeFirstRowTest(i: number) {
        initialize(i);
        const delta = 50;
        const testTable = testTables[i];
        const cellRect = getCellRect(0, 0);
        const targetPos: number = testTable.rows[1] + delta;

        moveAndResize(
            { x: cellRect.left + cellRect.width / 2, y: cellRect.bottom },
            { x: cellRect.left + cellRect.width / 2, y: targetPos },
            ResizeState.Horizontal
        );
    }

    function resizeLastRowTest(i: number) {
        initialize(i);
        const delta = 120;
        const testTable = testTables[i];
        const cellRect = getCellRect(2, 2);
        const targetPos: number = testTable.rows[testTable.rows.length - 1] + delta;

        moveAndResize(
            { x: cellRect.left + cellRect.width / 2, y: cellRect.bottom },
            { x: cellRect.left + cellRect.width / 2, y: targetPos },
            ResizeState.Horizontal
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

    it('resizes the row correctly with merged cells', () => {
        initialize(3);
        const delta = 35;
        const testTable = testTables[3];
        const cellRect = getCellRect(1, 1);
        const targetPos: number = testTable.rows[2] + delta;

        moveAndResize(
            { x: cellRect.left + cellRect.width / 2, y: cellRect.bottom },
            { x: cellRect.left + cellRect.width / 2, y: targetPos },
            ResizeState.Horizontal
        );
    });
    /************************ Resizing column related tests ************************/

    function resizeColumnToLeftTest(i: number) {
        initialize(i);
        const delta = 20;
        const testTable = testTables[i];
        const cellRect = getCellRect(0, 0);
        const targetPos: number = testTable.columns[1] - delta;

        moveAndResize(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 + 50 },
            ResizeState.Vertical
        );
    }

    function resizeColumnToLeftTooNarrowTest(i: number) {
        initialize(i);
        const testTable = testTables[i];
        const cellRect = getCellRect(0, 1);
        const targetPos: number = testTable.columns[0] + 10;

        moveAndResize(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 - 20 },
            ResizeState.Vertical
        );
    }

    function resizeColumnToRightTest(i: number) {
        initialize(i);
        const delta = 30;
        const testTable = testTables[i];
        const cellRect = getCellRect(1, 1);
        const targetPos: number = testTable.columns[2] + delta;

        moveAndResize(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 - 15 },
            ResizeState.Vertical
        );
    }

    function resizeColumnToRightTestTooNarrowTest(i: number) {
        initialize(i);
        const delta = 5;
        const testTable = testTables[i];
        const cellRect = getCellRect(2, 0);
        const targetPos: number = testTable.columns[2] - delta;

        moveAndResize(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 + 17 },
            ResizeState.Vertical
        );
    }

    function resizeLastColumnToRightTest(i: number) {
        initialize(i);
        const delta = 350;
        const testTable = testTables[i];
        const cellRect = getCellRect(2, 2);
        const targetPos: number = testTable.columns[testTable.columns.length - 1] + delta;

        moveAndResize(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 - 5 },
            ResizeState.Vertical
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

    it('resizes the column to the left correctly with merged cells', () => {
        initialize(3);
        const delta = 20;
        const testTable = testTables[3];
        const cellRect = getCellRect(1, 1);
        const targetPos: number = testTable.columns[3] - delta;

        moveAndResize(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 + 50 },
            ResizeState.Vertical
        );
    });

    it('does not resize the column to the left correctly with merged cells since too narrow', () => {
        initialize(3);
        const testTable = testTables[3];
        const cellRect = getCellRect(1, 1);
        const targetPos: number = testTable.columns[2];

        moveAndResize(
            { x: cellRect.right, y: cellRect.top + cellRect.height / 2 },
            { x: targetPos, y: cellRect.top + cellRect.height / 2 + 50 },
            ResizeState.Vertical
        );
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

    function resizeTableWiderTest(i: number) {
        const tableRect = initialize(i);
        const testTable = testTables[i];
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: 700, y: testTable.rows[3] };
        moveAndResize(mouseStart, mouseEnd, ResizeState.Both);
    }

    function resizeTableNarrowerTest(i: number) {
        const tableRect = initialize(i);
        const testTable = testTables[i];
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: 300, y: testTable.rows[3] };
        moveAndResize(mouseStart, mouseEnd, ResizeState.Both);
    }

    function resizeTableTallerTest(i: number) {
        const tableRect = initialize(i);
        const newBorderY = tableRect.bottom + 100;
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: tableRect.right, y: newBorderY };
        moveAndResize(mouseStart, mouseEnd, ResizeState.Both);
    }

    function resizeTableNarrowerTallerTest(i: number) {
        const tableRect = initialize(i);
        const newBorderX = tableRect.left + tableRect.width * 0.7;
        const newBorderY = tableRect.bottom + 100;
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: newBorderX, y: newBorderY };
        moveAndResize(mouseStart, mouseEnd, ResizeState.Both);
    }

    function resizeTableWiderTallerTest(i: number) {
        const tableRect = initialize(i);
        const newBorderX = tableRect.left + tableRect.width * 2.0;
        const newBorderY = tableRect.bottom + 250;
        const mouseStart = { x: tableRect.right, y: tableRect.bottom };
        const mouseEnd = { x: newBorderX, y: newBorderY };
        moveAndResize(mouseStart, mouseEnd, ResizeState.Both);
    }

    it('resizes the table to be wider correctly with default table', () => {
        resizeTableWiderTest(0);
    });

    it('resizes the table to be wider correctly with Excel table', () => {
        resizeTableWiderTest(1);
    });

    it('resizes the table to be wider correctly with Word table', () => {
        resizeTableWiderTest(2);
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
