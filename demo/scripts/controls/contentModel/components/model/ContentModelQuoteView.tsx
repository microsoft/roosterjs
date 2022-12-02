import * as React from 'react';
import { BackgroundColorFormatRenderer } from '../format/formatPart/BackgroundColorFormatRenderer';
import { BlockGroupContentView } from './BlockGroupContentView';
import { BorderFormatRenderers } from '../format/formatPart/BorderFormatRenderers';
import { ContentModelView } from '../ContentModelView';
import { DirectionFormatRenderers } from '../format/formatPart/DirectionFormatRenderers';
import { FontFamilyFormatRenderer } from '../format/formatPart/FontFamilyFormatRenderer';
import { FontSizeFormatRenderer } from '../format/formatPart/FontSizeFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { LineHeightFormatRenderer } from '../format/formatPart/LineHeightFormatRenderer';
import { MarginFormatRenderer } from '../format/formatPart/MarginFormatRenderer';
import { PaddingFormatRenderer } from '../format/formatPart/PaddingFormatRenderer';
import { TextColorFormatRenderer } from '../format/formatPart/TextColorFormatRenderer';
import { WhiteSpaceFormatRenderer } from '../format/formatPart/WhiteSpaceFormatRenderer';
import {
    ContentModelQuote,
    ContentModelQuoteFormat,
    ContentModelSegmentFormat,
    hasSelectionInBlock,
} from 'roosterjs-content-model';
import {
    BoldFormatRenderer,
    ItalicFormatRenderer,
    UnderlineFormatRenderer,
} from '../format/formatPart/BasicFormatRenderers';

const styles = require('./ContentModelQuoteView.scss');

const QuoteBlockFormatRenders: FormatRenderer<ContentModelQuoteFormat>[] = [
    BackgroundColorFormatRenderer,
    ...DirectionFormatRenderers,
    MarginFormatRenderer,
    PaddingFormatRenderer,
    LineHeightFormatRenderer,
    WhiteSpaceFormatRenderer,
    ...BorderFormatRenderers,
];
const QuoteSegmentFormatRenders: FormatRenderer<ContentModelSegmentFormat>[] = [
    TextColorFormatRenderer,
    FontSizeFormatRenderer,
    FontFamilyFormatRenderer,
    BoldFormatRenderer,
    ItalicFormatRenderer,
    UnderlineFormatRenderer,
];

export function ContentModelQuoteView(props: { quote: ContentModelQuote }) {
    const { quote } = props;
    const getContent = React.useCallback(() => {
        return <BlockGroupContentView group={quote} />;
    }, [quote]);

    const getFormat = React.useCallback(() => {
        return (
            <>
                <FormatView format={quote.format} renderers={QuoteBlockFormatRenders} />
                <FormatView
                    format={quote.quoteSegmentFormat}
                    renderers={QuoteSegmentFormatRenders}
                />
            </>
        );
    }, [quote]);

    return (
        <ContentModelView
            title="Quote"
            className={styles.modelQuote}
            hasSelection={hasSelectionInBlock(quote)}
            jsonSource={quote}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
