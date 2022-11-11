import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import {
    BoldFormat,
    ItalicFormat,
    StrikeFormat,
    SuperOrSubScriptFormat,
    UnderlineFormat,
} from 'roosterjs-content-model';

export const BoldFormatRenderer: FormatRenderer<BoldFormat> = createTextFormatRenderer<BoldFormat>(
    'Bold',
    format => format.fontWeight,
    (format, value) => (format.fontWeight = value)
);

export const ItalicFormatRenderer: FormatRenderer<ItalicFormat> = createCheckboxFormatRenderer<
    ItalicFormat
>(
    'Italic',
    format => format.italic,
    (format, value) => (format.italic = value)
);

export const UnderlineFormatRenderer: FormatRenderer<UnderlineFormat> = createCheckboxFormatRenderer<
    UnderlineFormat
>(
    'Underline',
    format => format.underline,
    (format, value) => (format.underline = value)
);

export const StrikeFormatRenderer: FormatRenderer<StrikeFormat> = createCheckboxFormatRenderer<
    StrikeFormat
>(
    'Strike',
    format => format.strikethrough,
    (format, value) => (format.strikethrough = value)
);

export const SuperOrSubScriptFormatRenderer: FormatRenderer<SuperOrSubScriptFormat> = createTextFormatRenderer<
    SuperOrSubScriptFormat
>(
    'SuperOrSubScript',
    format => format.superOrSubScriptSequence,
    (format, value) => (format.superOrSubScriptSequence = value)
);
