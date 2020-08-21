import * as dom from 'roosterjs-editor-dom';
import createEditorCore from './createMockEditorCore';
import { ClipboardData, PluginEventType } from 'roosterjs-editor-types';
import { createPasteFragment } from '../../lib/coreApi/createPasteFragment';

describe('createPasteFragment', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null input', () => {
        const core = createEditorCore(div, {});
        const fragment = createPasteFragment(core, null, null, false, false);
        expect(fragment).toBeNull();
    });

    it('plain text input, html output', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'This is a test',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('This is a test');
    });

    it('multi-line plain text input, html output', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'This is a test\nthis is line 2\nthis is line 3',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('This is a test<div>this is line 2</div>this is line 3');
    });

    it('multi-line plain text input, text output', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'This is a test\nthis is line 2\nthis is line 3',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
        };
        const fragment = createPasteFragment(core, clipboardData, null, true, false);
        const html = getHTML(fragment);
        expect(html).toBe('This is a test<div>this is line 2</div>this is line 3');
    });

    it('image input, html output', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: '',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: 'test',
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('<img style="max-width: 100%" src="test">');
    });

    it('image input, text output', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'test',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: 'test',
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('test');
    });

    it('image input, force text output', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: '',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: 'test',
        };
        const fragment = createPasteFragment(core, clipboardData, null, true, false);
        const html = getHTML(fragment);
        expect(html).toBe('');
    });

    it('html input, html output', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'test text',
            rawHtml: '<div>test html</div>',
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: 'test',
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('<div>test html</div>');
    });

    it('html input, force text output', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'test text',
            rawHtml: '<div>test html</div>',
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: 'test',
        };
        const fragment = createPasteFragment(core, clipboardData, null, true, false);
        const html = getHTML(fragment);
        expect(html).toBe('test text');
    });

    it('html input with html attributes and meta', () => {
        const sanitizingOption: any = {};
        spyOn(dom, 'createDefaultHtmlSanitizerOptions').and.returnValue(sanitizingOption);

        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: '',
            rawHtml:
                '<html attrname1="attrValue1" attrname2="attrValue2"><body><meta name="metaName1" content="metaContent1"><div>test<meta name="metaName2" content="metaContent2"></div></body></html>',
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false);

        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData,
                fragment,
                sanitizingOption,
                htmlBefore: '',
                htmlAfter: '',
                htmlAttributes: {
                    attrname1: 'attrValue1',
                    attrname2: 'attrValue2',
                    metaName1: 'metaContent1',
                    metaName2: 'metaContent2',
                },
            },
            true
        );
        const html = getHTML(fragment);
        expect(html).toBe('<div>test</div>');
    });

    it('html input, make sure STYLE tags are properly handled', () => {
        const sanitizingOption: any = { additionalGlobalStyleNodes: [] };
        spyOn(dom, 'createDefaultHtmlSanitizerOptions').and.returnValue(sanitizingOption);

        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: '',
            rawHtml:
                '<html><head><style>.class1{}</style></head><body><style>.class2{}</style><div>test</div></body></html>',
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false);

        expect(getHTML(fragment)).toBe('<div>test</div>');
        expect(sanitizingOption.additionalGlobalStyleNodes.length).toBe(2);
        expect(sanitizingOption.additionalGlobalStyleNodes[0].outerHTML).toBe(
            '<style>.class2{}</style>'
        );
        expect(sanitizingOption.additionalGlobalStyleNodes[1].outerHTML).toBe(
            '<style>.class1{}</style>'
        );
    });
});

function getHTML(fragment: DocumentFragment) {
    let result = '';
    for (let node = fragment.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == Node.TEXT_NODE) {
            result += node.nodeValue;
        } else if (node.nodeType == Node.ELEMENT_NODE) {
            result += (<HTMLElement>node).outerHTML;
        }
    }
    return result;
}
