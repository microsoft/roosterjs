import * as React from 'react';
import { BackgroundColorFormatRenderer } from './formatPart/BackgroundColorFormatRenderer';
import { ContentModelSegmentFormat } from 'roosterjs-content-model';
import { FontFamilyFormatRenderer } from './formatPart/FontFamilyFormatRenderer';
import { FontSizeFormatRenderer } from './formatPart/FontSizeFormatRenderer';
import { FormatRenderer } from './utils/FormatRenderer';
import { FormatView } from './FormatView';
import { TextColorFormatRenderer } from './formatPart/TextColorFormatRenderer';
import {
    BoldFormatRenderer,
    ItalicFormatRenderer,
    StrikeFormatRenderer,
    UnderlineAndLinkFormatRenderers,
    SuperOrSubScriptFormatRenderer,
} from './formatPart/BasicFormatRenderers';

const SegmentFormatRenders: FormatRenderer<ContentModelSegmentFormat>[] = [
    TextColorFormatRenderer,
    BackgroundColorFormatRenderer,
    FontSizeFormatRenderer,
    FontFamilyFormatRenderer,
    BoldFormatRenderer,
    ItalicFormatRenderer,
    ...UnderlineAndLinkFormatRenderers,
    StrikeFormatRenderer,
    SuperOrSubScriptFormatRenderer,
];

export function SegmentFormatView(props: { format: ContentModelSegmentFormat }) {
    const { format } = props;
    return <FormatView format={format} renderers={SegmentFormatRenders} />;
}
