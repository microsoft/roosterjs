import { ClipboardData, DOMCreator } from 'roosterjs-content-model-types';
import { isPastedContentMarkdown } from '../../lib/publicApi/isPastedContentMarkdown';

describe('isPastedContentMarkdown', () => {
    let doc: Document;
    let trustedHTMLHandler: DOMCreator;

    beforeEach(() => {
        doc = document.implementation.createHTMLDocument('test');
        trustedHTMLHandler = {
            htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
        };
    });

    function runTest(clipboardData: Partial<ClipboardData>, expected: boolean) {
        const result = isPastedContentMarkdown(
            doc,
            clipboardData as ClipboardData,
            trustedHTMLHandler
        );
        expect(result).toBe(expected);
    }

    it('should return false when text is undefined', () => {
        runTest({ text: undefined as any, rawHtml: '<p># Hello</p>' }, false);
    });

    it('should return false when text is empty string', () => {
        runTest({ text: '', rawHtml: '<p># Hello</p>' }, false);
    });

    it('should return false when text contains only whitespace', () => {
        runTest({ text: '   \n\t  ', rawHtml: '<p>foo</p>' }, false);
    });

    it('should return true when text exists and rawHtml is undefined', () => {
        runTest({ text: '# Hello', rawHtml: undefined }, true);
    });

    it('should return true when text exists and rawHtml is empty string', () => {
        runTest({ text: '# Hello', rawHtml: '' }, true);
    });

    it('should return true when rawHtml is a thin <p> wrapper of the same plain text', () => {
        runTest({ text: '# Hello world', rawHtml: '<p># Hello world</p>' }, true);
    });

    it('should return true when rawHtml is a thin <div> wrapper of the same plain text', () => {
        runTest({ text: '- item 1', rawHtml: '<div>- item 1</div>' }, true);
    });

    it('should return true when rawHtml is a <span> wrapper of the same plain text', () => {
        runTest({ text: '**bold**', rawHtml: '<span>**bold**</span>' }, true);
    });

    it('should return true when rawHtml uses nested allowed wrapper tags', () => {
        runTest(
            {
                text: 'line1 line2',
                rawHtml: '<div><p>line1<br/>line2</p></div>',
            },
            true
        );
    });

    it('should ignore whitespace differences when comparing text content', () => {
        runTest(
            {
                text: '# Hello   world',
                rawHtml: '<p># Hello world</p>',
            },
            true
        );
    });

    it('should return true when wrapper element has only a style attribute', () => {
        runTest(
            {
                text: '# Hello',
                rawHtml: '<p style="color:red"># Hello</p>',
            },
            true
        );
    });

    it('should return false when wrapper element has a class attribute', () => {
        runTest(
            {
                text: '# Hello',
                rawHtml: '<p class="md"># Hello</p>',
            },
            false
        );
    });

    it('should return false when wrapper element has a non-style/non-class attribute', () => {
        runTest(
            {
                text: '# Hello',
                rawHtml: '<p id="x"># Hello</p>',
            },
            false
        );
    });

    it('should return false when rawHtml contains a non-thin-wrapper tag (e.g. <strong>)', () => {
        runTest(
            {
                text: 'bold text',
                rawHtml: '<p><strong>bold text</strong></p>',
            },
            false
        );
    });

    it('should return false when rawHtml contains a heading tag', () => {
        runTest(
            {
                text: 'Hello',
                rawHtml: '<h1>Hello</h1>',
            },
            false
        );
    });

    it('should return false when rawHtml contains a list element', () => {
        runTest(
            {
                text: 'item',
                rawHtml: '<ul><li>item</li></ul>',
            },
            false
        );
    });

    it('should return false when rawHtml contains an anchor tag', () => {
        runTest(
            {
                text: 'link',
                rawHtml: '<p><a href="x">link</a></p>',
            },
            false
        );
    });

    it('should return false when html text content does not match plain text', () => {
        runTest(
            {
                text: '# Hello',
                rawHtml: '<p>Goodbye</p>',
            },
            false
        );
    });

    it('should return false when html text content has extra characters not in plain text', () => {
        runTest(
            {
                text: 'Hello',
                rawHtml: '<p>Hello world</p>',
            },
            false
        );
    });

    it('should return true when rawHtml has multiple thin wrappers matching the text', () => {
        runTest(
            {
                text: 'foo bar',
                rawHtml: '<div><p>foo</p><p>bar</p></div>',
            },
            true
        );
    });

    it('should return true when <br> is used inside thin wrappers', () => {
        runTest(
            {
                text: 'foo bar',
                rawHtml: '<p>foo<br/>bar</p>',
            },
            true
        );
    });

    it('should use the provided trustedHTMLHandler to parse rawHtml', () => {
        const spyDom = new DOMParser().parseFromString('<p># Hello</p>', 'text/html');
        const handler: DOMCreator = {
            htmlToDOM: jasmine.createSpy('htmlToDOM').and.returnValue(spyDom),
        };

        const result = isPastedContentMarkdown(
            doc,
            { text: '# Hello', rawHtml: '<p># Hello</p>' } as ClipboardData,
            handler
        );

        expect(handler.htmlToDOM).toHaveBeenCalledWith('<p># Hello</p>');
        expect(result).toBe(true);
    });

    it('should return false when trustedHTMLHandler returns a document with no body', () => {
        const handler: DOMCreator = {
            htmlToDOM: () => ({} as Document),
        };

        // Empty fragment textContent ('') will not match the non-empty plain text
        const result = isPastedContentMarkdown(
            doc,
            { text: '# Hello', rawHtml: '<p># Hello</p>' } as ClipboardData,
            handler
        );

        expect(result).toBe(false);
    });
});
