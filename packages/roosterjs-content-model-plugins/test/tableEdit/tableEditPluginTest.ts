import * as TestHelper from '../TestHelper';
import { createElement } from '../../lib/pluginUtils/CreateElement/createElement';
import { DOMEventHandlerFunction, IEditor } from 'roosterjs-editor-types';
import { getModelTable } from './tableData';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';
import {
    afterTableTest,
    beforeTableTest,
    getCellRect,
    initialize,
    mouseToPoint,
} from './TableEditTestHelper';

describe('TableEditPlugin', () => {
    let editor: IEditor;
    let plugin: TableEditPlugin;
    const TEST_ID = 'inserterTest';

    let mouseOutListener: undefined | ((this: HTMLElement, ev: MouseEvent) => any);

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        plugin = new TableEditPlugin();

        spyOn(editor, 'getScrollContainer').and.returnValue(<HTMLElement>(<any>{
            addEventListener: <K extends keyof HTMLElementEventMap>(
                type: K,
                listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
                options?: boolean | AddEventListenerOptions
            ) => {
                if (type == 'mouseout') {
                    mouseOutListener = listener as (this: HTMLElement, ev: MouseEvent) => any;
                }
            },
            removeEventListener: <K extends keyof HTMLElementEventMap>(
                type: K,
                listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
                options?: boolean | EventListenerOptions
            ) => {
                if (type == 'mouseout') {
                    mouseOutListener = undefined;
                }
            },
        }));
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
        editor.dispose();
        TestHelper.removeElement(TEST_ID);
        document.body = document.createElement('body');
    });

    it('setTableEditor - Dismiss table editor on mouse out', () => {
        const ele = createElement(
            {
                tag: 'div',
                children: [
                    {
                        tag: 'div',
                        children: ['test'],
                    },
                ],
            },
            editor.getDocument()
        );
        editor.formatContentModel(model => {
            model.blocks = [getModelTable()];
            return true;
        });

        const table = editor.getDOMHelper().queryElements('table')[0];

        spyOn(plugin, 'setTableEditor').and.callThrough();

        plugin.setTableEditor(table);

        if (mouseOutListener) {
            const boundedListener = mouseOutListener.bind(ele);
            ele && spyOn(ele, 'contains').and.returnValue(false);
            boundedListener(<MouseEvent>(<any>{
                currentTarget: ele,
                relatedTarget: ele,
            }));

            expect(plugin.setTableEditor).toHaveBeenCalledWith(null);
        }
    });

    it('setTableEditor - Do not dismiss table editor on mouse out, related target is contained in scroll container', () => {
        const ele = createElement(
            {
                tag: 'div',
                children: [
                    {
                        tag: 'div',
                        children: ['test'],
                    },
                ],
            },
            editor.getDocument()
        );
        editor.formatContentModel(model => {
            model.blocks = [getModelTable()];
            return true;
        });

        const table = editor.getDOMHelper().queryElements('table')[0];

        spyOn(plugin, 'setTableEditor').and.callThrough();

        plugin.setTableEditor(table);

        if (mouseOutListener) {
            const boundedListener = mouseOutListener.bind(ele);
            ele && spyOn(ele, 'contains').and.returnValue(true);
            boundedListener(<MouseEvent>(<any>{
                currentTarget: ele,
                relatedTarget: ele,
            }));

            expect(plugin.setTableEditor).not.toHaveBeenCalledWith(null);
        }
    });

    it('setTableEditor - Do not dismiss table editor on mouse out, table editor not', () => {
        const ele = createElement(
            {
                tag: 'div',
                children: [
                    {
                        tag: 'div',
                        children: ['test'],
                    },
                ],
            },
            editor.getDocument()
        );
        editor.formatContentModel(model => {
            model.blocks = [getModelTable()];
            return true;
        });

        spyOn(plugin, 'setTableEditor').and.callThrough();

        if (mouseOutListener) {
            const boundedListener = mouseOutListener.bind(ele);
            ele && spyOn(ele, 'contains').and.returnValue(false);
            boundedListener(<MouseEvent>(<any>{
                currentTarget: ele,
                relatedTarget: ele,
            }));

            expect(plugin.setTableEditor).not.toHaveBeenCalledWith(null);
        }
    });

    it('setTableEditor - Do not dismiss table editor on mouse out, related target null', () => {
        const ele = createElement(
            {
                tag: 'div',
                children: [
                    {
                        tag: 'div',
                        children: ['test'],
                    },
                ],
            },
            editor.getDocument()
        );
        editor.formatContentModel(model => {
            model.blocks = [getModelTable()];
            return true;
        });

        const table = editor.getDOMHelper().queryElements('table')[0];

        spyOn(plugin, 'setTableEditor').and.callThrough();

        plugin.setTableEditor(table);

        if (mouseOutListener) {
            const boundedListener = mouseOutListener.bind(ele);
            ele && spyOn(ele, 'contains').and.returnValue(false);
            boundedListener(<MouseEvent>(<any>{
                currentTarget: ele,
                relatedTarget: null,
            }));

            expect(plugin.setTableEditor).not.toHaveBeenCalledWith(null);
        }
    });

    it('setTableEditor - Do not dismiss table editor on mouse out, currentTarget null', () => {
        const ele = createElement(
            {
                tag: 'div',
                children: [
                    {
                        tag: 'div',
                        children: ['test'],
                    },
                ],
            },
            editor.getDocument()
        );
        editor.formatContentModel(model => {
            model.blocks = [getModelTable()];
            return true;
        });

        const table = editor.getDOMHelper().queryElements('table')[0];

        spyOn(plugin, 'setTableEditor').and.callThrough();

        plugin.setTableEditor(table);

        if (mouseOutListener) {
            const boundedListener = mouseOutListener.bind(ele);
            ele && spyOn(ele, 'contains').and.returnValue(false);
            boundedListener(<MouseEvent>(<any>{
                currentTarget: null,
                relatedTarget: ele,
            }));

            expect(plugin.setTableEditor).not.toHaveBeenCalledWith(null);
        }
    });

    it('returns the actual plugin name', () => {
        const expectedName = 'TableEdit';
        const pluginName = plugin.getName();
        expect(pluginName).toBe(expectedName);
    });
});

describe('anchorContainer', () => {
    let editor: IEditor;
    let plugin: TableEditPlugin;
    const TEST_ID = 'cellResizerTest';
    const ANCHOR_CLASS = 'anchor_' + TEST_ID;
    let handler: Record<string, DOMEventHandlerFunction>;

    beforeEach(() => {});

    afterEach(() => {
        afterTableTest(editor, plugin, TEST_ID);
    });

    it('Table editor features, resizer and mover, inserted on anchor', () => {
        // Create editor, plugin, and table
        const setup = beforeTableTest(TEST_ID, ANCHOR_CLASS);
        editor = setup.editor;
        plugin = setup.plugin;
        handler = setup.handler;
        initialize(editor, getModelTable());

        // Move mouse to the first cell
        const cellRect = getCellRect(editor, 0, 0);
        mouseToPoint({ x: cellRect.left, y: cellRect.bottom }, handler);

        // Look for table mover and resizer on the anchor
        const anchor = editor.getDocument().getElementsByClassName(ANCHOR_CLASS)[0];
        const mover = anchor?.querySelector('#_Table_Mover');
        const resizer = anchor?.querySelector('#_Table_Resizer');
        expect(!!mover).toBe(true);
        expect(!!resizer).toBe(true);
    });

    it('Table editor features, resizer and mover, not inserted on anchor', () => {
        // Create editor, plugin, and table
        const setup = beforeTableTest(TEST_ID);
        editor = setup.editor;
        plugin = setup.plugin;
        handler = setup.handler;
        initialize(editor, getModelTable());

        // Move mouse to the first cell
        const cellRect = getCellRect(editor, 0, 0);
        mouseToPoint({ x: cellRect.left, y: cellRect.bottom }, handler);

        // Look for table mover and resizer on the anchor
        const anchor = editor.getDocument().getElementsByClassName(ANCHOR_CLASS)[0];
        const mover = anchor?.querySelector('#_Table_Mover');
        const resizer = anchor?.querySelector('#_Table_Resizer');
        expect(!!mover).toBe(false);
        expect(!!resizer).toBe(false);
    });
});
