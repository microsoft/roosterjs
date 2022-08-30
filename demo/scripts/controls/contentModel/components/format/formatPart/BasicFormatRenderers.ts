import { BoldFormat, ItalicFormat, StrikeFormat, UnderlineFormat } from 'roosterjs-content-model';
import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';

export const BoldFormatRenderer: FormatRenderer<BoldFormat> = createCheckboxFormatRenderer<
    BoldFormat
>(
    'Bold',
    format => format.bold,
    (format, value) => (format.bold = value)
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
