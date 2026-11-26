import type { ContentModelBlockFormat } from './ContentModelBlockFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { SizeFormat } from './formatParts/SizeFormat';
import type { TextColorFormat } from './formatParts/TextColorFormat';

/**
 * The format object for a divider in Content Model
 */
export type ContentModelDividerFormat = ContentModelBlockFormat &
    DisplayFormat &
    SizeFormat &
    TextColorFormat;
