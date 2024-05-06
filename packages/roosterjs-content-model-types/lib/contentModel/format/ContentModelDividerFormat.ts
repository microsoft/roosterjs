import type { Mutable } from '../common/Mutable';
import type {
    ContentModelBlockFormat,
    ReadonlyContentModelBlockFormat,
} from './ContentModelBlockFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { SizeFormat } from './formatParts/SizeFormat';

/**
 * Common part of format object for a divider in Content Model
 */
export type ContentModelDividerFormatCommon = DisplayFormat & SizeFormat;

/**
 * The format object for a divider in Content Model
 */
export type ContentModelDividerFormat = Mutable &
    ContentModelBlockFormat &
    ContentModelDividerFormatCommon;

/**
 * The format object for a divider in Content Model (Readonly)
 */
export type ReadonlyContentModelDividerFormat = ReadonlyContentModelBlockFormat &
    Readonly<ContentModelDividerFormatCommon>;
