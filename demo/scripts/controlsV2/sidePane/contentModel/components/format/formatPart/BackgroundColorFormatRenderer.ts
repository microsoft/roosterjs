import { BackgroundColorFormat } from 'roosterjs-content-model-types';
import { createColorFormatRenderer } from '../utils/createColorFormatRender';
import { FormatRenderer } from '../utils/FormatRenderer';

export const BackgroundColorFormatRenderer: FormatRenderer<BackgroundColorFormat> = createColorFormatRenderer<
    BackgroundColorFormat
>(
    'Back color',
    format => format.backgroundColor,
    (format, value) => (format.backgroundColor = value)
);
