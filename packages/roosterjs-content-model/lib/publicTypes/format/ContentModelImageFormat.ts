import { BorderFormat } from './formatParts/BorderFormat';
import { BoxShadowFormat } from './formatParts/BoxShadowFormat';
import { ContentModelSegmentFormat } from './ContentModelSegmentFormat';
import { DisplayFormat } from './formatParts/DisplayFormat';
import { IdFormat } from './formatParts/IdFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { SizeFormat } from './formatParts/SizeFormat';

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
    DisplayFormat;
