import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import {
    BoldFormat,
    ItalicFormat,
    StrikeFormat,
    SuperOrSubScriptFormat,
    UnderlineAndLinkFormat,
} from 'roosterjs-content-model';

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

export const UnderlineAndLinkFormatRenderers: FormatRenderer<UnderlineAndLinkFormat>[] = [
    createCheckboxFormatRenderer<UnderlineAndLinkFormat>(
        'Underline',
        format => format.underline,
        (format, value) => (format.underline = value)
    ),
    createTextFormatRenderer<UnderlineAndLinkFormat>(
        'Href',
        format => format.href,
        (format, value) => (format.href = value)
    ),
    createTextFormatRenderer<UnderlineAndLinkFormat>(
        'Target',
        format => format.target,
        (format, value) => (format.target = value)
    ),
    createTextFormatRenderer<UnderlineAndLinkFormat>(
        'AnchorId',
        format => format.anchorId,
        (format, value) => (format.anchorId = value)
    ),
    createTextFormatRenderer<UnderlineAndLinkFormat>(
        'AnchorClass',
        format => format.anchorClass,
        (format, value) => (format.anchorClass = value)
    ),
    createTextFormatRenderer<UnderlineAndLinkFormat>(
        'AnchorTitle',
        format => format.anchorTitle,
        (format, value) => (format.anchorTitle = value)
    ),
    createTextFormatRenderer<UnderlineAndLinkFormat>(
        'Relationship',
        format => format.relationship,
        (format, value) => (format.relationship = value)
    ),
];

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
