import * as TestHelper from '../TestHelper';
import { DOMEventHandlerFunction } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import { normalizeTable } from 'roosterjs-content-model-core';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';
import {
    ContentModelTable,
    DOMEventRecord,
    EditorCore,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * Function to be called before each Table Edit test
 * @param TEST_ID The id of the editor div
 * @param anchorContainerSelector The selector for the anchor container
 * @returns The editor, plugin, and handler to be used in the test
 */
export function beforeTableTest(TEST_ID: string, anchorContainerSelector?: string) {
    const plugin = new TableEditPlugin('.' + anchorContainerSelector);

    let handler: Record<string, DOMEventHandlerFunction> = {};
    const attachDomEvent = jasmine
        .createSpy('attachDomEvent')
        .and.callFake((core: EditorCore, eventMap: Record<string, DOMEventRecord<Event>>) => {
            getObjectKeys(eventMap || {}).forEach(key => {
                const eventname = key as keyof HTMLElementEventMap;
                const { beforeDispatch } = eventMap[key];
                const onEvent = (event: HTMLElementEventMap[typeof eventname]) => {
                    beforeDispatch && beforeDispatch(event);
                };
                handler[eventname] = onEvent;
            });
            return () => {
                handler = {};
            };
        });

    const coreApiOverride = {
        attachDomEvent,
    };
    const editor = TestHelper.initEditor(
        TEST_ID,
        [plugin],
        undefined,
        coreApiOverride,
        anchorContainerSelector
    );

    plugin.initialize(editor);

    return { editor, plugin, handler };
}

/**
 * Function to be called after each Table Edit test
 * @param editor The editor to be disposed
 * @param plugin The plugin to be disposed
 * @param TEST_ID The id of the editor div
 */
export function afterTableTest(editor: IEditor, plugin: TableEditPlugin, TEST_ID: string) {
    plugin.dispose();
    !editor.isDisposed() && editor.dispose();
    TestHelper.removeElement(TEST_ID);
    document.body = document.createElement('body');
}

/**
 * Function to get the current table in the editor
 * @param editor The editor to get the table from
 * @returns The current table in the editor
 */
export function getCurrentTable(editor: IEditor): HTMLTableElement {
    const table = editor.getDOMHelper().queryElements('table')[0] as HTMLTableElement;
    return table;
}

/**
 * Function to get the number of rows in the table
 * @param table The table to get the number of rows from
 * @returns The number of rows in the table
 */
export function getTableRows(table: HTMLTableElement): number {
    return table.rows.length;
}

/**
 * Function to get the number of columns in the table
 * @param table The table to get the number of columns from
 * @returns The number of columns in the table
 */
export function getTableColumns(table: HTMLTableElement): number {
    return table.rows[0].cells.length;
}

/**
 * Function to get the rect of a cell in the table
 * @param editor The editor to get the table from
 * @param i The row index of the cell
 * @param j The column index of the cell
 * @returns The rect of the cell
 */
export function getCellRect(editor: IEditor, i: number, j: number): DOMRect | undefined {
    const tables = editor.getDOMHelper().queryElements('table');
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

/**
 * Insert the content model table on the edito
 * @param editor The editor to insert the table into
 * @param table The table to insert
 * @param isRtl Whether the table is RTL
 * @returns The rect of the table
 */
export function initialize(
    editor: IEditor,
    table: ContentModelTable,
    isRtl: boolean = false
): DOMRect {
    if (isRtl) {
        editor.getDocument().body.style.direction = 'rtl';
    }
    editor.formatContentModel((model, context) => {
        normalizeTable(table);
        model.blocks = [table];
        return true;
    });
    const DOMTable = editor.getDOMHelper().queryElements('table')[0];
    return DOMTable.getBoundingClientRect();
}

/* Used to specify mouse coordinates */
export type Position = {
    x: number;
    y: number;
};
/* Used to specify the direction of the resize */
export type resizeDirection = 'horizontal' | 'vertical' | 'both';

/* IDs for the resizers */
const VERTICAL_RESIZER_ID = 'verticalResizer';
const HORIZONTAL_RESIZER_ID = 'horizontalResizer';
const TABLE_RESIZER_ID = '_Table_Resizer';

/**
 * Function to move and resize the table
 * @param mouseStart The starting position of the mouse
 * @param mouseEnd The ending position of the mouse
 * @param resizeState The direction of the resize
 * @param editor The editor to resize the table in
 * @param handler The handler to handle the mouse events
 * @param TEST_ID The id of the editor div
 */
export function moveAndResize(
    mouseStart: Position,
    mouseEnd: Position,
    resizeState: resizeDirection,
    editor: IEditor,
    handler: Record<string, DOMEventHandlerFunction>,
    TEST_ID: string
) {
    const editorDiv = editor.getDocument().getElementById(TEST_ID);
    let resizerId: string;
    switch (resizeState) {
        case 'both':
            resizerId = TABLE_RESIZER_ID;
            break;
        case 'horizontal':
            resizerId = HORIZONTAL_RESIZER_ID;
            break;
        case 'vertical':
            resizerId = VERTICAL_RESIZER_ID;
            break;
        default:
            resizerId = '';
    }

    // Move mouse to show resizer
    mouseToPoint(mouseStart, handler);

    let resizer = editor.getDocument().getElementById(resizerId);
    if (!!resizer && editorDiv) {
        const tableBeforeClick = getTableRectSet(getCurrentTable(editor));
        // Click on the resizer to start resizing
        const mouseClickEvent = new MouseEvent('mousedown', {
            clientX: mouseStart.x,
            clientY: mouseStart.y,
        });
        resizer.dispatchEvent(mouseClickEvent);
        const tableAfterClick = getTableRectSet(getCurrentTable(editor));

        // Validate the table doesn't shift after clicking on the resizer
        runTableShapeTest(tableBeforeClick, tableAfterClick);

        // Move mouse and resize
        const mouseMoveResize = new MouseEvent('mousemove', {
            clientX: mouseEnd.x,
            clientY: mouseEnd.y,
        });

        editorDiv.dispatchEvent(mouseMoveResize);
        handler.mousemove(mouseMoveResize);

        // Release mouse and stop resizing
        const mouseMoveEndEvent = new MouseEvent('mouseup');
        editorDiv.dispatchEvent(mouseMoveEndEvent);
    }
}

/**
 * Function to move the mouse to a point
 * @param mouseStart The starting position of the mouse
 * @param handler The handler to handle the mouse events
 */
export function mouseToPoint(
    mouseStart: Position,
    handler: Record<string, DOMEventHandlerFunction>
) {
    // Move mouse to point
    const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: mouseStart.x,
        clientY: mouseStart.y,
    });
    handler.mousemove(mouseMoveEvent);
}

/**
 * Function to ckeck if the table rects are the same
 * @param tableRectSet1 The first set of table rects
 * @param tableRectSet2 The second set of table rects
 */
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

/**
 * Get all rects from a table
 * @param table The table to get the rects from
 * @returns The set of rects for the table, first the whole table rect and then the cell rects
 */
export function getTableRectSet(table: HTMLTableElement): DOMRect[] {
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
