import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { ImageStateFormat } from 'roosterjs-content-model-types';

export const ImageStateFormatRenderer: FormatRenderer<ImageStateFormat> = createTextFormatRenderer<
    ImageStateFormat
>(
    'ImageState',
    format => format.imageState,
    (format, value) => (format.imageState = value)
);
