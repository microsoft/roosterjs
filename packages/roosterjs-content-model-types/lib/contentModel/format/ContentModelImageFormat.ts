import type { BorderFormat } from './formatParts/BorderFormat';
import type { BoxShadowFormat } from './formatParts/BoxShadowFormat';
import type { ContentModelSegmentFormat } from './ContentModelSegmentFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { FloatFormat } from './formatParts/FloatFormat';
import type { IdFormat } from './formatParts/IdFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { SizeFormat } from './formatParts/SizeFormat';
import type { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';

/**
 * The format object for an image in Content Model
 */
export type ContentModelImageFormat = ContentModelSegmentFormat &
    IdFormat &
    SizeFormat &
    MarginFormat &
    PaddingFormat &
    BorderFormat &
    BoxShadowFormat &
    DisplayFormat &
    FloatFormat &
    VerticalAlignFormat;
