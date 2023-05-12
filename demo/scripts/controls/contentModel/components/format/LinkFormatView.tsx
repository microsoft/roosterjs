import * as React from 'react';
import { ContentModelHyperLinkFormat, LinkFormat } from 'roosterjs-content-model';
import { createTextFormatRenderer } from './utils/createTextFormatRenderer';
import { DisplayFormatRenderer } from './formatPart/DisplayFormatRenderer';
import { FormatRenderer } from './utils/FormatRenderer';
import { FormatView } from './FormatView';
import { MarginFormatRenderer } from './formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from './formatPart/PaddingFormatRenderer';
import { TextColorFormatRenderer } from './formatPart/TextColorFormatRenderer';
import { UnderlineFormatRenderer } from './formatPart/BasicFormatRenderers';

const LinkFormatRenderers: FormatRenderer<ContentModelHyperLinkFormat>[] = [
    createTextFormatRenderer<LinkFormat>(
        'Name',
        format => format.name,
        (format, value) => (format.name = value)
    ),
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
    TextColorFormatRenderer,
    UnderlineFormatRenderer,
    DisplayFormatRenderer,
    MarginFormatRenderer,
    PaddingFormatRenderer,
];

export function LinkFormatView(props: { format: LinkFormat }) {
    const { format } = props;
    return <FormatView format={format} renderers={LinkFormatRenderers} />;
}
