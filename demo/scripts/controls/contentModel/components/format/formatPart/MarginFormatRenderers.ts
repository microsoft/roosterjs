import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { MarginFormat } from 'roosterjs-content-model';

export const MarginFormatRenderers: FormatRenderer<MarginFormat>[] = [
    createTextFormatRenderer<MarginFormat>(
        'Margin-top',
        format => format.marginTop,
        (format, value) => {
            format.marginTop = value;
            return undefined;
        }
    ),
    createTextFormatRenderer<MarginFormat>(
        'Margin-bottom',
        format => format.marginBottom,
        (format, value) => {
            format.marginBottom = value;
            return undefined;
        }
    ),
    createTextFormatRenderer<MarginFormat>(
        'Margin-left',
        format => format.marginLeft,
        (format, value) => {
            format.marginLeft = value;
            return undefined;
        }
    ),
    createTextFormatRenderer<MarginFormat>(
        'Margin-right',
        format => format.marginRight,
        (format, value) => {
            format.marginRight = value;
            return undefined;
        }
    ),
];
