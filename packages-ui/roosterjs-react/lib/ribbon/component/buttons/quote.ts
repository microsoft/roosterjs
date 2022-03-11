import RibbonButton from '../../type/RibbonButton';
import { toggleBlockQuote } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Quote button
 */
export type QuoteButtonStringKey = 'buttonNameQuote';

/**
 * "Quote" button on the format ribbon
 */
export const quote: RibbonButton<QuoteButtonStringKey> = {
    key: 'buttonNameQuote',
    unlocalizedText: 'Quote',
    iconName: 'RightDoubleQuote',
    checked: formatState => formatState.isBlockQuote,
    onClick: editor => {
        toggleBlockQuote(editor);
        return true;
    },
};
