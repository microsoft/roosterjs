import * as TestHelper from '../../../roosterjs-editor-api/test/TestHelper';
import { getHorizontalDistance } from '../../lib/plugins/TableResize/TableResize';
import { Rect } from 'roosterjs-editor-types';
import { TableResize } from '../../lib/TableResize';
import { IEditor /*PluginEventType*/ } from 'roosterjs-editor-types';

describe('Table Inserter tests', () => {
    let editor: IEditor;
    let plugin: TableResize;
    const insideTheOffset = 5;

    const OFFSET_X = 5;
    const OFFSET_Y = 2;
    const TABLE =
        '<div style="margin: 50px"><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr></tbody></table><br></div>';
    const ADD_BUTTON = '</div>+</div>';
    const TEST_ID = 'inserterTest';

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        plugin = new TableResize();
        plugin.initialize(editor);
    });

    afterEach(() => {
        editor.dispose();
        plugin.dispose();
        TestHelper.removeElement(TEST_ID);
        document.body = document.createElement('body');
    });

    type Position = {
        x: number;
        y: number;
    };

    function getCellRect(i: number, j: number): DOMRect {
        const tables = editor.getDocument().getElementsByTagName('table');
        if (tables.length < 1) {
            throw 'coult not find any table';
        }

        const table = tables[0];
        if (table.rows.length - 1 < i) {
            throw 'invalid row';
        }
        if (table.rows[i].cells.length - 1 < j) {
            throw 'invalid col';
        }

        const cell = table.rows[i].cells[j];

        return cell.getBoundingClientRect();
    }

    function initialize(isRtl: boolean = false): DOMRect {
        if (isRtl) {
            editor.getDocument().body.style.direction = 'rtl';
        }
        editor.setContent(TABLE);
        let tableRect: DOMRect = null;
        editor.queryElements('table', table => {
            const rect = table.getBoundingClientRect();
            tableRect = rect;
        });
        return tableRect;
    }

    function runTest(
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

    it('removes the vertical inserter when moving the cursor out of the offset zone', () => {
        const rect = initialize();
        runTest(
            { x: rect.right, y: rect.top - OFFSET_Y },
            { x: rect.right / 2, y: rect.bottom },
            true,
            false
        );
    });

    it('keeps the vertical inserter when moving the cursor inside the safe zone', () => {
        const rect = initialize();
        runTest(
            { x: rect.right, y: rect.top - OFFSET_Y },
            { x: rect.right - insideTheOffset, y: rect.top },
            true,
            true
        );
    });

    it('removes the horizontal inserter when moving the cursor out of the offset zone', () => {
        const rect = initialize();
        runTest(
            { x: rect.left, y: rect.bottom },
            { x: (rect.right - rect.left) / 2, y: (rect.bottom - rect.top) / 2 },
            true,
            false
        );
    });

    it('keeps the horizontal inserter when moving the cursor inside the safe zone', () => {
        const rect = initialize();
        runTest(
            { x: rect.left, y: rect.bottom },
            { x: rect.left, y: rect.bottom - insideTheOffset },
            true,
            true
        );
    });

    it('removes the horizontal inserter when moving the cursor out of the offset zone with culture language RTL', () => {
        const rect = initialize(true);
        runTest(
            { x: rect.right, y: rect.bottom },
            { x: (rect.right - rect.left) / 2, y: (rect.bottom - rect.top) / 2 },
            true,
            false
        );
    });

    it('keeps the horizontal inserter when moving the cursor inside the safe zone with culture language RTL', () => {
        const rect = initialize(true);
        runTest(
            { x: rect.right, y: rect.bottom },
            { x: rect.right + insideTheOffset / 2, y: rect.bottom },
            true,
            true
        );
    });

    it('removes the vertical inserter when moving the cursor out of the offset zone with culture language RTL', () => {
        const rect = initialize(true);
        const cellRect = getCellRect(0, 2);

        runTest(
            { x: cellRect.left, y: cellRect.top },
            { x: (rect.right - rect.left) / 2, y: rect.bottom },
            true,
            false
        );
    });

    it('removes the vertical inserter for the first cell if the X coordinate of the cursor position is less than the half distance of the cell in LTR', () => {
        initialize(false);
        const cellRect = getCellRect(0, 0);

        runTest(
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

        runTest(
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

    // other utilities

    it('calculates the horizontal distance to left correctly', () => {
        const rect: Rect = {
            top: 0,
            bottom: 10,
            left: 5,
            right: 20,
        };
        const pos = 8;
        const dist = getHorizontalDistance(rect, pos, true);
        expect(dist).toBe(3);
    });

    it('calculates the horizontal distance to right correctly', () => {
        const rect: Rect = {
            top: 0,
            bottom: 10,
            left: 5,
            right: 20,
        };
        const pos = 8;
        const dist = getHorizontalDistance(rect, pos, false);
        expect(dist).toBe(12);
    });

    it('returns the actual plugin name', () => {
        const expectedName = 'TableResize';
        const pluginName = plugin.getName();
        expect(pluginName).toBe(expectedName);
    });

    /*it('resets table resizer and tableRectMap once Editor Input event is triggered', () => {
        const expecteVal = null;
        const event = new PluginEventType();
        event.ev
        plugin.onPluginEvent(PluginEventType.Input);

    });*/
});

describe('Table Resizer tests', () => {
    let editor: IEditor;
    let plugin: TableResize;
    const insideTheOffset = 5;

    const DELTA = 2;
    const TABLE =
        '<div style="margin: 50px"><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr></tbody></table><br></div>';
    const ADD_BUTTON = '</div>+</div>';
    const TEST_ID = 'resizerTest';

    it('adds the vertical resizer when mouse lands on each vertical border', () => {});
    it('adds the horizontal resizer when mouse lands on each horizontal border', () => {});

    it('changes the width for the current cells and cells on the right correctly', () => {});
    it('does not change the table width when resizing internal cells', () => {});
    it('changes the table width when resizing border cells', () => {});

    it('changes the height for the current cells and cells below correctly', () => {});
});
