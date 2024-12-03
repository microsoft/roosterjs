import { domCreator, isDOMCreator } from '../../lib/utils/domCreator';

describe('domCreator', () => {
    it('isDOMCreator - True', () => {
        const trustedHTMLHandler = {
            htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
        };
        expect(isDOMCreator(trustedHTMLHandler)).toBe(true);
    });

    it('isDOMCreator - False', () => {
        const trustedHTMLHandler = (html: string) => html;
        expect(isDOMCreator(trustedHTMLHandler)).toBe(false);
    });

    it('domCreator - isDOMCreator', () => {
        const trustedHTMLHandler = {
            htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
        };
        const result = domCreator(trustedHTMLHandler);
        expect(result).toEqual(trustedHTMLHandler);
    });

    it('domCreator - undefined', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.appendChild(document.createTextNode('test'));
        doc.ownerDocument;
        const result = domCreator(undefined).htmlToDOM('test');
        expect(result.lastChild).toEqual(doc.lastChild);
    });

    it('domCreator - trustedHTML', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.appendChild(document.createTextNode('test trusted'));
        const trustedHTMLHandler = (html: string) => html + ' trusted';
        const result = domCreator(trustedHTMLHandler).htmlToDOM('test');
        expect(result.lastChild).toEqual(doc.lastChild);
    });
});
