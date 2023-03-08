import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelBlockWithCache } from '../block/ContentModelBlockWithCache';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of Block Quote
 */
export interface ContentModelQuote
    extends ContentModelBlockGroupBase<'Quote'>,
        ContentModelBlockBase<'BlockGroup'>,
        ContentModelBlockWithCache {
    /**
     * Segment format that should be applied on this quote element
     */
    quoteSegmentFormat: ContentModelSegmentFormat;
}
