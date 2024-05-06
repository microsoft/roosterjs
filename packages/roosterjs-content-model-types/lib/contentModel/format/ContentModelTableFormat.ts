import type { Mutable } from '../common/Mutable';
import type { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import type { BorderFormat } from './formatParts/BorderFormat';
import type { ContentModelBlockFormat } from './ContentModelBlockFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { IdFormat } from './formatParts/IdFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { SpacingFormat } from './formatParts/SpacingFormat';
import type { TableLayoutFormat } from './formatParts/TableLayoutFormat';
import type { SizeFormat } from './formatParts/SizeFormat';

/**
 * Common part of format of Table
 */
export type ContentModelTableFormatCommon = ContentModelBlockFormat &
    IdFormat &
    BorderFormat &
    BorderBoxFormat &
    SpacingFormat &
    MarginFormat &
    DisplayFormat &
    TableLayoutFormat &
    SizeFormat;

/**
 * Format of Table
 */
export type ContentModelTableFormat = Mutable & ContentModelTableFormatCommon;

/**
 * Format of Table (Readonly)
 */
export type ReadonlyContentModelTableFormat = Readonly<ContentModelTableFormatCommon>;
