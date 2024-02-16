import { toggleBlockQuote } from 'roosterjs-content-model-api';
import type { QuoteButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * @internal
 * "Block quote" button on the format ribbon
 */
export const blockQuoteButton: RibbonButton<QuoteButtonStringKey> = {
    key: 'buttonNameQuote',
    unlocalizedText: 'Quote',
    iconName: 'RightDoubleQuote',
    isChecked: formatState => !!formatState.isBlockQuote,
    onClick: editor => {
        toggleBlockQuote(editor);
    },
};
