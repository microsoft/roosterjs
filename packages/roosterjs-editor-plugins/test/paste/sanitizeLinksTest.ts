import sanitizeLinks from '../../lib/plugins/Paste/sanitizeLinks/sanitizeLinks';
import { HtmlSanitizer } from 'roosterjs-editor-dom';
import {
    BeforePasteEvent,
    SanitizeHtmlOptions,
    PluginEventType,
    ClipboardData,
} from 'roosterjs-editor-types';

describe('sanitizeLinks', () => {
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
        sanitizeLinks(event.sanitizingOption);
        callSanitizer(fragment, event.sanitizingOption);

        while (fragment.firstChild) {
            doc.body.appendChild(fragment.firstChild);
        }

        expect(doc.body.innerHTML).toBe(expected);
    }

    it('sanitize anchor', () => {
        runTest('<a href="/text.txt"></a>', '<a></a>');
    });

    it('not sanitize anchor', () => {
        runTest(
            '<a href="https://microsoft.github.io/"></a>',
            '<a href="https://microsoft.github.io/"></a>'
        );
    });

    it('sanitize div', () => {
        runTest('<div><a href="/text.txt"></a></div>', '<div><a></a></div>');
    });

    it('not sanitize div', () => {
        runTest(
            '<div><a href="https://microsoft.github.io/"></a></div>',
            '<div><a href="https://microsoft.github.io/"></a></div>'
        );
    });

    it('not sanitize onenote link', () => {
        runTest(
            '<div><a href="onenote:https://microsoft.github.io/"></a></div>',
            '<div><a href="onenote:https://microsoft.github.io/"></a></div>'
        );
    });

    it('not sanitize mailto link', () => {
        runTest(
            '<div><a href="mailto:email@outlook.com"></a></div>',
            '<div><a href="mailto:email@outlook.com"></a></div>'
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
