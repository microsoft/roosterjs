import * as TestHelper from '../TestHelper';
import { createElement } from '../../lib/pluginUtils/CreateElement/createElement';
import { getModelTable } from './tableData';
import { IEditor } from 'roosterjs-content-model-types';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';

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

    it('onPluginEvent - input', () => {
        const disposerSpy = spyOn(plugin, 'setTableEditor').and.callThrough();
        plugin.onPluginEvent({ eventType: 'input', rawEvent: null });
        expect(disposerSpy).toHaveBeenCalledWith(null);
    });

    it('onPluginEvent - contentChanged', () => {
        const disposerSpy = spyOn(plugin, 'setTableEditor').and.callThrough();
        plugin.onPluginEvent({ eventType: 'contentChanged', source: null });
        expect(disposerSpy).toHaveBeenCalledWith(null);
    });

    it('onPluginEvent - scroll', () => {
        const disposerSpy = spyOn(plugin, 'setTableEditor').and.callThrough();
        plugin.onPluginEvent({
            eventType: 'scroll',
            rawEvent: null,
            scrollContainer: editor.getScrollContainer(),
        });
        expect(disposerSpy).toHaveBeenCalledWith(null);
    });

    it('onPluginEvent - zoomChanged', () => {
        const disposerSpy = spyOn(plugin, 'setTableEditor').and.callThrough();
        plugin.onPluginEvent({ eventType: 'zoomChanged', newZoomScale: 1 });
        expect(disposerSpy).toHaveBeenCalledWith(null);
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

        plugin.setTableEditor({ table, logicalRoot: null });

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

        plugin.setTableEditor({ table, logicalRoot: null });

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

        plugin.setTableEditor({ table, logicalRoot: null });

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

        plugin.setTableEditor({ table, logicalRoot: null });

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

describe('TableEditPlugin onMouseMove and table rects', () => {
    // Note: this suite uses a MOCKED editor (not a real one). A real editor attaches a
    // document 'selectionchange' listener whose async callback can fire after the editor is
    // disposed in afterEach, throwing "Editor is already disposed" and failing the full-suite
    // run. onMouseMove only needs getDocument/getDOMHelper/attachDomEvent, so a mock is enough.
    let editor: IEditor;
    let plugin: TableEditPlugin;
    let mouseMoveHandler: (event: Event) => void;
    let domTables: HTMLTableElement[];

    function setup(tableSelector?: any) {
        const scrollContainer = {
            addEventListener: () => {},
            removeEventListener: () => {},
        };
        editor = <IEditor>(<any>{
            attachDomEvent: (handlers: any) => {
                mouseMoveHandler = handlers.mousemove.beforeDispatch;
                return () => {};
            },
            getScrollContainer: () => scrollContainer,
            getDocument: () => document,
            getDOMHelper: () => ({ queryElements: () => domTables }),
        });
        plugin = new TableEditPlugin(undefined, undefined, undefined, tableSelector);
        plugin.initialize(editor);
    }

    function mouseMoveEvent(pageX: number, pageY: number, buttons: number = 0): any {
        return { pageX, pageY, buttons };
    }

    function selectorReturning(rect: Partial<DOMRect>) {
        const fakeTable = document.createElement('table');
        spyOn(fakeTable, 'getBoundingClientRect').and.returnValue(rect as DOMRect);
        return {
            fakeTable,
            selector: jasmine
                .createSpy('tableSelector')
                .and.returnValue([{ table: fakeTable, logicalRoot: null }]),
        };
    }

    beforeEach(() => {
        domTables = [];
    });

    afterEach(() => {
        plugin.dispose();
        document.body = document.createElement('body');
    });

    it('does nothing while a mouse button is pressed', () => {
        const { selector } = selectorReturning({ left: 100, right: 200, top: 100, bottom: 200 });
        setup(selector);
        const setTableEditorSpy = spyOn(plugin, 'setTableEditor');

        mouseMoveHandler(mouseMoveEvent(150, 150, /* buttons */ 1));

        expect(selector).not.toHaveBeenCalled();
        expect(setTableEditorSpy).not.toHaveBeenCalled();
    });

    it('does nothing when the editor has no default view', () => {
        const { selector } = selectorReturning({ left: 100, right: 200, top: 100, bottom: 200 });
        setup(selector);
        spyOn(editor, 'getDocument').and.returnValue(<Document>(<any>{ defaultView: null }));
        const setTableEditorSpy = spyOn(plugin, 'setTableEditor');

        mouseMoveHandler(mouseMoveEvent(150, 150));

        expect(selector).not.toHaveBeenCalled();
        expect(setTableEditorSpy).not.toHaveBeenCalled();
    });

    it('selects the table whose rect is under the mouse', () => {
        const { selector } = selectorReturning({ left: 100, right: 200, top: 100, bottom: 200 });
        setup(selector);
        const setTableEditorSpy = spyOn(plugin, 'setTableEditor').and.callThrough();

        mouseMoveHandler(mouseMoveEvent(150, 150));

        expect(selector).toHaveBeenCalledTimes(1);
        expect(setTableEditorSpy).toHaveBeenCalledTimes(1);
        const [entry] = setTableEditorSpy.calls.argsFor(0);
        expect((entry as any)?.table).toBeTruthy();
    });

    it('selects null when the mouse is outside every table rect', () => {
        const { selector } = selectorReturning({ left: 100, right: 200, top: 100, bottom: 200 });
        setup(selector);
        const setTableEditorSpy = spyOn(plugin, 'setTableEditor').and.callThrough();

        mouseMoveHandler(mouseMoveEvent(500, 500));

        expect(setTableEditorSpy).toHaveBeenCalledWith(null, jasmine.anything() as any);
    });

    it('ignores tables with an empty (all-zero) rect and caches the rect map', () => {
        const { selector } = selectorReturning({ left: 0, right: 0, top: 0, bottom: 0 });
        setup(selector);
        const setTableEditorSpy = spyOn(plugin, 'setTableEditor').and.callThrough();

        mouseMoveHandler(mouseMoveEvent(150, 150));
        mouseMoveHandler(mouseMoveEvent(160, 160));

        // The table with an all-zero rect is filtered out, so nothing is ever under the mouse
        expect(setTableEditorSpy).toHaveBeenCalledWith(null, jasmine.anything() as any);
        // Rect map is cached after the first build, so the selector runs only once
        expect(selector).toHaveBeenCalledTimes(1);
    });

    it('forwards the mouse position to the active table editor', () => {
        const { selector } = selectorReturning({ left: 100, right: 200, top: 100, bottom: 200 });
        setup(selector);
        spyOn(plugin, 'setTableEditor'); // no-op so the fake editor is preserved
        const onMouseMoveSpy = jasmine.createSpy('onMouseMove');
        (plugin as any).tableEditor = { onMouseMove: onMouseMoveSpy, dispose: () => {} };

        mouseMoveHandler(mouseMoveEvent(150, 175));

        expect(onMouseMoveSpy).toHaveBeenCalledWith(150, 175);
    });

    it('uses the default table selector to pick up content-editable tables', () => {
        // A content-editable table that the default selector should pick up
        const wrapper = document.createElement('div');
        wrapper.contentEditable = 'true';
        const table = document.createElement('table');
        wrapper.appendChild(table);
        document.body.appendChild(wrapper);
        domTables = [table];

        setup(/* default selector */);
        const setTableEditorSpy = spyOn(plugin, 'setTableEditor').and.callThrough();

        // Any position works; this exercises defaultTableSelector + ensureTableRects
        mouseMoveHandler(mouseMoveEvent(5, 5));

        expect(setTableEditorSpy).toHaveBeenCalled();
    });

    it('disposes an active table editor on dispose', () => {
        setup(/* default selector */);
        const disposeSpy = jasmine.createSpy('dispose');
        (plugin as any).tableEditor = { dispose: disposeSpy };

        plugin.dispose();

        expect(disposeSpy).toHaveBeenCalled();
        expect((plugin as any).tableEditor).toBeNull();
    });
});
