import type { MutableMark } from '../common/MutableMark';
import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import type { DirectionFormat } from './formatParts/DirectionFormat';
import type { LineHeightFormat } from './formatParts/LineHeightFormat';
import type { ListStyleFormat } from './formatParts/ListStyleFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { TextAlignFormat } from './formatParts/TextAlignFormat';
import type { TextIndentFormat } from './formatParts/TextIndentFormat';

/**
 * Common part of format object for a list item in Content Model
 */
export type ContentModelListItemFormatCommon = DirectionFormat &
    LineHeightFormat &
    MarginFormat &
    PaddingFormat &
    TextAlignFormat &
    ListStyleFormat &
    TextIndentFormat &
    BackgroundColorFormat;

/**
 * The format object for a list item in Content Model
 */
export type ContentModelListItemFormat = MutableMark & ContentModelListItemFormatCommon;

/**
 * The format object for a list item in Content Model (Readonly)
 */
export type ReadonlyContentModelListItemFormat = ReadonlyMark &
    Readonly<ContentModelListItemFormatCommon>;
