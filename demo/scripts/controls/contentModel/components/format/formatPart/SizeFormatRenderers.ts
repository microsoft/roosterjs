import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { SizeFormat } from 'roosterjs-content-model';

export const SizeFormatRenderers: FormatRenderer<SizeFormat>[] = [
    createTextFormatRenderer<SizeFormat>(
        'Width',
        format => format.width + '',
        (format, value) => (format.width = parseFloat(value)),
        'number'
    ),
    createTextFormatRenderer<SizeFormat>(
        'Height',
        format => format.height + '',
        (format, value) => (format.height = parseFloat(value)),
        'number'
    ),
];
