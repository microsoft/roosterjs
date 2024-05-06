import * as matchLink from 'roosterjs-content-model-api/lib/modelApi/link/matchLink';
import { HyperlinkPlugin } from '../../lib/hyperlink/HyperlinkPlugin';
import {
    DOMEventHandlerFunction,
    DOMEventRecord,
    DOMHelper,
    EditorEnvironment,
    IEditor,
} from 'roosterjs-content-model-types';

describe('HyperlinkPlugin', () => {
    const MockedTooltip = 'Tooltip';

    let editor: IEditor;
    let mockedDomHelper: DOMHelper;
    let mockedEnvironment: EditorEnvironment;
    let mockedWindow: Window;

    let attachDomEventSpy: jasmine.Spy;
    let findClosestElementAncestorSpy: jasmine.Spy;
    let setDomAttributeSpy: jasmine.Spy;
    let openSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let matchLinkSpy: jasmine.Spy;

    beforeEach(() => {
        findClosestElementAncestorSpy = jasmine.createSpy('findClosestElementAncestor');
        attachDomEventSpy = jasmine.createSpy('attachDomEvent');
        setDomAttributeSpy = jasmine.createSpy('setDomAttribute');
        openSpy = jasmine.createSpy('open');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        matchLinkSpy = spyOn(matchLink, 'matchLink');

        mockedDomHelper = {
            findClosestElementAncestor: findClosestElementAncestorSpy,
            setDomAttribute: setDomAttributeSpy,
        } as any;
        mockedEnvironment = {} as any;
        mockedWindow = {
            open: openSpy,
        } as any;

        editor = {
            getDOMHelper: () => mockedDomHelper,
            getEnvironment: () => mockedEnvironment,
            attachDomEvent: attachDomEventSpy,
            getDocument: () => ({
                defaultView: mockedWindow,
            }),
            getDOMSelection: getDOMSelectionSpy,
        } as any;
    });

    it('MouseOver', () => {
        const tooltipSpy = jasmine.createSpy('tooltip').and.returnValue(MockedTooltip);
        const plugin = new HyperlinkPlugin(tooltipSpy);
        const mockedNode = 'NODE' as any;
        const mockedNode2 = 'NODE2' as any;

        let mouseOver: DOMEventHandlerFunction | undefined;

        attachDomEventSpy.and.callFake((eventMap: Record<string, DOMEventRecord>) => {
            mouseOver = eventMap.mouseover.beforeDispatch!;
        });

        plugin.initialize(editor);

        expect(mouseOver).toBeDefined();

        const mockedUrl = 'Url';
        const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedUrl);
        const mockedLink = {
            getAttribute: getAttributeSpy,
        } as any;

        findClosestElementAncestorSpy.and.callFake((node: Node) => {
            return node == mockedNode ? mockedLink : null;
        });

        mouseOver!({
            type: 'mouseover',
            target: mockedNode2,
        } as any);

        expect(findClosestElementAncestorSpy).toHaveBeenCalledWith(mockedNode2, 'a[href]');
        expect(getAttributeSpy).not.toHaveBeenCalled();
        expect(tooltipSpy).not.toHaveBeenCalled();
        expect(setDomAttributeSpy).not.toHaveBeenCalled();

        mouseOver!({
            type: 'mouseover',
            target: mockedNode,
        } as any);

        expect(findClosestElementAncestorSpy).toHaveBeenCalledWith(mockedNode, 'a[href]');
        expect(getAttributeSpy).toHaveBeenCalledWith('href');
        expect(tooltipSpy).toHaveBeenCalledWith(mockedUrl, mockedLink);
        expect(setDomAttributeSpy).toHaveBeenCalledWith('title', MockedTooltip);

        plugin.dispose();
    });

    it('MouseOut', () => {
        const tooltipSpy = jasmine.createSpy('tooltip').and.returnValue(MockedTooltip);
        const plugin = new HyperlinkPlugin(tooltipSpy);
        const mockedNode = 'NODE' as any;

        let mouseOut: DOMEventHandlerFunction | undefined;

        attachDomEventSpy.and.callFake((eventMap: Record<string, DOMEventRecord>) => {
            mouseOut = eventMap.mouseout.beforeDispatch!;
        });

        plugin.initialize(editor);

        expect(mouseOut).toBeDefined();

        const mockedUrl = 'Url';
        const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedUrl);
        const mockedLink = {
            getAttribute: getAttributeSpy,
        } as any;

        findClosestElementAncestorSpy.and.callFake((node: Node) => {
            return node == mockedNode ? mockedLink : null;
        });

        mouseOut!({
            type: 'mouseout',
            target: mockedNode,
        } as any);

        expect(findClosestElementAncestorSpy).toHaveBeenCalledWith(mockedNode, 'a[href]');
        expect(getAttributeSpy).toHaveBeenCalledWith('href');
        expect(tooltipSpy).not.toHaveBeenCalled();
        expect(setDomAttributeSpy).toHaveBeenCalledWith('title', null);

        plugin.dispose();
    });

    it('mouseUp', () => {
        const plugin = new HyperlinkPlugin();
        const mockedUrl = 'Url';
        const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedUrl);
        const mockedNode = 'NODE' as any;
        const mockedLink = {
            getAttribute: getAttributeSpy,
        } as any;
        const preventDefaultSpy = jasmine.createSpy('preventDefault');

        findClosestElementAncestorSpy.and.returnValue(mockedLink);

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                target: mockedNode,
                ctrlKey: false,
                button: 0,
                preventDefault: preventDefaultSpy,
            },
        } as any);
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                target: mockedNode,
                ctrlKey: true,
                button: 1,
                preventDefault: preventDefaultSpy,
            },
        } as any);
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: false,
            rawEvent: {
                target: mockedNode,
                ctrlKey: true,
                button: 0,
                preventDefault: preventDefaultSpy,
            },
        } as any);

        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(openSpy).not.toHaveBeenCalled();

        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                target: mockedNode,
                ctrlKey: true,
                button: 0,
                preventDefault: preventDefaultSpy,
            },
        } as any);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(openSpy).toHaveBeenCalledWith(mockedUrl, '_blank');

        plugin.dispose();
    });

    it('mouseUp with target', () => {
        const mockedTarget = 'target';
        const plugin = new HyperlinkPlugin(undefined, mockedTarget);
        const mockedUrl = 'Url';
        const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedUrl);
        const mockedNode = 'NODE' as any;
        const mockedLink = {
            getAttribute: getAttributeSpy,
        } as any;
        const preventDefaultSpy = jasmine.createSpy('preventDefault');

        findClosestElementAncestorSpy.and.returnValue(mockedLink);

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                target: mockedNode,
                ctrlKey: true,
                button: 0,
                preventDefault: preventDefaultSpy,
            },
        } as any);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(openSpy).toHaveBeenCalledWith(mockedUrl, mockedTarget);

        plugin.dispose();
    });

    it('mouseUp with onLinkClick parameter', () => {
        const onLinkClickSpy = jasmine.createSpy('onLinkClick');
        const plugin = new HyperlinkPlugin(undefined, undefined, onLinkClickSpy);
        const mockedUrl = 'Url';
        const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedUrl);
        const mockedNode = 'NODE' as any;
        const mockedLink = {
            getAttribute: getAttributeSpy,
        } as any;
        const preventDefaultSpy = jasmine.createSpy('preventDefault');

        findClosestElementAncestorSpy.and.returnValue(mockedLink);

        plugin.initialize(editor);

        onLinkClickSpy.and.returnValue(true);

        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                target: mockedNode,
                ctrlKey: true,
                button: 0,
                preventDefault: preventDefaultSpy,
            },
        } as any);

        expect(findClosestElementAncestorSpy).toHaveBeenCalledWith(mockedNode, 'a[href]');
        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(openSpy).not.toHaveBeenCalled();

        onLinkClickSpy.and.returnValue(undefined);

        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                target: mockedNode,
                ctrlKey: true,
                button: 0,
                preventDefault: preventDefaultSpy,
            },
        } as any);

        expect(onLinkClickSpy).toHaveBeenCalledWith(mockedLink, {
            target: mockedNode,
            ctrlKey: true,
            button: 0,
            preventDefault: preventDefaultSpy,
        });
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(openSpy).toHaveBeenCalledWith(mockedUrl, '_blank');

        plugin.dispose();
    });

    it('keyDown and keyUp', () => {
        const plugin = new HyperlinkPlugin();
        const mockedUrl = 'Url';
        const mockedUrl2 = 'Url2';
        const mockedTextContent = 'textContent';
        const mockedTextContent2 = 'textContent2';
        const mockedNode = {
            textContent: mockedTextContent,
        } as any;
        const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedUrl);
        const setAttributeSpy = jasmine.createSpy('setAttribute');
        const containsSpy = jasmine.createSpy('contains').and.returnValue(true);
        const mockedLink = {
            getAttribute: getAttributeSpy,
            setAttribute: setAttributeSpy,
            contains: containsSpy,
        } as any;

        findClosestElementAncestorSpy.and.returnValue(mockedLink);

        plugin.initialize(editor);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                commonAncestorContainer: mockedNode,
            },
        });

        plugin.onPluginEvent({
            eventType: 'keyUp',
        } as any);

        expect(setAttributeSpy).not.toHaveBeenCalled();

        matchLinkSpy.and.returnValue({
            normalizedUrl: mockedUrl,
        });

        plugin.onPluginEvent({
            eventType: 'keyDown',
        } as any);

        expect(matchLinkSpy).toHaveBeenCalledWith(mockedTextContent);

        mockedNode.textContent = mockedTextContent2;
        matchLinkSpy.and.returnValue({
            normalizedUrl: mockedUrl2,
        });

        plugin.onPluginEvent({
            eventType: 'keyUp',
        } as any);

        expect(containsSpy).toHaveBeenCalledWith(mockedNode);
        expect(setAttributeSpy).toHaveBeenCalledWith('href', mockedUrl2);

        plugin.dispose();
    });

    it('keyDown and keyUp, not contain', () => {
        const plugin = new HyperlinkPlugin();
        const mockedUrl = 'Url';
        const mockedUrl2 = 'Url2';
        const mockedTextContent = 'textContent';
        const mockedTextContent2 = 'textContent2';
        const mockedNode = {
            textContent: mockedTextContent,
        } as any;
        const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedUrl);
        const setAttributeSpy = jasmine.createSpy('setAttribute');
        const containsSpy = jasmine.createSpy('contains').and.returnValue(false);
        const mockedLink = {
            getAttribute: getAttributeSpy,
            setAttribute: setAttributeSpy,
            contains: containsSpy,
        } as any;

        findClosestElementAncestorSpy.and.returnValue(mockedLink);

        plugin.initialize(editor);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                commonAncestorContainer: mockedNode,
            },
        });

        matchLinkSpy.and.returnValue({
            normalizedUrl: mockedUrl,
        });

        plugin.onPluginEvent({
            eventType: 'keyDown',
        } as any);

        expect(matchLinkSpy).toHaveBeenCalledWith(mockedTextContent);

        mockedNode.textContent = mockedTextContent2;
        matchLinkSpy.and.returnValue({
            normalizedUrl: mockedUrl2,
        });

        plugin.onPluginEvent({
            eventType: 'keyUp',
        } as any);

        expect(containsSpy).toHaveBeenCalledWith(mockedNode);
        expect(setAttributeSpy).not.toHaveBeenCalled();

        plugin.dispose();
    });

    it('keyDown and keyUp, url not match', () => {
        const plugin = new HyperlinkPlugin();
        const mockedUrl = 'Url';
        const mockedUrl2 = 'Url2';
        const mockedTextContent = 'textContent';
        const mockedTextContent2 = 'textContent2';
        const mockedNode = {
            textContent: mockedTextContent,
        } as any;
        const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedUrl);
        const setAttributeSpy = jasmine.createSpy('setAttribute');
        const containsSpy = jasmine.createSpy('contains').and.returnValue(true);
        const mockedLink = {
            getAttribute: getAttributeSpy,
            setAttribute: setAttributeSpy,
            contains: containsSpy,
        } as any;

        findClosestElementAncestorSpy.and.returnValue(mockedLink);

        plugin.initialize(editor);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                commonAncestorContainer: mockedNode,
            },
        });

        matchLinkSpy.and.returnValue({
            normalizedUrl: mockedUrl2,
        });

        plugin.onPluginEvent({
            eventType: 'keyDown',
        } as any);

        expect(matchLinkSpy).toHaveBeenCalledWith(mockedTextContent);

        mockedNode.textContent = mockedTextContent2;

        plugin.onPluginEvent({
            eventType: 'keyUp',
        } as any);

        expect(containsSpy).not.toHaveBeenCalled();
        expect(setAttributeSpy).not.toHaveBeenCalled();

        plugin.dispose();
    });

    it('ContentChanged', () => {
        const plugin = new HyperlinkPlugin();
        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'contentChanged',
        } as any);

        expect(setDomAttributeSpy).toHaveBeenCalledWith('title', null);
    });
});
