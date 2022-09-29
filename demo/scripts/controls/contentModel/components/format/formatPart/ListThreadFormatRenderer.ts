import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { ListThreadFormat } from 'roosterjs-content-model';

export const ListThreadFormatRenderers: FormatRenderer<ListThreadFormat>[] = [
    createTextFormatRenderer(
        'Start number',
        format => format.startNumberOverride + '',
        (format, value) => (format.startNumberOverride = parseInt(value)),
        'number'
    ),
];
