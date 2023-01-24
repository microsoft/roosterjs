import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createQuote(
    format?: ContentModelBlockFormat,
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
