import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
import type { BorderFormat } from './formatParts/BorderFormat';
import type { BoxShadowFormat } from './formatParts/BoxShadowFormat';
import type { ContentModelSegmentFormatCommon } from './ContentModelSegmentFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { FloatFormat } from './formatParts/FloatFormat';
import type { IdFormat } from './formatParts/IdFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { SizeFormat } from './formatParts/SizeFormat';
import type { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';

/**
 * Common part of format object for an image in Content Model
 */
export type ContentModelImageFormatCommon = IdFormat &
    SizeFormat &
    MarginFormat &
    PaddingFormat &
    BorderFormat &
    BoxShadowFormat &
    DisplayFormat &
    FloatFormat &
    VerticalAlignFormat &
    ContentModelSegmentFormatCommon;

/**
 * The format object for an image in Content Model
 */
export type ContentModelImageFormat = MutableMark & ContentModelImageFormatCommon;

/**
 * The format object for an image in Content Model (Readonly)
 */
export type ReadonlyContentModelImageFormat = ReadonlyMark &
    Readonly<ContentModelImageFormatCommon>;
