import * as addRangeToSelection from 'roosterjs-editor-dom/lib/selection/addRangeToSelection';
import * as extractClipboardEvent from 'roosterjs-editor-dom/lib/clipboard/extractClipboardEvent';
import CopyPastePlugin from '../../lib/corePlugins/CopyPastePlugin';
import { Position } from 'roosterjs-editor-dom';
import {
    ClipboardData,
    DOMEventHandlerFunction,
    IEditor,
    PluginEventType,
    SelectionRangeTypes,
    BeforeCutCopyEvent,
} from 'roosterjs-editor-types';

describe('CopyPastePlugin paste', () => {
    let plugin: CopyPastePlugin;
    let handler: Record<string, DOMEventHandlerFunction>;
    let paste: jasmine.Spy;
    let tempNode: HTMLElement = null;
    let addDomEventHandler: jasmine.Spy;

    function getEditor(disposeResult: boolean = false) {
        handler = null;
        plugin = new CopyPastePlugin({});

        addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.callFake((handlerParam: Record<string, DOMEventHandlerFunction>) => {
                handler = handlerParam;
                return () => {
                    handler = null;
                };
            });

        paste = jasmine.createSpy('paste');

        return <IEditor>(<any>{
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
            isFeatureEnabled: () => false,
            isDisposed: () => disposeResult,
        });
    }

    beforeEach(() => {
        plugin = new CopyPastePlugin({});
    });

    afterEach(() => {
        plugin.dispose();
        if (tempNode) {
            tempNode.parentNode.removeChild(tempNode);
            tempNode = null;
        }
    });

    it('init and dispose', () => {
        plugin.initialize(getEditor());
        expect(addDomEventHandler).toHaveBeenCalled();
        const parameter = addDomEventHandler.calls.argsFor(0)[0];
        expect(Object.keys(parameter)).toEqual(['paste', 'copy', 'cut']);
    });

    it('trigger paste event for html', () => {
        plugin.initialize(getEditor());
        const items: ClipboardData = {
            rawHtml: '',
            text: '',
            image: null,
            files: [],
            types: [],
            customValues: {},
        };
        spyOn(extractClipboardEvent, 'default').and.callFake((event, callback) => {
            callback(items);
        });

        handler.paste(<any>{});
        expect(paste).toHaveBeenCalledWith(items);
        expect(tempNode).toBeNull();
    });

    it('Editor disposed, do not handle.', () => {
        plugin.initialize(getEditor(true /* disposeResult */));
        const items: ClipboardData = {
            rawHtml: '',
            text: '',
            image: null,
            files: [],
            types: [],
            customValues: {},
        };
        spyOn(extractClipboardEvent, 'default').and.callFake((event, callback) => {
            callback(items);
        });

        handler.paste(<any>{});
        expect(paste).not.toHaveBeenCalled();
        expect(tempNode).toBeNull();
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
        plugin = new CopyPastePlugin({});

        addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.callFake((handlerParam: Record<string, DOMEventHandlerFunction>) => {
                handler = handlerParam;
                return () => {
                    handler = null;
                };
            });
        triggerPluginEvent = jasmine
            .createSpy('triggerPluginEvent')
            .and.callFake(
                (
                    eventType: PluginEventType.BeforeCutCopy,
                    data: Pick<
                        BeforeCutCopyEvent,
                        'eventDataCache' | 'rawEvent' | 'clonedRoot' | 'range' | 'isCut'
                    >,
                    broadcast?: boolean
                ) => {
                    return {
                        clonedRoot: tempNode,
                        range: <Range>{ collapsed: false },
                        rawEvent: event as ClipboardEvent,
                        isCut: false,
                    };
                }
            );
        spyOn(addRangeToSelection, 'default');

        editor = <IEditor>(<any>{
            addDomEventHandler,
            triggerPluginEvent,
            getSelectionRange: () => <Range>{ collapsed: false },
            getContent: () => '<div>test</div><!--{"start":[0,0],"end":[0,1]}-->',
            getCustomData: (key: string, getter: () => any) => {
                tempNode = getter();
                return tempNode;
            },
            insertNode: (node: HTMLElement) => {
                tempNode = node;
                document.body.appendChild(node);
            },
            getDocument: () => document,
            select: () => {},
            addUndoSnapshot: (f: () => void) => f(),
            focus: () => {},
            getTrustedHTMLHandler: (html: string) => html,
            getSelectionRangeEx: () => {
                return {
                    type: SelectionRangeTypes.Normal,
                    ranges: [<Range>{ collapsed: false }],
                    areAllCollapsed: false,
                };
            },
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
        editor.runAsync = () => null;

        const event = <Event>{};
        handler.copy(event);

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.BeforeCutCopy);
        expect(tempNode.innerHTML).toBe('<div>test</div>');

        const range = <Range>(<jasmine.Spy>addRangeToSelection.default).calls.argsFor(0)[0];
        expect(range.startContainer).toBe(tempNode.firstChild);
        expect(range.endContainer).toBe(tempNode.firstChild);
        expect(range.startOffset).toBe(0);
        expect(range.endOffset).toBe(1);
    });

    it('after copy', () => {
        editor.runAsync = callback => {
            callback(editor);
            return null;
        };

        const event = <Event>{};
        handler.copy(event);

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(tempNode.innerHTML).toBe('');
    });

    it('after cut with text content', () => {
        editor.runAsync = callback => {
            callback(editor);
            return null;
        };
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = 'This is a test';

        editor.getSelectedRegions = () => [
            {
                rootNode: contentDiv,
                nodeBefore: null,
                nodeAfter: null,
                skipTags: [],
                fullSelectionStart: new Position(contentDiv.firstChild, 3),
                fullSelectionEnd: new Position(contentDiv.firstChild, 10),
            },
        ];

        editor.deleteSelectedContent = () => {
            let html = contentDiv.innerHTML;
            html = html.substr(0, 3) + html.substr(10);
            contentDiv.innerHTML = html;
            return null;
        };

        const event = <Event>{};
        handler.cut(event);

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(tempNode.innerHTML).toBe('');
        expect(contentDiv.innerHTML).toBe('Thitest');
    });

    it('after cut with html content', () => {
        editor.runAsync = callback => {
            callback(editor);
            return null;
        };
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML =
            '<ol><li>line1</li><li><div>line2</div><div>line3</div></li><li>line4</li></ol><div>line5</div>';

        editor.getSelectedRegions = () => [
            {
                rootNode: contentDiv,
                nodeBefore: null,
                nodeAfter: null,
                skipTags: [],
                fullSelectionStart: new Position(
                    contentDiv.childNodes[0].childNodes[1].childNodes[1].childNodes[0],
                    3
                ),
                fullSelectionEnd: new Position(contentDiv.childNodes[1].childNodes[0], 2),
            },
        ];

        editor.deleteSelectedContent = () => {
            let html = contentDiv.innerHTML;
            html = html.substr(0, 46) + '</div></li></ol><div>' + html.substr(85);
            contentDiv.innerHTML = html;
            return null;
        };

        const event = <Event>{};
        handler.cut(event);

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(tempNode.innerHTML).toBe('');
        expect(contentDiv.innerHTML).toBe(
            '<ol><li>line1</li><li><div>line2</div><div>lin</div></li></ol><div>ne5</div>'
        );
    });
});
