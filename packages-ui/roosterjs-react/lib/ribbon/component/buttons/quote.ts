import { toggleBlockQuote } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { QuoteButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Quote" button on the format ribbon
 */
export const quote: RibbonButton<QuoteButtonStringKey> = {
    key: 'buttonNameQuote',
    unlocalizedText: 'Quote',
    iconName: 'RightDoubleQuote',
    isChecked: formatState => !!formatState.isBlockQuote,
    onClick: editor => {
        toggleBlockQuote(editor);
        return true;
    },
};
