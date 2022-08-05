import { BorderFormat } from 'roosterjs-content-model';
import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
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

export const BorderFormatRenderers: FormatRenderer<BorderFormat>[] = [
    createTextFormatRenderer<BorderFormat>(
        'Width-top',
        format => format.borderWidth[0],
        (format, value) => {
            format.borderWidth[0] = value;
            return undefined;
        }
    ),
    createTextFormatRenderer<BorderFormat>(
        'Width-right',
        format => format.borderWidth[1],
        (format, value) => {
            format.borderWidth[1] = value;
            return undefined;
        }
    ),
    createTextFormatRenderer<BorderFormat>(
        'Width-bottom',
        format => format.borderWidth[2],
        (format, value) => {
            format.borderWidth[2] = value;
            return undefined;
        }
    ),
    createTextFormatRenderer<BorderFormat>(
        'Width-left',
        format => format.borderWidth[3],
        (format, value) => {
            format.borderWidth[3] = value;
            return undefined;
        }
    ),

    createDropDownFormatRenderer<BorderFormat, BorderStyle>(
        'Style-top',
        BorderStyleValues,
        format => format.borderStyle[0] as BorderStyle,
        (format, value) => {
            format.borderStyle[0] = value;
            return undefined;
        }
    ),
    createDropDownFormatRenderer<BorderFormat, BorderStyle>(
        'Style-right',
        BorderStyleValues,
        format => format.borderStyle[1] as BorderStyle,
        (format, value) => {
            format.borderStyle[1] = value;
            return undefined;
        }
    ),
    createDropDownFormatRenderer<BorderFormat, BorderStyle>(
        'Style-bottom',
        BorderStyleValues,
        format => format.borderStyle[2] as BorderStyle,
        (format, value) => {
            format.borderStyle[2] = value;
            return undefined;
        }
    ),
    createDropDownFormatRenderer<BorderFormat, BorderStyle>(
        'Style-left',
        BorderStyleValues,
        format => format.borderStyle[3] as BorderStyle,
        (format, value) => {
            format.borderStyle[3] = value;
            return undefined;
        }
    ),

    createTextFormatRenderer<BorderFormat>(
        'Color-top',
        format => format.borderColor[0],
        (format, value) => {
            format.borderColor[0] = value;
            return undefined;
        },
        'color'
    ),
    createTextFormatRenderer<BorderFormat>(
        'Color-right',
        format => format.borderColor[1],
        (format, value) => {
            format.borderColor[1] = value;
            return undefined;
        },
        'color'
    ),
    createTextFormatRenderer<BorderFormat>(
        'Color-bottom',
        format => format.borderColor[2],
        (format, value) => {
            format.borderColor[2] = value;
            return undefined;
        },
        'color'
    ),
    createTextFormatRenderer<BorderFormat>(
        'Color-left',
        format => format.borderColor[3],
        (format, value) => {
            format.borderColor[3] = value;
            return undefined;
        },
        'color'
    ),
];
