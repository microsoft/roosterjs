import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { unwrapBlock } from '../../../lib/modelApi/common/unwrapBlock';

describe('unwrapBlock', () => {
    it('no parent', () => {
        const quote = createQuote();
        const para = createParagraph();

        para.isImplicit = true;
        quote.blocks.push(para);

        unwrapBlock(null, quote);

        expect(quote).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'blockquote',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
            format: {},
        });
    });

    it('has invalid parent', () => {
        const quote = createQuote();
        const para = createParagraph();
        const doc: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
        };

        para.isImplicit = true;
        quote.blocks.push(para);

        unwrapBlock(doc, quote);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });

        expect(quote).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'blockquote',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
            format: {},
        });
    });

    it('has valid parent', () => {
        const quote = createQuote();
        const paraBefore = createParagraph(false, { backgroundColor: 'red' });
        const para = createParagraph();
        const paraAfter = createParagraph(false, { backgroundColor: 'green' });
        const doc: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paraBefore, quote, paraAfter],
        };

        para.isImplicit = true;
        quote.blocks.push(para);

        unwrapBlock(doc, quote);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: { backgroundColor: 'red' },
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: false,
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: { backgroundColor: 'green' },
                },
            ],
        });
    });
});
