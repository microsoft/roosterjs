import * as TestHelper from '../../../roosterjs-editor-api/test/TestHelper';
import { IEditor } from 'roosterjs-editor-types/lib';
import { TableResize } from '../../lib/TableResize';

describe('TableResize plugin tests', () => {
    let editor: IEditor;
    let plugin: TableResize;
    const insideTheOffset = 5;

    const TABLE =
        '<div><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr></tbody></table><br></div>';
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

    function initialize(): DOMRect {
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

    it('removes the inserter when moving the cursor out of the offset zone', () => {
        const rect = initialize();
        runTest({ x: rect.right, y: rect.top }, { x: rect.right / 2, y: rect.bottom }, false);
    });

    it('keeps the inserter when moving the cursor inside the sage zone', () => {
        const rect = initialize();
        runTest(
            { x: rect.right, y: rect.top },
            { x: rect.right - insideTheOffset, y: rect.top },
            true
        );
    });
});
