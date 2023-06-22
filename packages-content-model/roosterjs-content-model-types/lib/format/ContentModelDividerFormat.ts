import { ContentModelBlockFormat } from './ContentModelBlockFormat';
import { DisplayFormat } from './formatParts/DisplayFormat';
import { SizeFormat } from './formatParts/SizeFormat';

/**
 * The format object for a divider in Content Model
 */
export type ContentModelDividerFormat = ContentModelBlockFormat & DisplayFormat & SizeFormat;
