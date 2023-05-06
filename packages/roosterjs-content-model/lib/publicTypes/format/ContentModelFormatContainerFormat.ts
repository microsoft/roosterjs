import { ContentModelBlockFormat } from './ContentModelBlockFormat';
import { ContentModelSegmentFormat } from './ContentModelSegmentFormat';
import { SizeFormat } from './formatParts/SizeFormat';

/**
 * Type for FormatContainer
 */
export type ContentModelFormatContainerFormat = ContentModelBlockFormat &
    ContentModelSegmentFormat &
    SizeFormat;
