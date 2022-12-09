import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelQuoteFormat } from '../format/ContentModelQuoteFormat';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of Block Quote
 */
export interface ContentModelQuote
    extends ContentModelBlockGroupBase<'Quote'>,
        ContentModelBlockBase<'BlockGroup', ContentModelQuoteFormat> {
    quoteSegmentFormat: ContentModelSegmentFormat;
}
