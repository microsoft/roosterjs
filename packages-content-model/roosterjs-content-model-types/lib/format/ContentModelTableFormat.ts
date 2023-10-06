import type { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import type { BorderFormat } from './formatParts/BorderFormat';
import type { ContentModelBlockFormat } from './ContentModelBlockFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { IdFormat } from './formatParts/IdFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { SpacingFormat } from './formatParts/SpacingFormat';
import type { TableLayoutFormat } from './formatParts/TableLayoutFormat';

/**
 * Format of Table
 */
export type ContentModelTableFormat = ContentModelBlockFormat &
    IdFormat &
    BorderFormat &
    BorderBoxFormat &
    SpacingFormat &
    MarginFormat &
    DisplayFormat &
    TableLayoutFormat;
