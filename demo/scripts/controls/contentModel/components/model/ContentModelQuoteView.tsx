import * as React from 'react';
import { BlockGroupContentView } from './BlockGroupContentView';
import { ContentModelQuote, hasSelectionInBlock } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';

const styles = require('./ContentModelQuoteView.scss');

export function ContentModelQuoteView(props: { quote: ContentModelQuote }) {
    const { quote } = props;
    const getContent = React.useCallback(() => {
        return <BlockGroupContentView group={quote} />;
    }, [quote]);

    return (
        <ContentModelView
            title="Quote"
            className={styles.modelQuote}
            hasSelection={hasSelectionInBlock(quote)}
            jsonSource={quote}
            getContent={getContent}
        />
    );
}
