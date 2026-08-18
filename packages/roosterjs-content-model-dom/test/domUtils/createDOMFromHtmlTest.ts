import { createDOMFromHtml } from '../../lib/domUtils/createDOMFromHtml';
import type { DOMCreator } from 'roosterjs-content-model-types';

describe('createDOMFromHtml', () => {
    let htmlToDOMSpy: jasmine.Spy;
    let domCreator: DOMCreator;

    beforeEach(() => {
        htmlToDOMSpy = jasmine.createSpy('htmlToDOM');
        domCreator = ({
            htmlToDOM: htmlToDOMSpy,
        } as any) as DOMCreator;
    });

    it('returns null for empty input', () => {
        expect(createDOMFromHtml('', domCreator)).toBeNull();
        expect(createDOMFromHtml(null, domCreator)).toBeNull();
        expect(createDOMFromHtml(undefined, domCreator)).toBeNull();
        expect(htmlToDOMSpy).not.toHaveBeenCalled();
    });

    it('creates a document from HTML', () => {
        const html = '<div>test</div>';
        const doc = document.implementation.createHTMLDocument();

        htmlToDOMSpy.and.returnValue(doc);

        expect(createDOMFromHtml(html, domCreator)).toBe(doc);
        expect(htmlToDOMSpy).toHaveBeenCalledWith(html);
    });
});
