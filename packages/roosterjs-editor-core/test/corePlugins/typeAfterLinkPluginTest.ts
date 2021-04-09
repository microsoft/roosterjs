import TypeAfterLinkPlugin from '../../lib/corePlugins/TypeAfterLinkPlugin';
import { IEditor, PluginEventType, PositionType } from 'roosterjs-editor-types';
import { LinkInlineElement, NodeInlineElement } from 'roosterjs-editor-dom';

describe('TypeAfterLinkPlugin after a link', () => {
    let plugin: TypeAfterLinkPlugin;
    let div: HTMLElement;
    let select: jasmine.Spy;
    let getElementAtCursor: jasmine.Spy;
    let a: HTMLAnchorElement;

    beforeEach(() => {
        plugin = new TypeAfterLinkPlugin();
        div = document.createElement('div');
        document.body.appendChild(div);
        select = jasmine.createSpy('select');
        getElementAtCursor = jasmine.createSpy('getElementAtCursor').and.returnValue({});
        a = document.createElement('a');
        div.appendChild(a);

        plugin.initialize(<IEditor>(<any>{
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
                    getInlineElementAfter: () => <LinkInlineElement>null,
                };
            },
            getElementAtCursor,
            select,
        }));
    });

    afterEach(() => {
        plugin.dispose();
        div.parentNode.removeChild(div);
    });

    it('type after link', () => {
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).toHaveBeenCalledTimes(1);
        expect(select.calls.argsFor(0)[0]).toBe(a);
        expect(select.calls.argsFor(0)[1]).toBe(PositionType.After);

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
        expect(select.calls.argsFor(0)[0]).toBe(a);
        expect(select.calls.argsFor(0)[1]).toBe(PositionType.After);
        expect(getElementAtCursor).toHaveBeenCalledTimes(1);
        expect(getElementAtCursor).toHaveBeenCalledWith('A[href]');
    });
});

describe('TypeAfterLinkPlugin before a link', () => {
    let plugin: TypeAfterLinkPlugin;
    let div: HTMLElement;
    let select: jasmine.Spy;
    let getElementAtCursor: jasmine.Spy;
    let a: HTMLAnchorElement;

    beforeEach(() => {
        plugin = new TypeAfterLinkPlugin();
        div = document.createElement('div');
        document.body.appendChild(div);
        select = jasmine.createSpy('select');
        getElementAtCursor = jasmine.createSpy('getElementAtCursor').and.returnValue({});
        a = document.createElement('a');
        div.appendChild(a);

        plugin.initialize(<IEditor>(<any>{
            getSelectionRange: () => {
                return {
                    collapsed: true,
                };
            },
            getContentSearcherOfCursor: () => {
                return <any>{
                    getInlineElementAfter: () => {
                        return new LinkInlineElement(a, <any>{});
                    },
                    getInlineElementBefore: () => <LinkInlineElement>null,
                };
            },
            getElementAtCursor,
            select,
        }));
    });

    afterEach(() => {
        plugin.dispose();
        div.parentNode.removeChild(div);
    });

    it('type before link', () => {
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).toHaveBeenCalledTimes(1);
        expect(select.calls.argsFor(0)[0]).toBe(a);
        expect(select.calls.argsFor(0)[1]).toBe(PositionType.Before);

        expect(getElementAtCursor).toHaveBeenCalledTimes(1);
        expect(getElementAtCursor).toHaveBeenCalledWith('A[href]');
    });

    it('paste before link', () => {
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
        expect(select.calls.argsFor(0)[0]).toBe(a);
        expect(select.calls.argsFor(0)[1]).toBe(PositionType.Before);
        expect(getElementAtCursor).toHaveBeenCalledTimes(1);
        expect(getElementAtCursor).toHaveBeenCalledWith('A[href]');
    });
});

describe('TypeAfterLinkPlugin not after link', () => {
    let plugin: TypeAfterLinkPlugin;
    let div: HTMLElement;
    let select: jasmine.Spy;
    let getElementAtCursor: jasmine.Spy;

    beforeEach(() => {
        plugin = new TypeAfterLinkPlugin();
        div = document.createElement('div');
        document.body.appendChild(div);
        select = jasmine.createSpy('select');
        getElementAtCursor = jasmine.createSpy('select');
        const span = document.createElement('span');
        div.appendChild(span);

        plugin.initialize(<IEditor>(<any>{
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
                    getInlineElementAfter: () => {
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
        div.parentNode.removeChild(div);
    });

    it('type after link', () => {
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
    let div: HTMLElement;
    let select: jasmine.Spy;
    let getElementAtCursor: jasmine.Spy;

    beforeEach(() => {
        plugin = new TypeAfterLinkPlugin();
        div = document.createElement('div');
        document.body.appendChild(div);
        select = jasmine.createSpy('select');
        getElementAtCursor = jasmine.createSpy('getElementAtCursor');
        const a = document.createElement('a');
        div.appendChild(a);
        const span = document.createElement('span');
        div.appendChild(span);

        plugin.initialize(<IEditor>(<any>{
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
                    getInlineElementAfter: () => {
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
        div.parentNode.removeChild(div);
    });

    it('type after link', () => {
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
