import ContentModelRibbonButton from './ContentModelRibbonButton';
import { toggleBlockQuote } from 'roosterjs-content-model-editor';
import { QuoteButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Block quote" button on the format ribbon
 */
export const blockQuoteButton: ContentModelRibbonButton<QuoteButtonStringKey> = {
    key: 'buttonNameQuote',
    unlocalizedText: 'Quote',
    iconName: 'RightDoubleQuote',
    isChecked: formatState => !!formatState.isBlockQuote,
    onClick: editor => {
        toggleBlockQuote(editor);
        return true;
    },
};
