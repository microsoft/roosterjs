import { BorderFormat } from 'roosterjs-content-model';
import { createDropDownFormatRendererGroup } from '../utils/createDropDownFormatRenderer';
import { createTextFormatRendererGroup } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';

type BorderStyle = 'dashed' | 'dotted' | 'double' | 'groove' | 'none' | 'outset' | 'solid';
const BorderStyleValues: BorderStyle[] = [
    'dashed',
    'dotted',
    'double',
    'groove',
    'none',
    'outset',
    'solid',
];

type BorderWidthName = 'Width-top' | 'Width-right' | 'Width-Bottom' | 'Width-Left';
type BorderStyleName = 'Style-top' | 'Style-right' | 'Style-Bottom' | 'Style-Left';
type BorderColorName = 'Color-top' | 'Color-right' | 'Color-Bottom' | 'Color-Left';

const BorderWidthNames: BorderWidthName[] = [
    'Width-top',
    'Width-right',
    'Width-Bottom',
    'Width-Left',
];
const BorderStyleNames: BorderStyleName[] = [
    'Style-top',
    'Style-right',
    'Style-Bottom',
    'Style-Left',
];
const BorderColorNames: BorderColorName[] = [
    'Color-top',
    'Color-right',
    'Color-Bottom',
    'Color-Left',
];

export const BorderFormatRenderers: FormatRenderer<BorderFormat>[] = [
    createTextFormatRendererGroup<BorderFormat, BorderWidthName>(
        BorderWidthNames,
        format => extractBorder(format.borderWidth),
        (format, name, value) => {
            const values = extractBorder(format.borderWidth);
            values[BorderWidthNames.indexOf(name)] = value;
            format.borderWidth = values.join(' ');
            return undefined;
        }
    ),
    createDropDownFormatRendererGroup<BorderFormat, BorderStyle, BorderStyleName>(
        BorderStyleNames,
        BorderStyleValues,
        format => extractBorder(format.borderStyle) as BorderStyle[],
        (format, name, value) => {
            const values = extractBorder(format.borderStyle);
            values[BorderStyleNames.indexOf(name)] = value;
            format.borderStyle = values.join(' ');
            return undefined;
        }
    ),
    createTextFormatRendererGroup<BorderFormat, BorderColorName>(
        BorderColorNames,
        format => extractBorder(format.borderColor),
        (format, name, value) => {
            const values = extractBorder(format.borderColor);
            values[BorderColorNames.indexOf(name)] = value;
            format.borderColor = values.join(' ');
            return undefined;
        },
        'color'
    ),
];

function extractBorder(integratedBorder: string): string[] {
    const result = integratedBorder.split(' ');
    result[1] = result[1] || result[0];
    result[2] = result[2] || result[0];
    result[3] = result[3] || result[1];
    return result;
}
