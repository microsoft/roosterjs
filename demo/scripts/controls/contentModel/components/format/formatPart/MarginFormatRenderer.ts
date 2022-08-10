import { combineBorderValue, extractBorderValues, MarginFormat } from 'roosterjs-content-model';
import { createTextFormatRendererGroup } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';

type MarginName = 'Margin-top' | 'Margin-right' | 'Margin-bottom' | 'Margin-left';
const MarginNames: MarginName[] = ['Margin-top', 'Margin-right', 'Margin-bottom', 'Margin-left'];

export const MarginFormatRenderer: FormatRenderer<MarginFormat> = createTextFormatRendererGroup<
    MarginFormat,
    MarginName
>(
    MarginNames,
    format => extractBorderValues(format.margin),
    (format, name, value) => {
        const values = extractBorderValues(format.margin);
        values[MarginNames.indexOf(name)] = value;
        format.margin = combineBorderValue(values, '0');
    }
);
