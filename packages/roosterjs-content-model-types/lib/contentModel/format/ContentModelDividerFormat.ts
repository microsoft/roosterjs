import type { Mutable } from '../common/Mutable';
import type { ContentModelBlockFormatCommon } from './ContentModelBlockFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { SizeFormat } from './formatParts/SizeFormat';

/**
 * Common part of format object for a divider in Content Model
 */
export type ContentModelDividerFormatCommon = DisplayFormat &
    SizeFormat &
    ContentModelBlockFormatCommon;

/**
 * The format object for a divider in Content Model
 */
export type ContentModelDividerFormat = Mutable & ContentModelDividerFormatCommon;

/**
 * The format object for a divider in Content Model (Readonly)
 */
export type ReadonlyContentModelDividerFormat = Readonly<ContentModelDividerFormatCommon>;
