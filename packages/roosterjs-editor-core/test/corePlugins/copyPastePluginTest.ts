import * as dom from 'roosterjs-editor-dom';
import CopyPastePlugin from '../../lib/corePlugins/CopyPastePlugin';
import {
    ClipboardData,
    DOMEventHandlerFunction,
    IEditor,
    PluginEventType,
} from 'roosterjs-editor-types';

describe('CopyPastePlugin paste', () => {
    let plugin: CopyPastePlugin;
    let handler: Record<string, DOMEventHandlerFunction>;
    let paste: jasmine.Spy;
    let tempNode: HTMLElement = null;
    let addDomEventHandler: jasmine.Spy;

    beforeEach(() => {
        handler = null;
        plugin = new CopyPastePlugin();

        addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.callFake((handlerParam: Record<string, DOMEventHandlerFunction>) => {
                handler = handlerParam;
                return () => {
                    handler = null;
                };
            });

        paste = jasmine.createSpy('paste');

        plugin.initialize(<IEditor>(<any>{
            addDomEventHandler: addDomEventHandler,
            paste,
            getSelectionRange: (): Range => null,
            getCustomData: (key: string, getter: () => any) => getter(),
            insertNode: (node: HTMLElement) => {
                tempNode = node;
                document.body.appendChild(node);
            },
            runAsync: (callback: () => void) => {
                if (tempNode) {
                    tempNode.innerHTML = 'test html';
                }
                callback();
            },
            getDocument: () => document,
            select: () => {},
        }));
    });

    afterEach(() => {
        plugin.dispose();
        if (tempNode) {
            tempNode.parentNode.removeChild(tempNode);
            tempNode = null;
        }
    });

    it('init and dispose', () => {
        expect(addDomEventHandler).toHaveBeenCalled();
        const parameter = addDomEventHandler.calls.argsFor(0)[0];
        expect(Object.keys(parameter)).toEqual(['paste', 'copy', 'cut']);
    });

    it('trigger paste event for html', () => {
        const items: ClipboardData = {
            rawHtml: '',
            text: '',
            image: null,
            types: [],
        };
        spyOn(dom, 'extractClipboardEvent').and.callFake((event, callback) => {
            callback(items);
        });

        handler.paste(<any>{});
        expect(paste).toHaveBeenCalledWith(items);
        expect(tempNode).toBeNull();
    });

    it('trigger paste event for image', () => {
        const items: ClipboardData = {
            rawHtml: '',
            text: '',
            image: <any>{},
            types: [],
        };
        spyOn(dom, 'extractClipboardEvent').and.callFake((event, callback) => {
            callback(items);
        });
        spyOn(dom, 'readFile').and.callFake((file, callback) => {
            callback('dataurl');
        });

        handler.paste(<any>{});
        expect(paste).toHaveBeenCalledWith({
            ...items,
            imageDataUri: 'dataurl',
        });
        expect(tempNode).toBeNull();
    });

    it('trigger paste, simulate IE behavioar', () => {
        const items: ClipboardData = {
            rawHtml: undefined,
            text: '',
            image: <any>{},
            types: [],
        };
        const expected = { ...items };
        spyOn(dom, 'extractClipboardEvent').and.callFake((event, callback) => {
            callback(items);
        });
        spyOn(dom, 'readFile').and.callFake((file, callback) => {
            callback('dataurl');
        });

        handler.paste(<any>{});
        expect(paste).toHaveBeenCalledWith({
            ...expected,
            rawHtml: 'test html',
            imageDataUri: 'dataurl',
        });
        expect(tempNode).not.toBeNull();
        expect(tempNode.innerHTML).toBe('');
    });
});

describe('CopyPastePlugin copy', () => {
    let plugin: CopyPastePlugin;
    let handler: Record<string, DOMEventHandlerFunction>;
    let editor: IEditor;
    let tempNode: HTMLElement = null;
    let addDomEventHandler: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;

    beforeEach(() => {
        handler = null;
        plugin = new CopyPastePlugin();

        addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.callFake((handlerParam: Record<string, DOMEventHandlerFunction>) => {
                handler = handlerParam;
                return () => {
                    handler = null;
                };
            });
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        spyOn(dom, 'addRangeToSelection');

        editor = <IEditor>(<any>{
            addDomEventHandler,
            triggerPluginEvent,
            getSelectionRange: () => <Range>{ collapsed: false },
            getContent: () => '<div>test</div><!--{"start":[0,0],"end":[0,1]}-->',
            getCustomData: (key: string, getter: () => any) => getter(),
            insertNode: (node: HTMLElement) => {
                tempNode = node;
                document.body.appendChild(node);
            },
            getDocument: () => document,
            select: () => {},
            addUndoSnapshot: (f: () => void) => f(),
            focus: () => {},
        });

        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
        if (tempNode) {
            tempNode.parentNode.removeChild(tempNode);
            tempNode = null;
        }
    });

    it('before copy', () => {
        editor.runAsync = () => {};

        const event = <Event>{};
        handler.copy(event);

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.BeforeCutCopy);
        expect(tempNode.innerHTML).toBe('<div>test</div>');

        const range = <Range>(<jasmine.Spy>dom.addRangeToSelection).calls.argsFor(0)[0];
        expect(range.startContainer).toBe(tempNode.firstChild);
        expect(range.endContainer).toBe(tempNode.firstChild);
        expect(range.startOffset).toBe(0);
        expect(range.endOffset).toBe(1);
    });

    it('after copy', () => {
        editor.runAsync = callback => callback();

        const event = <Event>{};
        handler.copy(event);

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(tempNode.innerHTML).toBe('');
    });

    it('after cut with text content', () => {
        editor.runAsync = callback => callback();
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = 'This is a test';

        editor.getSelectedRegions = () => [
            {
                rootNode: contentDiv,
                nodeBefore: null,
                nodeAfter: null,
                skipTags: [],
                fullSelectionStart: new dom.Position(contentDiv.firstChild, 3),
                fullSelectionEnd: new dom.Position(contentDiv.firstChild, 10),
            },
        ];

        const event = <Event>{};
        handler.cut(event);

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(tempNode.innerHTML).toBe('');
        expect(contentDiv.innerHTML).toBe('Thitest');
    });

    it('after cut with html content', () => {
        editor.runAsync = callback => callback();
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML =
            '<ol><li>line1</li><li><div>line2</div><div>line3</div></li><li>line4</li></ol><div>line5</div>';

        editor.getSelectedRegions = () => [
            {
                rootNode: contentDiv,
                nodeBefore: null,
                nodeAfter: null,
                skipTags: [],
                fullSelectionStart: new dom.Position(
                    contentDiv.childNodes[0].childNodes[1].childNodes[1].childNodes[0],
                    3
                ),
                fullSelectionEnd: new dom.Position(contentDiv.childNodes[1].childNodes[0], 2),
            },
        ];

        const event = <Event>{};
        handler.cut(event);

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(tempNode.innerHTML).toBe('');
        expect(contentDiv.innerHTML).toBe(
            '<ol><li>line1</li><li><div>line2</div><div>lin</div></li></ol><div>ne5</div>'
        );
    });
});
