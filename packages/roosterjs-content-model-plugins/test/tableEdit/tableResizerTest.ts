import { getModelTable } from './tableData';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';
import {
    ContentModelTable,
    DOMEventHandlerFunction,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';
import {
    Position,
    afterTableTest,
    beforeTableTest,
    getCellRect,
    getCurrentTable,
    getTableRectSet,
    initialize,
    moveAndResize,
    resizeDirection,
} from './TableEditTestHelper';

const TABLE_RESIZER_ID = '_Table_Resizer';

describe('Table Resizer tests', () => {
    let editor: IEditor;
    let plugin: TableEditPlugin;
    const TEST_ID = 'resizerTest';
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

    /************************** Resizer removing tests **************************/

    function removeResizerTest(pluginEvent: PluginEvent) {
        let resizer: HTMLElement | null = null;
        plugin.initialize(editor);
        initialize(editor, getModelTable());
        const cellRect = getCellRect(editor, 0, 0);
        handler.mousemove(
            new MouseEvent('mousemove', { clientX: cellRect?.right, clientY: cellRect?.bottom })
        );
        resizer = editor.getDocument().getElementById(TABLE_RESIZER_ID);
        expect(!!resizer).toBe(true);
        plugin.onPluginEvent(pluginEvent);
        resizer = editor.getDocument().getElementById(TABLE_RESIZER_ID);
        expect(!!resizer).toBe(false);
    }

    xit('removes table resizer on input', () => {
        const pluginEvent: PluginEvent = {
            eventType: 'input',
            rawEvent: null,
        };
        removeResizerTest(pluginEvent);
    });

    xit('removes table resizer on content change', () => {
        const pluginEvent: PluginEvent = {
            eventType: 'contentChanged',
            source: null,
        };
        removeResizerTest(pluginEvent);
    });

    xit('removes table resizer on scrolling', () => {
        const pluginEvent: PluginEvent = {
            eventType: 'scroll',
            scrollContainer: editor.getDocument().body as HTMLElement,
            rawEvent: null,
        };
        removeResizerTest(pluginEvent);
    });

    /************************ Resizing table related tests ************************/

    function resizeWholeTableTest(
        table: ContentModelTable,
        growth: number,
        direction: resizeDirection
    ) {
        const delta = 20 * growth;
        const tableRect = initialize(editor, table);
        const mouseStart = { x: tableRect.right + 3, y: tableRect.bottom + 3 };
        let mouseEnd: Position = { x: 0, y: 0 };
        switch (direction) {
            case 'horizontal':
                mouseEnd = { x: tableRect.right + 3 + delta, y: tableRect.bottom + 3 };
                break;
            case 'vertical':
                mouseEnd = { x: tableRect.right + 3, y: tableRect.bottom + 3 + delta };
                break;
            case 'both':
                mouseEnd = { x: tableRect.right + 3 + delta, y: tableRect.bottom + 3 + delta };
                break;
        }
        const beforeSize = getTableRectSet(getCurrentTable(editor));
        moveAndResize(mouseStart, mouseEnd, 'both', editor, handler, TEST_ID);
        const afterSize = getTableRectSet(getCurrentTable(editor));
        compareTableRects(beforeSize, afterSize, growth, direction);
    }

    function verifyTableRectChange(
        rect1: DOMRect,
        rect2: DOMRect,
        growth: number,
        direction: resizeDirection
    ): boolean {
        switch (direction) {
            case 'horizontal':
                return growth > 0 ? rect1.width < rect2.width : rect1.width > rect2.width;
            case 'vertical':
                return growth > 0 ? rect1.height < rect2.height : rect1.height > rect2.height;
            case 'both':
                return growth > 0
                    ? rect1.width < rect2.width && rect1.height < rect2.height
                    : rect1.width > rect2.width && rect1.height > rect2.height;
        }
    }

    function verifyCellRectChange(
        rect1: DOMRect,
        rect2: DOMRect,
        growth: number,
        direction: resizeDirection
    ): boolean {
        switch (direction) {
            case 'horizontal':
                return rect1.top == rect2.top && rect1.bottom == rect2.bottom && growth > 0
                    ? rect1.left <= rect2.left && rect1.right <= rect2.right
                    : rect1.left >= rect2.left && rect1.right >= rect2.right;
            case 'vertical':
                return rect1.left == rect2.left && rect1.right == rect2.right && growth > 0
                    ? rect1.top <= rect2.top && rect1.bottom <= rect2.bottom
                    : rect1.top >= rect2.top && rect1.bottom >= rect2.bottom;
            case 'both':
                return growth > 0
                    ? rect1.left <= rect2.left &&
                          rect1.right <= rect2.right &&
                          rect1.top <= rect2.top &&
                          rect1.bottom <= rect2.bottom
                    : rect1.left >= rect2.left &&
                          rect1.right >= rect2.right &&
                          rect1.top >= rect2.top &&
                          rect1.bottom >= rect2.bottom;
        }
    }

    function compareTableRects(
        beforeTableRectSet1: DOMRect[],
        afterTableRectSet2: DOMRect[],
        growth: number,
        direction: resizeDirection
    ) {
        expect(beforeTableRectSet1.length).toBe(afterTableRectSet2.length);
        beforeTableRectSet1.forEach((rect, i) => {
            i == 0
                ? expect(
                      verifyTableRectChange(rect, afterTableRectSet2[i], growth, direction)
                  ).toBe(true) // Verify a change to whole table size
                : expect(verifyCellRectChange(rect, afterTableRectSet2[i], growth, direction)).toBe(
                      true // Verify a change to each cell size
                  );
        });
    }

    it('increases the width of the table', () => {
        resizeWholeTableTest(getModelTable(), 1, 'horizontal');
    });

    it('increases the height of the table', () => {
        resizeWholeTableTest(getModelTable(), 1, 'vertical');
    });

    it('increases the width and height of the table', () => {
        resizeWholeTableTest(getModelTable(), 1, 'both');
    });

    it('decreases the width of the table', () => {
        resizeWholeTableTest(getModelTable(), -1, 'horizontal');
    });

    it('decreases the height of the table', () => {
        resizeWholeTableTest(getModelTable(), -1, 'vertical');
    });

    it('decreases the width and height of the table', () => {
        resizeWholeTableTest(getModelTable(), -1, 'both');
    });
});
