import type { ContentModelBlockFormat } from './ContentModelBlockFormat';
import type { ContentModelSegmentFormat } from './ContentModelSegmentFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { ColumnFormat } from './formatParts/ColumnFormat';
import type { SizeFormat } from './formatParts/SizeFormat';

/**
 * Type for FormatContainer
 */
export type ContentModelFormatContainerFormat = ContentModelBlockFormat &
    ContentModelSegmentFormat &
    SizeFormat &
    ColumnFormat &
    DisplayFormat;
