import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
import type { DirectionFormat } from './formatParts/DirectionFormat';
import type { ListStyleFormat } from './formatParts/ListStyleFormat';
import type { ListThreadFormat } from './formatParts/ListThreadFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { TextAlignFormat } from './formatParts/TextAlignFormat';

/**
 * Common part of format object for a list level in Content Model
 */
export type ContentModelListItemLevelFormatCommon = ListThreadFormat &
    DirectionFormat &
    TextAlignFormat &
    MarginFormat &
    PaddingFormat &
    ListStyleFormat;

/**
 * The format object for a list level in Content Model
 */
export type ContentModelListItemLevelFormat = MutableMark & ContentModelListItemLevelFormatCommon;

/**
 * The format object for a list level in Content Model (Readonly)
 */
export type ReadonlyContentModelListItemLevelFormat = ReadonlyMark &
    Readonly<ContentModelListItemLevelFormatCommon>;
