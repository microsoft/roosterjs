import isContentModelEditor from '../../editor/isContentModelEditor';
import { QuoteButtonStringKey, RibbonButton } from 'roosterjs-react';
import { toggleBlockQuote } from 'roosterjs-content-model';

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
        if (isContentModelEditor(editor)) {
            toggleBlockQuote(editor);
        }
        return true;
    },
};
