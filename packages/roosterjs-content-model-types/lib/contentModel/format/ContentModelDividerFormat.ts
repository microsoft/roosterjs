import type { ContentModelBlockFormat } from './ContentModelBlockFormat';
import type { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { SizeFormat } from './formatParts/SizeFormat';

/**
 * The format object for a divider in Content Model
 */
export type ContentModelDividerFormat = ContentModelBlockFormat &
    BorderBoxFormat &
    DisplayFormat &
    SizeFormat;
