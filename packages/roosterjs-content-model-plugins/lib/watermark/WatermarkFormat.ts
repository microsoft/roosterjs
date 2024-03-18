import type {
    FontFamilyFormat,
    FontSizeFormat,
    TextColorFormat,
} from 'roosterjs-content-model-types';

/**
 * Format type of watermark text
 */
export type WatermarkFormat = FontFamilyFormat & FontSizeFormat & TextColorFormat;
