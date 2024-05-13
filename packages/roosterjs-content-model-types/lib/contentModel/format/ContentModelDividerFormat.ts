import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
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
export type ContentModelDividerFormat = MutableMark & ContentModelDividerFormatCommon;

/**
 * The format object for a divider in Content Model (Readonly)
 */
export type ReadonlyContentModelDividerFormat = ReadonlyMark &
    Readonly<ContentModelDividerFormatCommon>;
