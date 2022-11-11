import * as React from 'react';
import { BackgroundColorFormatRenderer } from './formatPart/BackgroundColorFormatRenderer';
import { BorderFormatRenderers } from './formatPart/BorderFormatRenderers';
import { ContentModelBlockFormat, ContentModelSegmentFormat } from 'roosterjs-content-model';
import { DirectionFormatRenderers } from './formatPart/DirectionFormatRenderers';
import { FormatRenderer } from './utils/FormatRenderer';
import { FormatView } from './FormatView';
import { LineHeightFormatRenderer } from './formatPart/LineHeightFormatRenderer';
import { MarginFormatRenderer } from './formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from './formatPart/PaddingFormatRenderer';
import { WhiteSpaceFormatRenderer } from './formatPart/WhiteSpaceFormatRenderer';

const BlockFormatRenders: FormatRenderer<ContentModelBlockFormat>[] = [
    BackgroundColorFormatRenderer,
    ...DirectionFormatRenderers,
    MarginFormatRenderer,
    PaddingFormatRenderer,
    LineHeightFormatRenderer,
];

export function BlockFormatView(props: { format: ContentModelSegmentFormat }) {
    const { format } = props;
    return <FormatView format={format} renderers={BlockFormatRenders} />;
}
