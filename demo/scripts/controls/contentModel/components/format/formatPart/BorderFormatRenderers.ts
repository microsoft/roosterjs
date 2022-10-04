import { BorderFormat, combineBorderValue, extractBorderValues } from 'roosterjs-content-model';
import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';

type BorderStyle =
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'groove'
    | 'none'
    | 'outset'
    | 'solid'
    | 'hidden'
    | 'ridge'
    | 'inset';
const BorderStyles: BorderStyle[] = [
    'none',
    'hidden',
    'dotted',
    'dashed',
    'solid',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
];

function createBorderRenderer(position: keyof BorderFormat): FormatRenderer<BorderFormat>[] {
    return [
        createTextFormatRenderer<BorderFormat>(
            position + 'Width',
            format => extractBorderValues(format[position]).width,
            (format, newValue) => {
                const border = extractBorderValues(format[position]);
                border.width = newValue;
                format[position] = combineBorderValue(border);
            }
        ),
        createDropDownFormatRenderer<BorderFormat, BorderStyle>(
            position + 'Style',
            BorderStyles,
            format => extractBorderValues(format[position]).style as BorderStyle,
            (format, newValue) => {
                const border = extractBorderValues(format[position]);
                border.style = newValue;
                format[position] = combineBorderValue(border);
            }
        ),
        createTextFormatRenderer<BorderFormat>(
            position + 'Color',
            format => extractBorderValues(format[position]).color,
            (format, newValue) => {
                const border = extractBorderValues(format[position]);
                border.color = newValue;
                format[position] = combineBorderValue(border);
            }
        ),
    ];
}

export const BorderFormatRenderers: FormatRenderer<BorderFormat>[] = [
    ...createBorderRenderer('borderTop'),
    ...createBorderRenderer('borderRight'),
    ...createBorderRenderer('borderBottom'),
    ...createBorderRenderer('borderLeft'),
];
