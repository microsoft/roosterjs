import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
import type { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import type { BorderFormat } from './formatParts/BorderFormat';
import type { ContentModelBlockFormatCommon } from './ContentModelBlockFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { IdFormat } from './formatParts/IdFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { SpacingFormat } from './formatParts/SpacingFormat';
import type { TableLayoutFormat } from './formatParts/TableLayoutFormat';
import type { SizeFormat } from './formatParts/SizeFormat';

/**
 * Common part of format of Table
 */
export type ContentModelTableFormatCommon = IdFormat &
    BorderFormat &
    BorderBoxFormat &
    SpacingFormat &
    MarginFormat &
    DisplayFormat &
    TableLayoutFormat &
    SizeFormat &
    ContentModelBlockFormatCommon;

/**
 * Format of Table
 */
export type ContentModelTableFormat = MutableMark & ContentModelTableFormatCommon;

/**
 * Format of Table (Readonly)
 */
export type ReadonlyContentModelTableFormat = ReadonlyMark &
    Readonly<ContentModelTableFormatCommon>;
