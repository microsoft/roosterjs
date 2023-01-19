import * as React from 'react';
import { BlockFormatView } from '../format/BlockFormatView';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelView } from '../ContentModelView';
import { FontFamilyFormatRenderer } from '../format/formatPart/FontFamilyFormatRenderer';
import { FontSizeFormatRenderer } from '../format/formatPart/FontSizeFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';
import { TextColorFormatRenderer } from '../format/formatPart/TextColorFormatRenderer';
import {
    ContentModelQuote,
    ContentModelSegmentFormat,
    hasSelectionInBlock,
} from 'roosterjs-content-model';
import {
    BoldFormatRenderer,
    ItalicFormatRenderer,
    UnderlineFormatRenderer,
} from '../format/formatPart/BasicFormatRenderers';

const styles = require('./ContentModelQuoteView.scss');

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
                <BlockFormatView format={quote.format} />
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
