import RibbonButton from '../../type/RibbonButton';
import { QuoteButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleBlockQuote } from 'roosterjs-editor-api';

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
