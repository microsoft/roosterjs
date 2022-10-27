import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { SizeFormat } from 'roosterjs-content-model';

export const SizeFormatRenderers: FormatRenderer<SizeFormat>[] = [
    createTextFormatRenderer<SizeFormat>(
        'Width',
        format => format.width,
        (format, value) => (format.width = value)
    ),
    createTextFormatRenderer<SizeFormat>(
        'Height',
        format => format.height,
        (format, value) => (format.height = value)
    ),
    createTextFormatRenderer<SizeFormat>(
        'MaxWidth',
        format => format.maxWidth,
        (format, value) => (format.maxWidth = value)
    ),
    createTextFormatRenderer<SizeFormat>(
        'MaxHeight',
        format => format.maxHeight,
        (format, value) => (format.maxHeight = value)
    ),
    createTextFormatRenderer<SizeFormat>(
        'MinWidth',
        format => format.minWidth,
        (format, value) => (format.minWidth = value)
    ),
    createTextFormatRenderer<SizeFormat>(
        'MinHeight',
        format => format.minHeight,
        (format, value) => (format.minHeight = value)
    ),
];
