import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { quoteProcessor } from '../../../lib/domToModel/processors/quoteProcessor';

describe('quoteProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty BLOCKQUOTE tag', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quoteProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'General',
                    blocks: [],
                    element: quote,
                    format: {},
                },
            ],
        });
    });

    it('BLOCKQUOTE with non-zero value style', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '1px';
        quote.style.marginBottom = '0';

        quoteProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'General',
                    blocks: [],
                    element: quote,
                    format: {},
                },
            ],
        });
    });

    it('BLOCKQUOTE with other style', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '0';
        quote.style.marginBottom = '0';
        quote.style.color = 'red';

        quoteProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'General',
                    blocks: [],
                    element: quote,
                    format: {},
                },
            ],
        });
    });

    it('BLOCKQUOTE with margin', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '0';
        quote.style.marginBottom = '0';

        quoteProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [],
                    format: {},
                },
            ],
        });
    });
});
