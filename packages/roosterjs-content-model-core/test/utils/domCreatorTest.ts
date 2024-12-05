import { createDOMCreator, isDOMCreator } from '../../lib/utils/domCreator';

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

    it('createDOMCreator - isDOMCreator', () => {
        const trustedHTMLHandler = {
            htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
        };
        const result = createDOMCreator(trustedHTMLHandler);
        expect(result).toEqual(trustedHTMLHandler);
    });

    it('createDOMCreator - undefined', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.appendChild(document.createTextNode('test'));
        const result = createDOMCreator(undefined).htmlToDOM('test');
        expect(result.lastChild).toEqual(doc.lastChild);
    });

    it('createDOMCreator - trustedHTML', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.appendChild(document.createTextNode('test trusted'));
        const trustedHTMLHandler = (html: string) => html + ' trusted';
        const result = createDOMCreator(trustedHTMLHandler).htmlToDOM('test');
        expect(result.lastChild).toEqual(doc.lastChild);
    });
});
