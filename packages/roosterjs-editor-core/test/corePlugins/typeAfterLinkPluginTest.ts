import Editor from '../../lib/editor/Editor';
import TypeAfterLinkPlugin from '../../lib/corePlugins/typeAfterLink/TypeAfterLinkPlugin';
import { BrowserInfo, PluginEventType, Wrapper } from 'roosterjs-editor-types';
import { LinkInlineElement, NodeInlineElement } from 'roosterjs-editor-dom';

describe('TypeAfterLinkPlugin', () => {
    let plugin: TypeAfterLinkPlugin;
    let state: Wrapper<BrowserInfo>;
    let div: HTMLElement;
    let select: jasmine.Spy;
    let getElementAtCursor: jasmine.Spy;

    beforeEach(() => {
        plugin = new TypeAfterLinkPlugin();
        state = plugin.getState();
        div = document.createElement('div');
        document.body.appendChild(div);
        select = jasmine.createSpy('select');
        getElementAtCursor = jasmine.createSpy('getElementAtCursor').and.returnValue({});
        const a = document.createElement('a');
        div.appendChild(a);

        plugin.initialize(<Editor>(<any>{
            getSelectionRange: () => {
                return {
                    collapsed: true,
                };
            },
            getContentSearcherOfCursor: () => {
                return <any>{
                    getInlineElementBefore: () => {
                        return new LinkInlineElement(a, <any>{});
                    },
                };
            },
            getElementAtCursor,
            select,
        }));
    });

    afterEach(() => {
        plugin.dispose();
        state = null;
        div.parentNode.removeChild(div);
    });

    it('type after link', () => {
        state.value = {
            isFirefox: true,
        };

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).toHaveBeenCalledTimes(1);
        expect(select.calls.argsFor(0)[0].node).toBe(div);
        expect(select.calls.argsFor(0)[0].offset).toBe(1);

        expect(getElementAtCursor).toHaveBeenCalledTimes(1);
        expect(getElementAtCursor).toHaveBeenCalledWith('A[href]');
    });

    it('paste after link', () => {
        plugin.onPluginEvent({
            eventType: PluginEventType.BeforePaste,
            clipboardData: null,
            fragment: null,
            sanitizingOption: null,
            htmlBefore: null,
            htmlAfter: null,
            htmlAttributes: null,
        });

        expect(select).toHaveBeenCalledTimes(1);
        expect(select.calls.argsFor(0)[0].node).toBe(div);
        expect(select.calls.argsFor(0)[0].offset).toBe(1);
        expect(getElementAtCursor).toHaveBeenCalledTimes(1);
        expect(getElementAtCursor).toHaveBeenCalledWith('A[href]');
    });
});

describe('TypeAfterLinkPlugin not after link', () => {
    let plugin: TypeAfterLinkPlugin;
    let state: Wrapper<BrowserInfo>;
    let div: HTMLElement;
    let select: jasmine.Spy;
    let getElementAtCursor: jasmine.Spy;

    beforeEach(() => {
        plugin = new TypeAfterLinkPlugin();
        state = plugin.getState();
        div = document.createElement('div');
        document.body.appendChild(div);
        select = jasmine.createSpy('select');
        getElementAtCursor = jasmine.createSpy('select');
        const span = document.createElement('span');
        div.appendChild(span);

        plugin.initialize(<Editor>(<any>{
            getSelectionRange: () => {
                return {
                    collapsed: true,
                };
            },
            getContentSearcherOfCursor: () => {
                return <any>{
                    getInlineElementBefore: () => {
                        return new NodeInlineElement(span, <any>{});
                    },
                };
            },
            select,
            getElementAtCursor,
        }));
    });

    afterEach(() => {
        plugin.dispose();
        state = null;
        div.parentNode.removeChild(div);
    });

    it('type after link', () => {
        state.value = {
            isFirefox: true,
        };

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).not.toHaveBeenCalled();
    });

    it('paste after link', () => {
        plugin.onPluginEvent({
            eventType: PluginEventType.BeforePaste,
            clipboardData: null,
            fragment: null,
            sanitizingOption: null,
            htmlBefore: null,
            htmlAfter: null,
            htmlAttributes: null,
        });

        expect(select).not.toHaveBeenCalled();
        expect(getElementAtCursor).toHaveBeenCalledTimes(1);
        expect(getElementAtCursor).toHaveBeenCalledWith('A[href]');
    });
});

describe('TypeAfterLinkPlugin for expanded range', () => {
    let plugin: TypeAfterLinkPlugin;
    let state: Wrapper<BrowserInfo>;
    let div: HTMLElement;
    let select: jasmine.Spy;
    let getElementAtCursor: jasmine.Spy;

    beforeEach(() => {
        plugin = new TypeAfterLinkPlugin();
        state = plugin.getState();
        div = document.createElement('div');
        document.body.appendChild(div);
        select = jasmine.createSpy('select');
        getElementAtCursor = jasmine.createSpy('getElementAtCursor');
        const a = document.createElement('a');
        div.appendChild(a);

        plugin.initialize(<Editor>(<any>{
            getSelectionRange: () => {
                return {
                    collapsed: false,
                };
            },
            getContentSearcherOfCursor: () => {
                return <any>{
                    getInlineElementBefore: () => {
                        return new LinkInlineElement(a, <any>{});
                    },
                };
            },
            select,
            getElementAtCursor,
        }));
    });

    afterEach(() => {
        plugin.dispose();
        state = null;
        div.parentNode.removeChild(div);
    });

    it('type after link', () => {
        state.value = {
            isFirefox: true,
        };

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).not.toHaveBeenCalled();
        expect(getElementAtCursor).not.toHaveBeenCalled();
    });

    it('paste after link', () => {
        plugin.onPluginEvent({
            eventType: PluginEventType.BeforePaste,
            clipboardData: null,
            fragment: null,
            sanitizingOption: null,
            htmlBefore: null,
            htmlAfter: null,
            htmlAttributes: null,
        });

        expect(select).not.toHaveBeenCalled();
        expect(getElementAtCursor).not.toHaveBeenCalled();
    });
});
