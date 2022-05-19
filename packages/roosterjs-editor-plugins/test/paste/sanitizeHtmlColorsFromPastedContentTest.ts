import sanitizeHtmlColorsFromPastedContent from '../../lib/plugins/Paste/sanitizeHtmlColorsFromPastedContent/sanitizeHtmlColorsFromPastedContent';
import { HtmlSanitizer } from 'roosterjs-editor-dom';
import {
    BeforePasteEvent,
    SanitizeHtmlOptions,
    PluginEventType,
    ClipboardData,
} from 'roosterjs-editor-types';

describe('sanitizeHtmlColorsFromPastedContent', () => {
    function callSanitizer(fragment: DocumentFragment, sanitizingOption: SanitizeHtmlOptions) {
        const sanitizer = new HtmlSanitizer(sanitizingOption);
        sanitizer.convertGlobalCssToInlineCss(fragment);
        sanitizer.sanitize(fragment);
    }

    function runTest(source: string, expected: string) {
        const doc = new DOMParser().parseFromString(source, 'text/html');
        const fragment = doc.createDocumentFragment();
        while (doc.body.firstChild) {
            fragment.appendChild(doc.body.firstChild);
        }

        const event = createBeforePasteEventMock(fragment);
        sanitizeHtmlColorsFromPastedContent(event.sanitizingOption);
        callSanitizer(fragment, event.sanitizingOption);

        while (fragment.firstChild) {
            doc.body.appendChild(fragment.firstChild);
        }

        expect(doc.body.innerHTML).toBe(expected);
    }

    it('sanitize on a div', () => {
        runTest('<div style="color: windowtext;"></div>', '<div></div>');
    });

    it('sanitize on a div', () => {
        runTest(
            '<div style="color:windowtext;text-align:left"></div>',
            '<div style="text-align:left"></div>'
        );
    });

    it('sanitize on a p', () => {
        runTest(
            '<p style="color:windowtext;text-align:left"></p>',
            '<p style="text-align:left"></p>'
        );
    });

    it('sanitize on nested elements', () => {
        runTest(
            '<div style="color:windowtext;text-align:left"><p style="color:windowtext;text-align:left"></p></div>',
            '<div style="text-align:left"><p></p></div>'
        );
    });

    it('sanitize on nested elements with background color', () => {
        runTest(
            '<div style="background-color:windowtext;"><p style="color:windowtext;text-align:left"></p></div>',
            '<div><p style="text-align:left"></p></div>'
        );
    });
});

function createBeforePasteEventMock(fragment: DocumentFragment) {
    return ({
        eventType: PluginEventType.BeforePaste,
        clipboardData: <ClipboardData>{},
        fragment: fragment,
        sanitizingOption: {
            elementCallbacks: {},
            attributeCallbacks: {},
            cssStyleCallbacks: {},
            additionalTagReplacements: {},
            additionalAllowedAttributes: [],
            additionalAllowedCssClasses: [],
            additionalDefaultStyleValues: {},
            additionalGlobalStyleNodes: [],
            additionalPredefinedCssForElement: {},
            preserveHtmlComments: false,
            unknownTagReplacement: null,
        },
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
    } as unknown) as BeforePasteEvent;
}
