import { ContentModelFormatContainerBase } from './ContentModelFormatContainerBase';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of Block Quote
 */
export interface ContentModelQuote extends ContentModelFormatContainerBase<'blockquote'> {
    /**
     * Segment format that should be applied on this quote element
     */
    quoteSegmentFormat: ContentModelSegmentFormat;
}
