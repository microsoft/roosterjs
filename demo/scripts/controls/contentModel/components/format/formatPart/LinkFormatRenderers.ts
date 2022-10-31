import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { LinkFormat } from 'roosterjs-content-model';

export const LinkFormatRenderers: FormatRenderer<LinkFormat>[] = [
    createTextFormatRenderer<LinkFormat>(
        'Href',
        format => format.href,
        (format, value) => (format.href = value)
    ),
    createTextFormatRenderer<LinkFormat>(
        'Target',
        format => format.target,
        (format, value) => (format.target = value)
    ),
    createTextFormatRenderer<LinkFormat>(
        'AnchorId',
        format => format.anchorId,
        (format, value) => (format.anchorId = value)
    ),
    createTextFormatRenderer<LinkFormat>(
        'AnchorClass',
        format => format.anchorClass,
        (format, value) => (format.anchorClass = value)
    ),
    createTextFormatRenderer<LinkFormat>(
        'AnchorTitle',
        format => format.anchorTitle,
        (format, value) => (format.anchorTitle = value)
    ),
    createTextFormatRenderer<LinkFormat>(
        'Relationship',
        format => format.relationship,
        (format, value) => (format.relationship = value)
    ),
];
