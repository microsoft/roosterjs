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
