import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { ContentModelQuoteFormat } from '../../publicTypes/format/ContentModelQuoteFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createQuote(
    format?: ContentModelQuoteFormat,
    quoteSegmentFormat?: ContentModelSegmentFormat
): ContentModelQuote {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'Quote',
        blocks: [],
        format: { ...(format || {}) },
        quoteSegmentFormat: { ...(quoteSegmentFormat || {}) },
    };
}
