import * as createDefaultHtmlSanitizerOptions from 'roosterjs-editor-dom/lib/htmlSanitizer/createDefaultHtmlSanitizerOptions';
import createEditorCore from './createMockEditorCore';
import { ClipboardData, PasteType, PluginEventType } from 'roosterjs-editor-types';
import { createPasteFragment } from '../../lib/coreApi/createPasteFragment';
import { itChromeOnly, itFirefoxOnly } from '../TestHelper';

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
        const fragment = createPasteFragment(core, null, null, false, false, false);
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('This is a test');
    });

    it('two lines plain text input, html output', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'This is a test\nthis is line 2',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('This is a test<br>this is line 2');
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('This is a test<div>this is line 2</div>this is line 3');
    });

    it('two lines plain text input with empty lines, html output, 1', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: '\nthis is line 2',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('<br>this is line 2');
    });

    it('two lines plain text input with empty lines, html output, 2', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'this is line 1\n',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('this is line 1<br>');
    });

    it('multi-line plain text input with empty lines, html output, 1', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: '\nthis is line 2\nthis is line 3',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('<div>this is line 2</div>this is line 3');
    });

    it('multi-line plain text input with empty lines, html output, 2', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'this is line 1\n\nthis is line 3',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('this is line 1<div><br></div>this is line 3');
    });

    it('multi-line plain text input with empty lines, html output, 3', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        const clipboardData: ClipboardData = {
            types: [],
            text: 'this is line 1\nthis is line 2\n',
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('this is line 1<div>this is line 2</div>');
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, true, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('This is a test<div>this is line 2</div>this is line 3');
    });

    itFirefoxOnly('image input, html output', () => {
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('<img style="max-width:100%" src="test">');
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, true, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('');
    });

    itChromeOnly('create image fragment', () => {
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, true, false, true);
        const html = getHTML(fragment);
        expect(html).toBe('<img src="test" style="max-width:100%">');
    });

    itFirefoxOnly('create image fragment', () => {
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, true, false, true);
        const html = getHTML(fragment);
        expect(html).toBe('<img style="max-width:100%" src="test">');
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, true, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('test text');
    });

    it('html input with html attributes and meta', () => {
        const sanitizingOption: any = {
            cssStyleCallbacks: {},
        };
        spyOn(createDefaultHtmlSanitizerOptions, 'default').and.returnValue(sanitizingOption);

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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);

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
                pasteType: PasteType.Normal,
            },
            true
        );
        const html = getHTML(fragment);
        expect(html).toBe('<div>test</div>');
    });

    it('html input, make sure STYLE tags are properly handled', () => {
        const sanitizingOption: any = { additionalGlobalStyleNodes: [], cssStyleCallbacks: {} };
        spyOn(createDefaultHtmlSanitizerOptions, 'default').and.returnValue(sanitizingOption);

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
            customValues: {},
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);

        expect(getHTML(fragment)).toBe('<div>test</div>');
        expect(sanitizingOption.additionalGlobalStyleNodes.length).toBe(2);
        expect(sanitizingOption.additionalGlobalStyleNodes[0].outerHTML).toBe(
            '<style>.class2{}</style>'
        );
        expect(sanitizingOption.additionalGlobalStyleNodes[1].outerHTML).toBe(
            '<style>.class1{}</style>'
        );
    });

    it('html input, with one img tag', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });

        const clipboardData: ClipboardData = {
            types: ['image/png', 'text/html'],
            text: '',
            image: null,
            rawHtml: '<html>\r\n<body>\r\n<img src="" />\r\n</body>\r\n</html>',
            customValues: {},
            imageDataUri: null,
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html).toBe('<img src="">');
        expect(clipboardData.htmlFirstLevelChildTags).toEqual(['IMG']);
    });

    it('html input, with one img tag and text nodes with value', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });

        const clipboardData: ClipboardData = {
            types: ['image/png', 'text/html'],
            text: '',
            image: null,
            rawHtml: '<html>\r\n<body>teststring<img src="" />teststring</body>\r\n</html>',
            customValues: {},
            imageDataUri: null,
        };
        const fragment = createPasteFragment(core, clipboardData, null, false, false, false);
        const html = getHTML(fragment);
        expect(html.trim()).toBe('teststring<img src="">teststring');
        expect(clipboardData.htmlFirstLevelChildTags).toEqual(['', 'IMG', '']);
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
