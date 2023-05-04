import * as React from 'react';
import { BackgroundColorFormatRenderer } from './formatPart/BackgroundColorFormatRenderer';
import { BorderFormatRenderers } from './formatPart/BorderFormatRenderers';
import { ContentModelBlockFormat, ContentModelSegmentFormat } from 'roosterjs-content-model';
import { DirectionFormatRenderer } from './formatPart/DirectionFormatRenderer';
import { FormatRenderer } from './utils/FormatRenderer';
import { FormatView } from './FormatView';
import { HtmlAlignFormatRenderer } from './formatPart/HtmlAlignFormatRenderer';
import { LineHeightFormatRenderer } from './formatPart/LineHeightFormatRenderer';
import { MarginFormatRenderer } from './formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from './formatPart/PaddingFormatRenderer';
import { TextAlignFormatRenderer } from './formatPart/TextAlignFormatRenderer';
import { WhiteSpaceFormatRenderer } from './formatPart/WhiteSpaceFormatRenderer';

const BlockFormatRenders: FormatRenderer<ContentModelBlockFormat>[] = [
    BackgroundColorFormatRenderer,
    DirectionFormatRenderer,
    TextAlignFormatRenderer,
    HtmlAlignFormatRenderer,
    MarginFormatRenderer,
    PaddingFormatRenderer,
    LineHeightFormatRenderer,
    WhiteSpaceFormatRenderer,
    ...BorderFormatRenderers,
];

export function BlockFormatView(props: { format: ContentModelSegmentFormat }) {
    const { format } = props;
    return <FormatView format={format} renderers={BlockFormatRenders} />;
}
