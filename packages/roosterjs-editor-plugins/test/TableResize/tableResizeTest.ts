import * as TestHelper from '../../../roosterjs-editor-api/test/TestHelper';
import { IEditor } from 'roosterjs-editor-types/lib';
import { TableResize } from '../../lib/TableResize';

describe('TableResize plugin tests', () => {
    let editor: IEditor;
    let plugin: TableResize;
    const insideTheOffset = 5;

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

    function runTest(mouseStart: Position, mouseEnd: Position, expectedResult: boolean) {
        const editorDiv = editor.getDocument().getElementById(TEST_ID);

        let mouseEvent = new MouseEvent('mousemove', {
            clientX: mouseStart.x,
            clientY: mouseStart.y,
        });

        editorDiv.dispatchEvent(mouseEvent);

        const body = editor.getDocument().body;

        expect(body.innerHTML.includes(ADD_BUTTON)).toBe(true);

        mouseEvent = new MouseEvent('mousemove', {
            clientX: mouseEnd.x,
            clientY: mouseEnd.y,
        });
        editorDiv.dispatchEvent(mouseEvent);
        expect(body.innerHTML.includes(ADD_BUTTON)).toBe(expectedResult);
    }

    it('removes the vertical inserter when moving the cursor out of the offset zone', () => {
        const rect = initialize();
        runTest({ x: rect.right, y: rect.top }, { x: rect.right / 2, y: rect.bottom }, false);
    });

    it('keeps the vertical inserter when moving the cursor inside the safe zone', () => {
        const rect = initialize();
        runTest(
            { x: rect.right, y: rect.top },
            { x: rect.right - insideTheOffset, y: rect.top },
            true
        );
    });

    it('removes the horizontal inserter when moving the cursor out of the offset zone', () => {
        const rect = initialize();
        runTest(
            { x: rect.left, y: rect.bottom },
            { x: (rect.right - rect.left) / 2, y: (rect.bottom - rect.top) / 2 },
            false
        );
    });

    it('keeps the horizontal inserter when moving the cursor inside the safe zone', () => {
        const rect = initialize();
        runTest(
            { x: rect.left, y: rect.bottom },
            { x: rect.left, y: rect.bottom - insideTheOffset },
            true
        );
    });

    it('removes the vertical inserter when moving the cursor out of the offset zone with culture language RTL', () => {
        const rect = initialize(true);
        runTest(
            { x: rect.left, y: rect.top },
            { x: (rect.right - rect.left) / 2, y: rect.bottom },
            false
        );
    });

    it('keeps the vertical inserter when moving the cursor inside the safe zone with culture language RTL', () => {
        const rect = initialize(true);
        runTest(
            { x: rect.left, y: rect.top },
            { x: rect.left, y: rect.top + insideTheOffset },
            true
        );
    });

    it('removes the horizontal inserter when moving the cursor out of the offset zone with culture language RTL', () => {
        const rect = initialize(true);
        runTest(
            { x: rect.right, y: rect.bottom },
            { x: (rect.right - rect.left) / 2, y: (rect.bottom - rect.top) / 2 },
            false
        );
    });

    it('keeps the horitzontal inserter when moving the cursor inside the safe zone with culture language RTL', () => {
        const rect = initialize(true);
        runTest(
            { x: rect.left, y: rect.top },
            { x: rect.left + insideTheOffset, y: rect.top },
            true
        );
    });
});
