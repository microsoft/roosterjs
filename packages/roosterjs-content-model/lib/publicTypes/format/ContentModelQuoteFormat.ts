import { BorderFormat } from './formatParts/BorderFormat';
import { ContentModelBlockFormat } from './ContentModelBlockFormat';

/**
 * The format object for a quote in Content Model
 */
export type ContentModelQuoteFormat = ContentModelBlockFormat & BorderFormat;
