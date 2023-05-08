import * as React from 'react';
import { BackgroundColorFormatRenderer } from './formatPart/BackgroundColorFormatRenderer';
import { ContentModelSegmentFormat } from 'roosterjs-content-model';
import { FontFamilyFormatRenderer } from './formatPart/FontFamilyFormatRenderer';
import { FontSizeFormatRenderer } from './formatPart/FontSizeFormatRenderer';
import { FormatRenderer } from './utils/FormatRenderer';
import { FormatView } from './FormatView';
import { LetterSpacingFormatRenderer } from './formatPart/LetterSpacingFormatRenderer';
import { LineHeightFormatRenderer } from './formatPart/LineHeightFormatRenderer';
import { TextColorFormatRenderer } from './formatPart/TextColorFormatRenderer';
import {
    BoldFormatRenderer,
    ItalicFormatRenderer,
    StrikeFormatRenderer,
    UnderlineFormatRenderer,
    SuperOrSubScriptFormatRenderer,
} from './formatPart/BasicFormatRenderers';

const SegmentFormatRenders: FormatRenderer<ContentModelSegmentFormat>[] = [
    TextColorFormatRenderer,
    BackgroundColorFormatRenderer,
    FontSizeFormatRenderer,
    FontFamilyFormatRenderer,
    BoldFormatRenderer,
    ItalicFormatRenderer,
    UnderlineFormatRenderer,
    StrikeFormatRenderer,
    SuperOrSubScriptFormatRenderer,
    LineHeightFormatRenderer,
    LetterSpacingFormatRenderer,
];

export function SegmentFormatView(props: { format: ContentModelSegmentFormat }) {
    const { format } = props;
    return <FormatView format={format} renderers={SegmentFormatRenders} />;
}
