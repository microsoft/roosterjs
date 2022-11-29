import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';

/**
 * Content Model of Block Quote
 */
export interface ContentModelQuote
    extends ContentModelBlockGroupBase<'Quote'>,
        ContentModelBlockBase<'BlockGroup'> {}
