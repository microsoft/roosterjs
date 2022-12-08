import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelQuote } from '../../../lib/publicTypes/group/ContentModelQuote';
import { findParentGroup } from '../../../lib/modelApi/selection/findParentGroup';

describe('findParentGroup', () => {
    it('empty selection', () => {
        const result = findParentGroup(
            {
                blockType: 'Paragraph',
                segments: [],
                format: {},
            },
            []
        );

        expect(result).toBeNull();
    });

    it('Has valid selection', () => {
        const quote: ContentModelQuote = {
            blockGroupType: 'Quote',
            blockType: 'BlockGroup',
            blocks: [],
            format: {},
            quoteSegmentFormat: {},
        };
        const doc: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
        };
        const result = findParentGroup(quote, [
            {
                paragraph: null,
                segments: [],
                path: [quote, doc],
            },
        ]);

        expect(result).toBe(doc);
    });

    it('Cannot find', () => {
        const quote: ContentModelQuote = {
            blockGroupType: 'Quote',
            blockType: 'BlockGroup',
            blocks: [],
            format: {},
            quoteSegmentFormat: {},
        };
        const doc: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
        };
        const result = findParentGroup(quote, [
            {
                paragraph: null,
                segments: [],
                path: [doc],
            },
        ]);

        expect(result).toBeNull();
    });

    it('Found from paragraph', () => {
        const quote: ContentModelQuote = {
            blockGroupType: 'Quote',
            blockType: 'BlockGroup',
            blocks: [],
            format: {},
            quoteSegmentFormat: {},
        };
        const para: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [],
            format: {},
        };
        const doc: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
        };
        const result = findParentGroup(para, [
            {
                paragraph: null,
                segments: [],
                path: [doc],
            },
            {
                paragraph: para,
                segments: [],
                path: [quote, doc],
            },
        ]);

        expect(result).toBe(quote);
    });
});
