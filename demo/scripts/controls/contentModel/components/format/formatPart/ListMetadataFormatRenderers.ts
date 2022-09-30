import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { ListMetadataFormat } from 'roosterjs-content-model';

export const ListMetadataFormatRenderers: FormatRenderer<ListMetadataFormat>[] = [
    createTextFormatRenderer(
        'Ordered style',
        format => format.orderedStyleType + '',
        (format, value) => (format.orderedStyleType = parseInt(value)),
        'number'
    ),
    createTextFormatRenderer(
        'Unordered style',
        format => format.unorderedStyleType + '',
        (format, value) => (format.unorderedStyleType = parseInt(value)),
        'number'
    ),
];
