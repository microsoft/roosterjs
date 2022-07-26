import * as TestHelper from 'roosterjs-editor-api/test/TestHelper';
import {
    IEditor,
    PluginEvent,
    PluginEventType,
    DOMEventHandlerFunction,
    Keys,
    ClipboardData,
} from 'roosterjs-editor-types';
import { CutPasteListChain } from '../../lib/CutPasteListChain';
import * as DomTestHelper from 'roosterjs-editor-dom/test/DomTestHelper';
import { VListChain } from 'roosterjs-editor-dom';
//import * as VListChain from 'roosterjs-editor-dom/lib/list/VListChain';

describe('Table Resizer/Inserter tests', () => {
    let editor: IEditor;
    let plugin: CutPasteListChain;
    const TEST_ID = 'inserterTest';

    //let handler: Record<string, DOMEventHandlerFunction> | null;
    //let addDomEventHandler: jasmine.Spy;

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        spyOn(VListChain, 'createListChains').and.callThrough();
        plugin = new CutPasteListChain();

        //handler = null;
        /*addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.callFake((handlerParam: Record<string, DOMEventHandlerFunction>) => {
                handler = handlerParam;
                return () => {
                    handler = null;
                };
            });*/

        /*editor = <IEditor>(<any>{
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
        });*/

        plugin.initialize(editor);
    });

    afterEach(() => {
        editor.dispose();
        plugin.dispose();
        TestHelper.removeElement(TEST_ID);
        document.body = document.createElement('body');
    });

    it('returns the actual plugin name', () => {
        const expectedName = 'CutPasteListChain';
        const pluginName = plugin.getName();
        expect(pluginName).toBe(expectedName);
    });

    function createPluginEventBeforeCutCopy(root: HTMLElement) {
        const range = DomTestHelper.createRangeFromChildNodes(root);

        const pluginEvent: PluginEvent = {
            eventType: PluginEventType.BeforeCutCopy,
            rawEvent: <any>{
                which: Keys.NULL,
            },
            clonedRoot: root,
            range,
            isCut: true,
        };
        return pluginEvent;
    }

    function createPluginEventBeforePaste(testString: string) {
        const clipboardData: ClipboardData = {
            types: [],
            text: testString,
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
            customValues: {},
        };

        const pluginEvent: PluginEvent = {
            eventType: PluginEventType.BeforePaste,
            clipboardData,
            fragment: null,
            sanitizingOption: {},
            htmlBefore: null,
            htmlAfter: null,
            htmlAttributes: {},
        };

        return pluginEvent;
    }

    it('caches the list chain with cut', () => {
        const testString: string = 'this is a test';
        const root = document.createElement('div');
        root.innerHTML = testString;
        const expectedText: string = testString;

        const pluginEvent = createPluginEventBeforeCutCopy(root);

        plugin.onPluginEvent(pluginEvent);
        expect(VListChain.createListChains).toHaveBeenCalled();
        expect(root.innerHTML).toBe(expectedText);
    });

    it('caches the list chain with paste', () => {
        const testString: string = 'this is a test';
        const root = document.createElement('div');
        root.innerHTML = testString;
        const expectedText: string = testString;

        const pluginEvent = createPluginEventBeforePaste(testString);

        plugin.onPluginEvent(pluginEvent);
        expect(VListChain.createListChains).toHaveBeenCalled();
        expect(root.innerHTML).toBe(expectedText);
    });

    /*it('calls experimentCommitListChains with ContentChanged', () => {
        const testString: string = 'this is a test';
        const root = document.createElement('div');
        root.innerHTML = testString;

        const cutEvent = createPluginEventBeforeCutCopy(root);
        plugin.onPluginEvent(cutEvent);

        const contentChangedEvent: PluginEvent = {
            eventType: PluginEventType.ContentChanged,
            source: 'Paste',
        };
        plugin.onPluginEvent(contentChangedEvent);

        expect(expectedChangeSource).toHaveBeenCalled();
    });*/
});
