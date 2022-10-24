import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { ImageMetadataFormat } from 'roosterjs-content-model';

export const ImageMetadataFormatRenderers: FormatRenderer<ImageMetadataFormat>[] = [
    createTextFormatRenderer<ImageMetadataFormat>(
        'MetadataWidth',
        format => (format.widthPx || '') + '',
        (format, value) => (format.widthPx = parseFloat(value)),
        'number'
    ),
    createTextFormatRenderer<ImageMetadataFormat>(
        'MetadataHeight',
        format => (format.heightPx || '') + '',
        (format, value) => (format.heightPx = parseFloat(value)),
        'number'
    ),
    createTextFormatRenderer<ImageMetadataFormat>(
        'MetadataLeft',
        format => (format.leftPercent || '') + '',
        (format, value) => (format.leftPercent = parseFloat(value)),
        'number'
    ),
    createTextFormatRenderer<ImageMetadataFormat>(
        'MetadataRight',
        format => (format.rightPercent || '') + '',
        (format, value) => (format.rightPercent = parseFloat(value)),
        'number'
    ),
    createTextFormatRenderer<ImageMetadataFormat>(
        'MetadataTop',
        format => (format.topPercent || '') + '',
        (format, value) => (format.topPercent = parseFloat(value)),
        'number'
    ),
    createTextFormatRenderer<ImageMetadataFormat>(
        'MetadataBottom',
        format => (format.bottomPercent || '') + '',
        (format, value) => (format.bottomPercent = parseFloat(value)),
        'number'
    ),
    createTextFormatRenderer<ImageMetadataFormat>(
        'MetadataAngle',
        format => (format.angleRad || '') + '',
        (format, value) => (format.angleRad = parseFloat(value)),
        'number'
    ),
    createTextFormatRenderer<ImageMetadataFormat>(
        'OriginalSrc',
        format => format.src,
        () => {},
        'multiline'
    ),
    createTextFormatRenderer<ImageMetadataFormat>(
        'NaturalWidth',
        format => (format.naturalWidth || '') + '',
        () => {},
        'number'
    ),
    createTextFormatRenderer<ImageMetadataFormat>(
        'NaturalHeight',
        format => (format.naturalHeight || '') + '',
        () => {},
        'number'
    ),
];
