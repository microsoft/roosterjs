import * as React from 'react';
import { BackgroundColorFormatRenderer } from './formatPart/BackgroundColorFormatRenderer';
import { ContentModelBlockFormat, ContentModelSegmentFormat } from 'roosterjs-content-model';
import { DirectionFormatRenderers } from './formatPart/DirectionFormatRenderers';
import { FormatRenderer } from './utils/FormatRenderer';
import { FormatView } from './FormatView';
import { MarginFormatRenderer } from './formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from './formatPart/PaddingFormatRenderer';

const BlockFormatRenders: FormatRenderer<ContentModelBlockFormat>[] = [
    BackgroundColorFormatRenderer,
    ...DirectionFormatRenderers,
    MarginFormatRenderer,
    PaddingFormatRenderer,
];

export function BlockFormatView(props: { format: ContentModelSegmentFormat }) {
    const { format } = props;
    return <FormatView format={format} renderers={BlockFormatRenders} />;
}
