import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of Block Quote
 */
export interface ContentModelQuote
    extends ContentModelBlockGroupBase<'Quote'>,
        ContentModelBlockBase<'BlockGroup'> {
    quoteSegmentFormat: ContentModelSegmentFormat;
}
