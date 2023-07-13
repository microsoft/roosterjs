import { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { ContentModelBlockFormat } from './ContentModelBlockFormat';
import { DisplayFormat } from './formatParts/DisplayFormat';
import { IdFormat } from './formatParts/IdFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { SpacingFormat } from './formatParts/SpacingFormat';
import { TableLayoutFormat } from './formatParts/TableLayoutFormat';

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
