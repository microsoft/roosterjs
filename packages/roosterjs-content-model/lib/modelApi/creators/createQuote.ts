import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';

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
        format: {},
    };
}
