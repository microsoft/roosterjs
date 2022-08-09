import { BorderFormat, extractBorderValues } from 'roosterjs-content-model';
import { createColorFormatRendererGroup } from '../utils/createColorFormatRender';
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
        format => extractBorderValues(format.borderWidth),
        (format, name, value) => {
            const values = extractBorderValues(format.borderWidth);
            values[BorderWidthNames.indexOf(name)] = value;
            format.borderWidth = values.join(' ');
            return undefined;
        }
    ),
    createDropDownFormatRendererGroup<BorderFormat, BorderStyle, BorderStyleName>(
        BorderStyleNames,
        BorderStyleValues,
        format => extractBorderValues(format.borderStyle) as BorderStyle[],
        (format, name, value) => {
            const values = extractBorderValues(format.borderStyle);
            values[BorderStyleNames.indexOf(name)] = value;
            format.borderStyle = values.join(' ');
            return undefined;
        }
    ),
    createColorFormatRendererGroup<BorderFormat, BorderColorName>(
        BorderColorNames,
        format => extractBorderValues(format.borderColor),
        (format, name, value) => {
            const values = extractBorderValues(format.borderColor);
            values[BorderColorNames.indexOf(name)] = value;
            format.borderColor = values.join(' ');
            return undefined;
        }
    ),
];
