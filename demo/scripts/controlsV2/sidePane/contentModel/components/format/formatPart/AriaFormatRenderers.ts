import { AriaFormat } from 'roosterjs-content-model-types';
import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';

export const AriaFormatRenderers: FormatRenderer<AriaFormat>[] = [
    createTextFormatRenderer<AriaFormat>(
        'AriaDescribedBy',
        format => format.ariaDescribedBy,
        (format, value) => (format.ariaDescribedBy = value)
    ),
    createTextFormatRenderer<AriaFormat>(
        'Title',
        format => format.title,
        (format, value) => (format.title = value)
    ),
];
