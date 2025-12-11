import type { LegacyTableBorderFormat } from './formatParts/LegacyTableBorderFormat';
import type { AriaFormat } from './formatParts/AriaFormat';
import type { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import type { BorderFormat } from './formatParts/BorderFormat';
import type { ContentModelBlockFormat } from './ContentModelBlockFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { IdFormat } from './formatParts/IdFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { SpacingFormat } from './formatParts/SpacingFormat';
import type { TableLayoutFormat } from './formatParts/TableLayoutFormat';
import type { SizeFormat } from './formatParts/SizeFormat';
import type { DirectionFormat } from './formatParts/DirectionFormat';
import type { RoleFormat } from './formatParts/RoleFormat';

/**
 * Format of Table
 */
export type ContentModelTableFormat = ContentModelBlockFormat &
    IdFormat &
    AriaFormat &
    BorderFormat &
    BorderBoxFormat &
    DirectionFormat &
    SpacingFormat &
    MarginFormat &
    DisplayFormat &
    TableLayoutFormat &
    SizeFormat &
    RoleFormat &
    LegacyTableBorderFormat;
