import { ContentModelSegmentFormat } from './ContentModelSegmentFormat';
import { IdFormat } from './formatParts/IdFormat';
import { ImageMetadataFormat } from './formatParts/ImageMetadataFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { SizeFormat } from './formatParts/SizeFormat';

/**
 * The format object for an image in Content Model
 */
export type ContentModelImageFormat = ContentModelSegmentFormat &
    ImageMetadataFormat &
    IdFormat &
    SizeFormat &
    MarginFormat &
    PaddingFormat;
